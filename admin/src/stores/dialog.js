import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialog', () => {

  const dialogIsOpen = ref(false)
  const dialogStatus = ref(null)
  const dialogTitle = ref(null)
  const dialogInfo = ref(null)
  const dialogTarget = ref(null)
  const dialogData = ref(null)

  const openDialog = ref( (status, title, info, target, data) => {
    dialogStatus.value = status
    dialogTitle.value = title
    dialogInfo.value = info
    dialogTarget.value = target
    dialogData.value = data
    dialogIsOpen.value = true
  })

  const errorInfo = {
    400: {
      title: '請求錯誤',
      message: '請求資料有誤，請洽開發人員協助。',
    },
    401: {
      title: '驗證錯誤',
      message: '請確定登入的資訊是否有誤，請按確定重新整理。',
    },
    403: {
      title: '驗證失敗',
      message: '登入時效已過期或權限已遭修改，請按確定重新整理。',
    },
    404: {
      title: '找不到資料',
      message: '找不到請求的資料，請洽開發人員協助。',
    },
    500: {
      title: '未預期錯誤',
      message: '發生未預期錯誤，請洽開發人員協助。',
    }
  }

  const errorHandle = ref( e => {
    openDialog.value('failed', errorInfo[e.status].title, errorInfo[e.status].message + e.message, 'reload')
  })

  return { dialogIsOpen, dialogStatus, dialogTitle, dialogInfo, dialogTarget, dialogData, openDialog, errorHandle }
})
