import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const usePagesStore = defineStore('pages', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const pagesInfo = ref({
    index: {
      description: {
        en: '',
        zh: ''
      },
      images: [{
        imageURL: '',
        imagePublicId: ''
      }]
      
    },
    vision: {
      description: {
        en: '',
        zh: ''
      },
      imageURL: '',
      imagePublicId: ''
    },
    partners: [{
      name: '',
      imageURL: '',
      imagePublicId: ''
    }],
    contact: {
      description: {
        en: '',
        zh: ''
      },
      address: {
        en: '',
        zh: ''
      }
    },
  })

  const isGetPages = ref(false)

  const getPages = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/pages`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        pagesInfo.value = {...response.data}
        isGetPages.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  return { pagesInfo, getPages }
})
