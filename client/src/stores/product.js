import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const useProductStore = defineStore('product', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const page = ref(1)
  const pageSize = ref(15)
  const products = ref({
    data: [],
    pagination: {
      currentPage: null,
      pageSize: null,
      total: null,
      totalPages: null
    }
  })

  const isGetProducts = ref(false)

  const getProducts = ref( async (page, filter, activeName) => {
    page = page? `&page=${page}` : ''
    filter = (filter && activeName)? `&${filter}En=${activeName}` : ''

    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/product?status=active${page}&size=${pageSize.value}${filter}`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        products.value = {...response.data}
        isGetProducts.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })
  return { page, pageSize, products, isGetProducts, getProducts }
})
