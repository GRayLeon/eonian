import { useLoadStore } from '@/stores/load'
import { useAuthStore } from '@/stores/auth'
import { useDialogStore } from '@/stores/dialog'
import { defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import axios from 'axios'

import router from '@/router'

export const useProjectStore = defineStore('project', () => {
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

  const projects = ref({
    data: [],
    pagination: {
      total: null
    }
  })

  const isGetProjects = ref(false)

  const getProjects = ref( async (status, category, sort, order) => {
    status = status? `&status=${status}` : ''
    category = category? `&category=${category}` : ''
    sort = sort? `&sortBy=${sort}` : ''
    order = order? `&sortOrder=${order}` : ''

    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/project?${status}${category}${sort}${order}`
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

  const sucessInfo = {
    'creat': {
      title: '新增草稿',
      message: '已成功新增草稿，按確定返回專案管理列表。'
    },
    'add': {
      title: '上架成功',
      message: '專案已經上架成功，按確定返回專案管理列表。'
    },
    'save': {
      title: '儲存成功',
      message: '專案草稿已經儲存成功，按確定返回專案管理列表。'
    },
    'edit': {
      title: '編輯成功',
      message: '專案已經編輯成功，按確定返回專案管理列表。'
    },
    'active': {
      title: '上架成功',
      message: '專案已經上架成功，按確定返回專案管理列表。'
    },
    'archive': {
      title: '專案已封存',
      message: '專案已經封存完成，無法再進行任何編輯，按確定返回專案管理列表。'
    }
  }

  const selectImageFiles = ref([])
  const updateImageFile = ref([])

  const editProject = ref( async (projectInfo, editType) => {
    isLoading.value = true

    let type = null
    type = editType == 'create' ? 'add'
    : editType == 'save' ? 'edit'
    : editType == 'add' ? (projectInfo.status = 'active', 'add') 
    : editType == 'edit' ? 'edit'
    : editType == 'active' ? (projectInfo.status = 'active', 'edit')
    : editType == 'archive' ? (projectInfo.status = 'archived', 'edit')
    : null

    const formData = new FormData()

    if (type == 'edit') {
      formData.append("_id", projectInfo._id)
    }

    formData.append("title", projectInfo.title)
    formData.append("category", projectInfo.category)
    formData.append("status", projectInfo.status)
    formData.append("artist", projectInfo.artist)

    formData.append("description", JSON.stringify(projectInfo.description))
    formData.append("detail", JSON.stringify(projectInfo.detail))
    formData.append("tags", JSON.stringify(projectInfo.tags))

    formData.append("imageList", JSON.stringify(projectInfo.imageList))

    selectImageFiles.value.forEach( file => {
      if (file.file) {
        formData.append("projectImages", file.file)
      }
    })
    
    let updateArray = []
    updateImageFile.value.forEach( file => {
      if (file.name) {
        updateArray.push(file)
      }
    })
    if (updateArray.length > 0) {
      formData.append("updateProjectImages", JSON.stringify(updateArray))
    }
    
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/project/${type}`
    const token = getToken.value()
    try {
      let response = await axios.post(apiURL, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response) {
        getProjects.value(status.value, category.value, sort.value, order.value)
        openDialog.value('success', sucessInfo[editType].title, sucessInfo[editType].message, 'projectList')
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const deleteProject = ref( async id => {
    isLoading.value = true
    const apiURL = `${import.meta.env.VITE_ADMIN_API_URL}/project/${id}`
    const token = getToken.value()
    try {
      let response = await axios.delete(apiURL, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })
      if (response) {
        console.log('done')
        getProjects.value()
      }
    } catch(e) {
      errorHandle.value(e)
      console.log(e)
    }
  })

  const goToAddProject = ref( () => {
    router.push({ name: 'projectAdd'})
  })

  return { 
    statusList, category, status, sort, order, 
    projects,
    selectImageFiles, updateImageFile,
    getProjects, isGetProjects, editProject, deleteProject, goToAddProject
  }
})
