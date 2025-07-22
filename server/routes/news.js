const express = require('express')
const router = express.Router()
const News = require('../models/news')
const authenticateToken = require('../middleware/auth')

const multer = require('multer')
const { CloudinaryStorage } = require('multer-storage-cloudinary')
const cloudinary = require('cloudinary').v2

require('dotenv').config()


// 圖片上傳相關
//// 配置 cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const batchUpload = async (files, batchSize = 5, transformType = 'large') => {
  const results = []

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize)

    const uploadPromises = batch.map(file => cloudinary.uploader.upload(file.path, {
      folder: 'news',
      format: 'jpg',
      public_id: Date.now() + '-' + file.originalname.split('.')[0],
      transformation: [{ width: 1920, height: 1080, crop: 'limit', quality: 'auto', fetch_format: 'auto' }]
    }).then(result => ({
      imageURL: result.secure_url,
      imagePublicId: result.public_id
    })).catch(err => null))

    const settled = await Promise.allSettled(uploadPromises)
    results.push(...settled.filter(r => r.status === 'fulfilled').map(r => r.value))
    await delay(500)
  }
  return results
}

// 多張圖片依規格上傳
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: 'news',
      format: 'jpg'
    }
  }
})

// 限制檔案類型以及大小
const upload = multer({ 
  storage,
  fileFilter: (req, file, callback) => {
    const allowedMimeTypes = ["image/jpeg", "image/png"]
    if (!allowedMimeTypes.includes(file.mimetype)) {
      return callback(new Error("僅接受 JPG 或 PNG 格式的圖片"))
    }
    callback(null, true)
  }
})


// 限制上傳的圖片數量
const uploadFields = upload.fields([
  { name: "mainImage" },
  { name: "newsImages" }
])

// 新增/編輯新聞資訊

router.post("/:type", authenticateToken, uploadFields, async (req, res) => {
  // 透過 upload 上傳圖片至 cloudinary 並取得相關資訊
  const mainImage = req.files["mainImage"] ? req.files["mainImage"][0] : null
  let imageURL = null
  let imagePublicId = null
  if (mainImage) {
    const [result] = await batchUpload([mainImage], 1, 'large')
    imageURL = result?.imageURL || null
    imagePublicId = result?.imagePublicId || null
  }

  // 多圖 newsImages 分批處理
  const newsImages = req.files["newsImages"] || []
  let newsImagesData = []
  if (newsImages.length > 0) {
    newsImagesData = await batchUpload(newsImages, 5, 'large')
  }

  req.body.topic = JSON.parse(req.body.topic)
  req.body.description = JSON.parse(req.body.description)
  req.body.detail = JSON.parse(req.body.detail)
  req.body.content = JSON.parse(req.body.content)

  let news
  let status
  let wording

  const type = req.params.type
  if (type == 'edit') {
    try {
      news = await News.findById(req.body._id)
      Object.assign(news, req.body)
      status = 200
      wording = '修改'
    } catch (err) {
      res
        .status(400)
        .json({ message: err.message })
    }
  } else if (type == 'add') {
    news = new News({ ...req.body })
    status = 201
    wording = '新增'
  }

  // 若有新的 imagePublicId 則刪除舊的
  if (imagePublicId) {
    if (news.imagePublicId) {
      await cloudinary.uploader.destroy(news.imagePublicId)
    }
    news.imagePublicId = imagePublicId
    news.imageURL = imageURL
  }

  // 若有新的 subImages 則刪除舊的
  const deleteNewsImages = []
  if (newsImagesData && newsImagesData.length > 0) {
    req.body.updateNewsImages = JSON.parse(req.body.updateNewsImages)
    const newImages = []
    req.body.content.forEach( (item, listIdx) => {
      item.article.forEach( (image, idx) => {
        newImages.push({
          listIdx: listIdx,
          idx: idx,
          image: image
        })
      })
    })
    const updateNewsImages = newImages.map( newImage => {
      let image
      for (const update of req.body.updateNewsImages) {
        if (update.index[0] == newImage.listIdx && update.index[1] == newImage.idx) {
          newsImagesData.forEach( data => {
            let checkName = data.imagePublicId.split("-")[1]
            if (update.name == checkName) {
              image = data
            }
          })
          if (news.content[newImage.listIdx].article[newImage.idx] && news.content[newImage.listIdx].article[newImage.idx].imagePublicId) {
            deleteNewsImages.push(news.content[newImage.listIdx].article[newImage.idx].imagePublicId)
          }
        }
      }
      if (!image) {
        return {
          'listIdx': newImage.listIdx,
          'idx': newImage.idx,
          'imageURL': newImage.image.imageURL,
          'imagePublicId': newImage.image.imagePublicId
        }
      } else {
        return {
          'listIdx': newImage.listIdx,
          'idx': newImage.idx,
          'imageURL': image.imageURL,
          'imagePublicId': image.imagePublicId
        }
      }
    })
    for (const image of deleteNewsImages) {
      try {
        await cloudinary.uploader.destroy(image)
      } catch (err) {
        return res
                .status(400)
                .json({ message: err.message })
      }
    }
    updateNewsImages.forEach( update => {
      news.content[update.listIdx].article[update.idx].imageURL = update.imageURL
      news.content[update.listIdx].article[update.idx].imagePublicId = update.imagePublicId
    })
    news.markModified('content')
  }

  try {
    await news.save()
    res.status(status).send()
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message })
  }
})


// api
//// 取得產品列表

router.get("/", getNews, (req, res) => {
  res.json(res.news)
})


//// 依 ID 取得產品

router.get("/:id", async(req, res) => {
  try {
    const news = await News.findById(req.params.id)
    if (news) {
      res.json(news)
    } else {
      return res
              .status(404)
              .json({
                message: "Can't find news."
              })
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message })
  }
})


//// 依 ID 刪除產品

router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const news = await News.findById(req.params.id)
    if (news.imagePublicId) {
      await cloudinary.uploader.destroy(news.imagePublicId)
    }
    
    await news.deleteOne()
    res.json(`已成功刪除產品： ${news.name}`)
  } catch (err) {
    res
      .status(500)
      .json({ message: "Remove news faild." })
  }
})


//// 依條件查詢資料庫

async function getNews(req, res, next) {
  const { 
    page = 1,
    size = 999,
    status,
    category,
    sortBy = "_id",
    sortOrder = "asc"
  } = req.query

  const pageNumber = parseInt(page, 10)
  const pageSize = parseInt(size, 10)

  const filter = {}
  if (category) { filter.category = category }
  if (status) { filter.status = status }

  const sortDirection = sortOrder === "desc" ? -1 : 1
  const sort = { [sortBy]: sortDirection }

  try {
    const total = await News.countDocuments(filter);
    const news = await News
                            .find(filter)
                            .sort(sort)
                            .skip((pageNumber - 1) * pageSize)
                            .limit(pageSize)
    if (news == undefined) {
        return res
                .status(404)
                .json({
                  message: "Can't find news."
                })
    }

    const categoryStats = await News.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: "$category", count: { $sum: 1 } } }
    ])

    const categoryAmount = {}
    for (const item of categoryStats) {
      categoryAmount[item._id] = item.count
    }
    
    res.news = {
      data: news,
      pagination: {
        total,
        currentPage: pageNumber,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      categoryAmount
    }
    next()
  } catch (err) {
      res
        .status(500)
        .json({ message: err.message })
  }
}

module.exports = router