import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

export const useSpecStore = defineStore('spec', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { openDialog, errorHandle } = storeToRefs(dialogStore)

  const specDatas = ref({
    origin: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    appearance: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    functionality: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    support: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    brands: {
      name: '',
      list: [{
        name: {
          en: '',
          zh: ''
        }
      }]
    }
  })
  
  const isGetSpecs = ref(false)

  const getSpecDatas = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/spec`
    try {
      let response = await axios.get(apiURL)
      specDatas.value = {...response.data}
      isGetSpecs.value = true
      isLoading.value = false
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const editSpec = ref( async (spec, selectBrandFiles, updateBrandFile) => {
    isLoading.value = true
    const formData = new FormData()
    formData.append("origin", JSON.stringify(spec.origin))
    formData.append("appearance", JSON.stringify(spec.appearance))
    formData.append("functionality", JSON.stringify(spec.functionality))
    formData.append("support", JSON.stringify(spec.support))
    formData.append("brands", JSON.stringify(spec.brands))
    if (selectBrandFiles) {
        selectBrandFiles.forEach( file => {
        formData.append("brandImages", file)
      })
      formData.append("updateBrands", JSON.stringify(updateBrandFile))
    }
    
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/spec`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      isLoading.value = false
      openDialog.value('success', `編輯成功`, `規格已經編輯成功，按確定返回產品規格管理列表。`, 'reload')
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const selectBrandFiles = ref([])
  const updateBrandFile = ref([])

  return { specDatas, isGetSpecs, getSpecDatas, editSpec, selectBrandFiles, updateBrandFile }
})
