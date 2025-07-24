const express = require('express')
const router = express.Router()
const Inquiry = require('../models/inquiry')
const authenticateToken = require('../middleware/auth')

const path = require('path')
const fs = require('fs')
const { createReport } = require('docx-templates')

const nodemailer = require('nodemailer')
const puppeteer = require('puppeteer')
const os = require('os')

async function sendHtmlReportEmail(data) {
  const htmlContent = `<html>
    <body>
      <h1>${data.name} 的報告</h1>
      <p>內容：${data.content}</p>
    </body>
  </html>`

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'contact@eonian.space',
      pass: 'mrhe zmew umzt kard',
    },
  })

  await transporter.sendMail({
    from: 'contact@eonian.space',
    to: 'contact@eonian.space',
    subject: '自動產生的報告',
    html: htmlContent, // ✅ 使用 HTML 內容
  })

  console.log('HTML 報告已寄出')
}


require('dotenv').config()

// api
//// 取得所有詢問表單

router.get("/", getInquirys, (req, res) => {
  res.json(res.inquirys)
})


//// 下載表單

router.get("/download/:id", async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    if (inquiry) {
      const templatePath = path.join(__dirname, '..', 'templates', 'report-template.docx')
      const template = fs.readFileSync(templatePath)

      const docxBuffer = await createReport({
        template,
        data: {
          ...inquiry.data,
          ...inquiry.printData,
          category: inquiry.category,
          status: inquiry.status,
          createTime: inquiry.createTime,
        },
        cmdDelimiter: ['{{', '}}']
      })

      fs.writeFileSync('./test.docx', docxBuffer)

      const mailData = {
        name: inquiry.name || '無名',
        content: inquiry.data?.content || '無內容', // 確保有字串
      }

      await sendHtmlReportEmail(mailData)

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', 'attachment; filename=report.docx')
      res.setHeader('Content-Length', docxBuffer.length)
      res.status(200)
      res.end(docxBuffer)
    } else {
      return res
              .status(404)
              .json({
                message: "Can't find inquiry."
              })
    }
  } catch (err) {
    console.error('Error generating docx:', err)
    res.status(500).send('產生 Word 文件失敗')
  }
})

router.get("/handleInquiry/:id", async (req, res) => {
  try {
    const { id } = req.params
    const { send, download } = req.query

    const inquiry = await Inquiry.findById(id)
    if (!inquiry) {
      return res.status(404).json({ message: "找不到資料" })
    }

    // 如果要寄信
    if (send === 'true') {
      await sendHtmlReportEmail({
        name: inquiry.name || '無名',
        content: inquiry.data?.content || '無內容',
      })
    }

    // 如果要下載 PDF
    if (download === 'true') {
      const templatePath = path.join(__dirname, '..', 'templates', 'report-template.docx')
      const template = fs.readFileSync(templatePath)

      const docxBuffer = await createReport({
        template,
        data: {
          ...inquiry.data,
          ...inquiry.printData,
          category: inquiry.category,
          status: inquiry.status,
          createTime: inquiry.createTime,
        },
        cmdDelimiter: ['{{', '}}']
      })

      fs.writeFileSync('./test.docx', docxBuffer)

      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document')
      res.setHeader('Content-Disposition', 'attachment; filename=report.docx')
      res.setHeader('Content-Length', docxBuffer.length)

      return res.status(200).end(docxBuffer)
    }

    // 如果都沒有下載就回傳處理成功
    return res.status(200).json({ message: '報告處理完成' })

  } catch (err) {
    console.error('處理報告失敗:', err)
    res.status(500).send('處理報告失敗')
  }
})

const generateFilledPdf = require('../utils/generateFilledPdf');

router.get("/handleInquiryByPdf/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { download, format = 'pdf' } = req.query;

    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      return res.status(404).json({ message: "找不到資料" });
    }

    if (download === 'true' && format === 'pdf') {
      const pdfBuffer = await generateFilledPdf({
        serialNumber: inquiry.printData?.serialNumber || 'N/A',
        date: inquiry.printData?.date || 'N/A',
        application: inquiry.printData?.application || '',
        model: inquiry.printData?.model || '',
        spec: inquiry.printData?.spec || '',
        color: inquiry.printData?.color || '',
        amount: inquiry.printData?.amount || '',
      });

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=quotation.pdf');
      res.setHeader('Content-Length', pdfBuffer.length);
      return res.status(200).end(pdfBuffer);
    }

    return res.status(200).json({ message: '報告處理完成（未下載）' });

  } catch (err) {
    console.error('PDF 產出失敗:', err);
    res.status(500).send('處理報告失敗');
  }
});



//// 依 ID 取得詢問表單

router.get("/:id", async(req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id)
    if (inquiry) {
      res.json(inquiry)
    } else {
      return res
              .status(404)
              .json({
                message: "Can't find inquiry."
              })
    }
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message })
  }
})


// 新增/編輯諮詢表單資訊

router.post("/:type", async (req, res) => {
  let inquiry = null
  let status = null

  const type = req.params.type
  if (type == 'edit') {
    try {
      inquiry = await Inquiry.findById(req.body._id)
      Object.assign(inquiry, req.body)
      status = 200
      wording = '修改'
    } catch (err) {
      res
        .status(400)
        .json({ message: err.message })
    }
  } else if (type == 'add') {
    inquiry = new Inquiry({ ...req.body })
    status = 201
    wording = '新增'
  }

  try {
    await inquiry.save()
    let id = (status == 201)? inquiry._id : null
    res.status(status).send(id)
  } catch (err) {
    res
      .status(400)
      .json({ message: err.message })
  }
})


//// 依條件查詢資料庫

async function getInquirys(req, res, next) {
  const {
    status,
    category,
    sortBy = "_id",
    sortOrder = "asc"
  } = req.query

  const filter = {}
  if (category) { filter.category = category }
  if (status) { filter.status = status }

  const sortDirection = sortOrder === "desc" ? -1 : 1
  const sort = { [sortBy]: sortDirection }

  try {
    const total = await Inquiry.countDocuments(filter);
    const inquirys = await Inquiry
                            .find(filter)
                            .sort(sort)
    if (inquirys == undefined) {
        return res
                .status(404)
                .json({
                  message: "Can't find inquiry."
                })
    } else {
      res.inquirys = {
        data: inquirys,
        pagination: {
          total
        }
      }
      next()
    }
  } catch (err) {
      res
        .status(500)
        .json({ message: err.message })
  }
}

module.exports = router