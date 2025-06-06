import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useInquiryStore = defineStore('inquiry', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const categoryList = ref([
    { value: 'form', label: '諮詢' },
    { value: 'calculate', label: '估價' }
  ])

  const statusList = ref([
    { value: 'pending', label: '未處理' },
    { value: 'processing', label: '處理中' },
    { value: 'processed', label: '已處理' },
    { value: 'ignore', label: '擱置' }
  ])

  const category = ref('')
  const status = ref('')
  const sort = ref('_id')
  const order = ref('asc')

  const inquirys = ref({
    data: [],
    pagination: {
      total: null
    }
  })

  const getInquiryDatas = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/inquiry`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        inquirys.value = {...response.data}
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const editInquiry = ref( async inquiryInfo => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/inquiry/edit`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, inquiryInfo, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response) {
        getInquiryDatas.value(status.value, category.value, sort.value, order.value)
        openDialog.value('success', '編輯成功', '諮詢表單已經編輯成功，按確定返回諮詢管理列表。', 'inquiryList')
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const downloadInquiry = ref( id => {
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/inquiry/download/${id}`
    window.open(apiURL, '_blank')
  })

  return { 
    categoryList, statusList, category, status, sort, order,
    statusList, inquirys, getInquiryDatas, editInquiry, downloadInquiry
  }
})
