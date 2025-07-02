import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useAccountStore = defineStore('account', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { getToken } = storeToRefs(authStore)

  const dialogStore = useDialogStore()
	const { openDialog, errorHandle } = storeToRefs(dialogStore)

  const accounts = ref([])

  const isGetAccounts = ref(false)

  const getAccounts = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/auth`
    const token = getToken.value()
    try {
      let response = await axios.get(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        accounts.value = [...response.data]
        isGetAccounts.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const addAccount = ref( async account => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/auth/register`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, account, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      openDialog.value('success', '新增成功', '帳號已經新增成功，按確定返回帳號管理列表。', 'accountList')
      getAccounts.value()
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const editAccount = ref( async (account, target) => {
    isLoading.value = true
    
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/auth/edit`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, account, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (response) {
        openDialog.value('success', `編輯成功`, `帳號已經編輯成功，按確定返回產品帳號管理列表。`, target)
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const deleteAccount = ref( async account_id => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/auth/${account_id}`
    const token = getToken.value()
    try {
      let response = await axios.delete(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      openDialog.value('success', '刪除成功', '帳號已經刪除成功，按確定返回帳號管理列表。', 'accountList')
      getAccounts.value()
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddAccount = ref( () => {
    router.push({ name: 'accountAdd'})
  })

  return { accounts, isGetAccounts, getAccounts, deleteAccount, addAccount, editAccount, goToAddAccount }
})
