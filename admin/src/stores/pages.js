import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const usePagesStore = defineStore('pages', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { openDialog, errorHandle } = storeToRefs(dialogStore)

  const pages = ref({
    index: {
      description: {
        en: '',
        zh: ''
      },
      images: [
        {
          imageUrl: '',
          imagePublicId: ''
        }
      ]
    },
    vision: {
      description: {
        en: '',
        zh: ''
      },
      imageUrl: '',
      imagePublicId: ''
    },
    partners: [{
      name: '',
      imageUrl: '',
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
    }
  })

  // const selectIndexFile = ref(null)

  const selectIndexImageFiles = ref([])
  const updateIndexImageFile = ref([])
  const selectVisionFile = ref(null)

  const isGetPages = ref(false)

  const getPages = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/pages`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        pages.value = {...response.data}
        isGetPages.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const sucessInfo = {
    'edit': {
      title: '編輯成功',
      message: '頁面內容已經編輯成功'
    }
  }

  const selectPartnerImageFiles = ref([])
  const updatePartnerImageFile = ref([])

  const editPages = ref( async pages => {
    isLoading.value = true

    const formData = new FormData()

    formData.append("index", JSON.stringify(pages.index))
    formData.append("vision", JSON.stringify(pages.vision))
    formData.append("partners", JSON.stringify(pages.partners))
    formData.append("contact", JSON.stringify(pages.contact))

    // if (selectIndexFile.value) {
    //   formData.append("indexImage", selectIndexFile.value)
    // }
    if (selectIndexImageFiles.value) {
      selectIndexImageFiles.value.forEach( file => {
        formData.append("indexImages", file)
      })
      formData.append("updateIndexImages", JSON.stringify(updateIndexImageFile.value))
    }
    if (selectVisionFile.value) {
      formData.append("visionImage", selectVisionFile.value)
    }
    if (selectPartnerImageFiles.value) {
      selectPartnerImageFiles.value.forEach( file => {
        formData.append("partnerImages", file)
      })
      formData.append("updatePartnerImages", JSON.stringify(updatePartnerImageFile.value))
    }
    
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/pages/edit`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response) {
        openDialog.value('success', sucessInfo['edit'].title, sucessInfo['edit'].message, 'reload')
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })


  return { 
    pages,
    selectIndexImageFiles, updateIndexImageFile, selectVisionFile,
    selectPartnerImageFiles, updatePartnerImageFile,
    getPages, isGetPages, editPages
  }
})
