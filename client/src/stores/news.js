import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const useNewsStore = defineStore('news', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const page = ref(1)
  const pageSize = ref(10)
  const news = ref({
    data: [],
    pagination: {
      currentPage: null,
      pageSize: null,
      total: null,
      totalPages: null
    },
    categoryAmount: {
      'Press_Coverage': 0,
      'Joural_Articles': 0
    }
  })

  const isGetNews = ref(false)

  const getNews = ref( async (page, category) => {
    isLoading.value = true
    page = page? `?page=${page}&pageSize=${pageSize.value}` : ''
    category = category? `&category=${category}` : ''
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/news${page}${category}`
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

  return { page, news, getNews }
})
