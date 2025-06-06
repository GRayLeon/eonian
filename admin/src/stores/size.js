import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useSizeStore = defineStore('size', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { openDialog, errorHandle } = storeToRefs(dialogStore)

  const sizeDatas = ref([])

  const getSizeDatas = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/size`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        sizeDatas.value = [...response.data]
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const editSize = ref( async (size, type, target) => {
    isLoading.value = true
    
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/size/${type}`
    const token = getToken.value()
    if (typeof size.active == String) { 
      size.active = size.active == 'true'
    }
    let typeWording = type == 'edit' ? '編輯' : '新增'
    try {
      let response = await axios.post(apiURL, size, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response) {
        openDialog.value('success', `${typeWording}成功`, `規格已經${typeWording}成功，按確定返回產品規格管理列表。`, target)
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddSize = ref( () => {
    router.push({ name: 'sizeAdd'})
  })

  return { sizeDatas, getSizeDatas, editSize, goToAddSize }
})
