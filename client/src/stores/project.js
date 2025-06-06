import { useLoadStore } from '@/stores/load'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'

export const useProjectStore = defineStore('project', () => {
  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { errorHandle } = storeToRefs(dialogStore)

  const page = ref(1)
  const pageSize = ref(15)
  const projects = ref({
    data: [],
    pagination: {
      currentPage: null,
      pageSize: null,
      total: null,
      totalPages: null
    }
  })

  const isGetProjects = ref(false)

  const getProjects = ref( async (page, filter) => {
    let query = ''
    if (filter) {
      query = `search=${filter}`
    } else {
      query = `page=${page}&size=${pageSize.value}`
    }

    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_APP_API_URL}/project?${query}`
    try {
      let response = await axios.get(apiURL)
      if (response) {
        projects.value = {...response.data}
        isGetProjects.value = true
        isLoading.value = false
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })
  return { page, pageSize, projects, isGetProjects, getProjects }
})
