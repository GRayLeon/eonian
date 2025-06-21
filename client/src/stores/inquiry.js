import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

const unit = ref('m²')
const area = ref(null)
const amount = ref(1)

export const useInquiryStore = defineStore('inquiry', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle, openDialog } = storeToRefs(dialogStore)

  const sendInquiry = ref( async inquiryInfo => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/inquiry/add`
    try {
      let response = await axios.post(apiURL, inquiryInfo)
      if (response) {
        isLoading.value = false
        if (inquiryInfo.category == 'calculate') {
          downloadInquiry.value(response.data)
        } else {
          openDialog.value('success', '成功送出', '諮詢表單已經成功送出，請按確定繼續。', 'contact')
        }
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const downloadInquiry = ref( id => {
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/inquiry/download/${id}`
    window.open(apiURL, '_blank')
    openDialog.value('success', '下載成功', '估價單已下載完成，請按確定繼續。', 'reload')
  })
  return { unit, area, amount, sendInquiry, downloadInquiry }
})
