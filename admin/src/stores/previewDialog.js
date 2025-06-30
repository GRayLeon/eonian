import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePreviewDialogStore = defineStore('previewDialog', () => {

  const previewDialogIsOpen = ref(false)
  const previewType = ref(null)
  const previewData = ref(null)

  const openPreviewDialog = ref( (type, data) => {
    previewDialogIsOpen.value = true
    previewType.value = type
    previewData.value = { ...data }
  })

  const closePreviewDialog = ref( () => {
    previewDialogIsOpen.value = false
    previewType.value = null
    previewData.value = null
  })

  const lan = ref('en')

  const switchLan = ref(() => {
    if (lan.value == 'en') {
      lan.value = 'zh'
    } else if (lan.value == 'zh') {
      lan.value = 'en'
    }
  })

  const showLan = ref(obj => {
    if (!obj) return '--'
    return obj[lan.value]
  })

  const showCurrentLan = ref( lan => {
    if (lan == 'en') {
      return 'En'
    } else if (lan == 'zh') {
      return '中文'
    }
  })


  return { lan, switchLan, showLan, showCurrentLan, previewDialogIsOpen, previewType, previewData, openPreviewDialog, closePreviewDialog }
})
