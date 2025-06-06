import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useBrandStore = defineStore('brand', () => {
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

  const brands = ref({
    data: [],
    pagination: {
      total: null
    }
  })

  const isGetBrands = ref(false)

  const getBrands = ref( async (status, category, sort, order) => {
    status = status? `&status=${status}` : ''
    category = category? `&category=${category}` : ''
    sort = sort? `&sortBy=${sort}` : ''
    order = order? `&sortOrder=${order}` : ''

    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/brand?${status}${category}${sort}${order}`
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

  const sucessInfo = {
    'add': {
      title: '上架成功',
      message: '品牌已經上架成功，按確定返回品牌管理列表。'
    },
    'save': {
      title: '儲存成功',
      message: '品牌草稿已經儲存成功，按確定返回品牌管理列表。'
    },
    'edit': {
      title: '編輯成功',
      message: '品牌已經編輯成功，按確定返回品牌管理列表。'
    },
    'archive': {
      title: '品牌已封存',
      message: '品牌已經封存完成，無法再進行任何編輯，按確定返回品牌管理列表。'
    }
  }

  const selectFile = ref(null)

  const selectImageFiles = ref([])
  const updateImageFile = ref([])

  const editBrand = ref( async (brandInfo, editType) => {
    isLoading.value = true

    let type = null
    type = editType == 'create' ? 'add'
    : editType == 'save' ? 'edit'
    : editType == 'add' ? (brandInfo.status = 'active', 'edit') 
    : editType == 'edit' ? 'edit'
    : editType == 'archive' ? (brandInfo.status = 'archived', 'edit')
    : null

    const formData = new FormData()

    if (type == 'edit') {
      formData.append("_id", brandInfo._id)
    }
    
    formData.append("name", brandInfo.name)
    formData.append("status", brandInfo.status)

    formData.append("description", JSON.stringify(brandInfo.description))

    formData.append("content", JSON.stringify(brandInfo.content))

    if (brandInfo.imagePublicId) {
      formData.append("imagePublicId", brandInfo.imagePublicId)
    }
    if (selectFile.value) {
      formData.append("mainImage", selectFile.value)
    }

    selectImageFiles.value.forEach( file => {
      if (file.file) {
        formData.append("brandImages", file.file)
      }
    })
    
    let updateArray = []
    updateImageFile.value.forEach( file => {
      if (file.name) {
        updateArray.push(file)
      }
    })
    if (updateArray.length > 0) {
      formData.append("updateBrandImages", JSON.stringify(updateArray))
    }
    
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/brand/${type}`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response) {
        getBrands.value(status.value, category.value, sort.value, order.value)
        openDialog.value('success', sucessInfo[editType].title, sucessInfo[editType].message, 'brandList')
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const deleteBrand = ref( async id => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/brand/${id}`
    const token = getToken.value()
    try {
      let response = await axios.delete(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        console.log('done')
        getBrands.value()
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddBrand = ref( () => {
    router.push({ name: 'brandAdd'})
  })

  return { 
    statusList, category, status, sort, order, 
    brands,
    selectFile, selectImageFiles, updateImageFile,
    getBrands, isGetBrands, editBrand, deleteBrand, goToAddBrand
  }
})
