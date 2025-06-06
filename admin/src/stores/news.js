import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useNewsStore = defineStore('news', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { openDialog, errorHandle } = storeToRefs(dialogStore)

  const statusList = ref([
    { value: 'draft', label: '草稿' },
    { value: 'active', label: '上架' },
    { value: 'inactive', label: '下架' },
    { value: 'archived', label: '封存' }
  ])

  const category = ref('')
  const status = ref('')
  const sort = ref('_id')
  const order = ref('asc')

  const news = ref({
    data: [],
    pagination: {
      total: null
    }
  })

  const isGetNews = ref(false)

  const getNews = ref( async (status, category, sort, order) => {
    status = status? `&status=${status}` : ''
    category = category? `&category=${category}` : ''
    sort = sort? `&sortBy=${sort}` : ''
    order = order? `&sortOrder=${order}` : ''

    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/news?${status}${category}${sort}${order}`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        news.value = {...response.data}
        isGetNews.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const sucessInfo = {
    'add': {
      title: '上架成功',
      message: '貼文已經上架成功，按確定返回貼文管理列表。'
    },
    'save': {
      title: '儲存成功',
      message: '貼文草稿已經儲存成功，按確定返回貼文管理列表。'
    },
    'edit': {
      title: '編輯成功',
      message: '貼文已經編輯成功，按確定返回貼文管理列表。'
    },
    'archive': {
      title: '貼文已封存',
      message: '貼文已經封存完成，無法再進行任何編輯，按確定返回貼文管理列表。'
    }
  }

  const selectFile = ref(null)

  const selectImageFiles = ref([])
  const updateImageFile = ref([])

  const editNews = ref( async (newsInfo, editType) => {
    isLoading.value = true

    let type = null
    type = editType == 'create' ? 'add'
    : editType == 'save' ? 'edit'
    : editType == 'add' ? (newsInfo.status = 'active', 'edit') 
    : editType == 'edit' ? 'edit'
    : editType == 'archive' ? (newsInfo.status = 'archived', 'edit')
    : null

    const formData = new FormData()

    if (type == 'edit') {
      formData.append("_id", newsInfo._id)
    }

    formData.append("source", newsInfo.source)
    formData.append("status", newsInfo.status)
    formData.append("category", newsInfo.category)

    formData.append("topic", JSON.stringify(newsInfo.topic))
    formData.append("description", JSON.stringify(newsInfo.description))
    formData.append("detail", JSON.stringify(newsInfo.detail))

    formData.append("content", JSON.stringify(newsInfo.content))

    if (newsInfo.imagePublicId) {
      formData.append("imagePublicId", newsInfo.imagePublicId)
    }
    if (selectFile.value) {
      formData.append("mainImage", selectFile.value)
    }

    selectImageFiles.value.forEach( file => {
      if (file.file) {
        formData.append("newsImages", file.file)
      }
    })
    
    let updateArray = []
    updateImageFile.value.forEach( file => {
      if (file.name) {
        updateArray.push(file)
      }
    })
    if (updateArray.length > 0) {
      formData.append("updateNewsImages", JSON.stringify(updateArray))
    }
    
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/news/${type}`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response) {
        getNews.value(status.value, category.value, sort.value, order.value)
        openDialog.value('success', sucessInfo[editType].title, sucessInfo[editType].message, 'newsList')
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const deleteNews = ref( async id => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/news/${id}`
    const token = getToken.value()
    try {
      let response = await axios.delete(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        console.log('done')
        getNews.value()
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddNews = ref( () => {
    router.push({ name: 'newsAdd'})
  })

  return { 
    statusList, category, status, sort, order, 
    news,
    selectFile, selectImageFiles, updateImageFile,
    getNews, isGetNews, editNews, deleteNews, goToAddNews
  }
})
