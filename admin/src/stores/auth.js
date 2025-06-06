import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useAuthStore = defineStore('auth', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const isLogin = ref(false)

  const setToken = (token, expiresIn) => {
    document.cookie = `accessToken=${token}; max-age=${expiresIn}; path=/`
  }

  const clearToken = () => {
    document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"
  }

  const getToken = ref(() => {
    const cookies = document.cookie.split("; ")
    const cookieMap = new Map()

    cookies.forEach(cookie => {
        const [name, value] = cookie.split("=")
        cookieMap.set(name, value)
    })

    return cookieMap.get('accessToken')
  })

  const login = ref( async loginAccount => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/auth/login`
    try {
      let response = await axios.post(apiURL, loginAccount)
      if (response) {
        setToken(response.data.token, response.data.expiresIn)
        checkLogin.value()
        isLoading.value = false
        router.push({ name: 'home'})
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const logout = ref( () => {
    clearToken()
    checkLogin.value()
  })

  const checkLogin = ref( () => {
    const accessToken = getToken.value()
    if (accessToken) {
      isLogin.value = true
    } else {
      isLogin.value = false
    }
  })

  const profile = ref({})
  const getProfile = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/auth/profile`
    const token = getToken.value()
    try {
      let response = await axios.get(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        profile.value = { ...response.data }
        isLoading.value = false
      }
    } catch(e) {
      console.log(e)
    }
  })

  return { isLogin, login, logout, getToken, checkLogin, getProfile, profile }
})
