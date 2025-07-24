import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useRegionStore = defineStore('region', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { openDialog, errorHandle } = storeToRefs(dialogStore)

  const regions = ref([])

  const getRegions = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/region`
    try {
      let response = await axios.get(apiURL)
      regions.value = [...response.data]
      isLoading.value = false
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const editRegion = ref( async (region, type, selectedFile, target) => {
    isLoading.value = true

    const formData = new FormData()
    formData.append("_id", region._id)
    formData.append("name", JSON.stringify(region.name))
    formData.append("status", region.status)
    if (region.imagePublicId) {
      formData.append("imagePublicId", region.imagePublicId)
    }
    if (selectedFile) {
      formData.append("image", selectedFile)
    }
    
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/region/${type}`
    const token = getToken.value()
    if (typeof region.active == String) { 
      region.active = region.active == 'true'
    }
    let typeWording = type == 'edit' ? '編輯' : '新增'
    try {
      let response = await axios.post(apiURL, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      openDialog.value('success', `${typeWording}成功`, `地區已經${typeWording}成功，按確定返回地區地區管理列表。`, target)
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const deleteRegion = ref( async id => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/region/${id}`
    const token = getToken.value()
    try {
      let response = await axios.delete(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      console.log('done')
      getRegions.value()
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddRegion = ref( () => {
    router.push({ name: 'regionAdd'})
  })

  return { regions, getRegions, editRegion, deleteRegion, goToAddRegion }
})
