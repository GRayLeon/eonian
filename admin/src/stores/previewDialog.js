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

  return { previewDialogIsOpen, previewType, previewData, openPreviewDialog, closePreviewDialog }
})
