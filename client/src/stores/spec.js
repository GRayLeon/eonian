import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const useSpecStore = defineStore('spec', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const specDatas = ref({
    origin: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    appearance: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    functionality: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    support: {
      name: {
        en: '',
        zh: ''
      },
      list: [{
        en: '',
        zh: ''
      }]
    },
    brands: {
      name: '',
      list: [{
        name: {
          en: '',
          zh: ''
        }
      }]
    }
  })

  const isGetSpecs = ref(false)

  const getSpecDatas = ref( async () => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/spec`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        specDatas.value = {...response.data}
        isGetSpecs.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  return { specDatas, getSpecDatas }
})
