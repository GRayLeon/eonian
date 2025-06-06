import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const useBrandStore = defineStore('brand', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const brands = ref({
    data: [],
    pagination: {
      currentPage: null,
      pageSize: null,
      total: null,
      totalPages: null
    }
  })

  const isGetBrands = ref(false)

  const getBrands = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/brand`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        brands.value = {...response.data}
        isGetBrands.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  return { brands, getBrands }
})
