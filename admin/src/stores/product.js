import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useProductStore = defineStore('product', () => {
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

  const products = ref({
    data: [],
    pagination: {
      total: null
    }
  })

  const tempFunctionality = ref([])
  const tempOrigin = ref([])
  const tempAppearance = ref([])
  const tempSupport = ref([])

  // const selectSizes = ref([])
  const selectFile = ref(null)

  const isGetProducts = ref(false)

  const getProducts = ref( async (status, category, sort, order) => {
    status = status? `&status=${status}` : ''
    category = category? `&category=${category}` : ''
    sort = sort? `&sortBy=${sort}` : ''
    order = order? `&sortOrder=${order}` : ''

    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/product?${status}${category}${sort}${order}`
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

  const sucessInfo = {
    'creat': {
      title: '新增草稿',
      message: '已成功新增草稿，按確定返回產品管理列表。'
    },
    'add': {
      title: '上架成功',
      message: '產品已經上架成功，按確定返回產品管理列表。'
    },
    'save': {
      title: '儲存成功',
      message: '產品草稿已經儲存成功，按確定返回產品管理列表。'
    },
    'edit': {
      title: '編輯成功',
      message: '產品已經編輯成功，按確定返回產品管理列表。'
    },
    'active': {
      title: '上架成功',
      message: '產品已經上架成功，按確定返回產品管理列表。'
    },
    'archive': {
      title: '產品已封存',
      message: '產品已經封存完成，無法再進行任何編輯，按確定返回產品管理列表。'
    }
  }

  const selectSubImageFiles = ref([])
  const updateSubImageFile = ref([])

  const selectShapeImageFiles = ref([])
  const updateShapeImageFile = ref([])

  const selectColorImageFiles = ref([])
  const updateColorImageFile = ref([])

  const editProduct = ref( async (productInfo, editType) => {
    isLoading.value = true
    
    let type = null
    type = editType == 'create' ? 'add'
    : editType == 'save' ? 'edit'
    : editType == 'add' ? (productInfo.status = 'active', 'add') 
    : editType == 'edit' ? 'edit'
    : editType == 'active' ? (productInfo.status = 'active', 'edit')
    : editType == 'archive' ? (productInfo.status = 'archived', 'edit')
    : null

    const formData = new FormData()

    if (type == 'edit') {
      formData.append("_id", productInfo._id)
    }

    formData.append("model", productInfo.model)
    formData.append("dimension", productInfo.dimension)
    formData.append("slipResistance", productInfo.slipResistance)
    formData.append("application", productInfo.application)
    formData.append("parentCategory", productInfo.parentCategory)
    formData.append("status", productInfo.status)
    formData.append("basePrice", productInfo.basePrice)

    formData.append("description", JSON.stringify(productInfo.description))
    formData.append("name", JSON.stringify(productInfo.name))
    // formData.append("sizes", JSON.stringify(selectSizes.value))
    formData.append("subImages", JSON.stringify(productInfo.subImages))
    formData.append("shapes", JSON.stringify(productInfo.shapes))
    formData.append("colors", JSON.stringify(productInfo.colors))
    formData.append("tags", JSON.stringify(productInfo.tags))
    formData.append("unitArea", JSON.stringify(productInfo.unitArea))

    formData.append("origin", JSON.stringify(tempOrigin.value))
    formData.append("appearance", JSON.stringify(tempAppearance.value))
    formData.append("functionality", JSON.stringify(tempFunctionality.value))
    formData.append("support", JSON.stringify(tempSupport.value))
    formData.append("brand", JSON.stringify(productInfo.brand))
    
    if (productInfo.imagePublicId) {
      formData.append("imagePublicId", productInfo.imagePublicId)
    }
    if (selectFile.value) {
      formData.append("mainImage", selectFile.value)
    }
    if (selectSubImageFiles.value) {
      selectSubImageFiles.value.forEach( file => {
        formData.append("subImages", file)
      })
      formData.append("updateSubImages", JSON.stringify(updateSubImageFile.value))
    }
    if (selectShapeImageFiles.value) {
      selectShapeImageFiles.value.forEach( file => {
        formData.append("shapeImages", file)
      })
      formData.append("updateShapeImages", JSON.stringify(updateShapeImageFile.value))
    }
    if (selectColorImageFiles.value) {
      selectColorImageFiles.value.forEach( file => {
        formData.append("colorImages", file)
      })
      formData.append("updateColorImages", JSON.stringify(updateColorImageFile.value))
    }
    
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/product/${type}`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response) {
        getProducts.value(status.value, category.value, sort.value, order.value)
        openDialog.value('success', sucessInfo[editType].title, sucessInfo[editType].message, 'productList')
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const deleteProduct = ref( async id => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/product/${id}`
    const token = getToken.value()
    try {
      let response = await axios.delete(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        console.log('done')
        getProducts.value()
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddProduct = ref( () => {
    router.push({ name: 'productAdd'})
  })

  return { 
    // selectSizes,
    statusList, category, status, sort, order, 
    products, selectFile,
    selectSubImageFiles, updateSubImageFile,
    selectShapeImageFiles, updateShapeImageFile,
    selectColorImageFiles, updateColorImageFile,
    tempFunctionality, tempOrigin, tempAppearance, tempSupport,
    getProducts, isGetProducts, editProduct, deleteProduct, goToAddProduct
  }
})
