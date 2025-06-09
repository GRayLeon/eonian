<script setup>
  import { useProjectStore } from '@/stores/project'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, watch, onMounted } from 'vue';

  const projectStore = useProjectStore()
	const { 
    projects, getProjects,
    selectImageFiles, updateImageFile,
    editProject
  } = storeToRefs(projectStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const projectInfo = ref({
    title: '',
    category: '',
    artist: '',
    description: {
      en: '',
      zh: ''
    },
    detail: {
      en: '',
      zh: ''
    },
    imageList: [{
      class: '',
      images: [{
        imageURL: '',
        imagePublicId: ''
      }]
    }],
    status: 'draft',
    tags: []
  })

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isDraft = ref(false)
  const isArchived = ref(false)

  const typeWording = computed( () => {
    return isEdit.value? '編輯' : '新增'
  })

  const isReady = computed( () => {
    let ready = true
    // if( !projectInfo.value.imageURL && !previewimageURL.value ) { ready = false}
    // if( !projectInfo.value.title ) { ready = false}
    // if( !projectInfo.value.category ) { ready = false}
    // if( !projectInfo.value.artist ) { ready = false}
    // if( !projectInfo.value.description.en ) { ready = false}
    // if( !projectInfo.value.description.zh ) { ready = false}
    // if( !projectInfo.value.detail.en ) { ready = false}
    // if( !projectInfo.value.detail.zh ) { ready = false}
    // if( !projectInfo.value.tags ) { ready = false}
    
    // if( projectInfo.value.title == '' ) { ready = false}
    // if( projectInfo.value.category == '' ) { ready = false}
    // if( projectInfo.value.artist == '' ) { ready = false}
    // if( projectInfo.value.description.en == '' ) { ready = false}
    // if( projectInfo.value.description.zh == '' ) { ready = false}
    // if( projectInfo.value.detail.en == '' ) { ready = false}
    // if( projectInfo.value.detail.zh == '' ) { ready = false}
    // if( projectInfo.value.tags == [] ) { ready = false}

    return ready
  })

  // projectImages
  const previewimageURL = ref([])
  const previewImageName = ref([])
  const isImageChanging = ref([])

  const changeImage = (listIdx, idx) => {
    const target = isImageChanging.value.find( item =>
      item.index[0] === listIdx && item.index[1] === idx
    )
    if (target) {
      target.isChange = true
    }
  }

  const findTarget = (data, listIdx, idx) => {
    return data.find( item =>
      item.index[0] === listIdx && item.index[1] === idx
    )
  }
  const onImageFileChange = (event, listIdx, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + listIdx + idx}_projectImage`, { type: file.type })

      let fileTarget = findTarget(selectImageFiles.value, listIdx, idx)
      if (fileTarget) {
        fileTarget.file = newFile
      } else {
        fileTarget = {
          index: [listIdx, idx],
          file: newFile
        }
        selectImageFiles.value.push(fileTarget)
      }

      const urlTarget = findTarget(previewimageURL.value, listIdx, idx) || {
        index: [listIdx, idx],
        url: ''
      }
      if (urlTarget) {
        urlTarget.url = URL.createObjectURL(file)
      }

      const nameTarget = findTarget(previewImageName.value, listIdx, idx) || {
        index: [listIdx, idx],
        name: ''
      }
      if (nameTarget) {
        nameTarget.name = file.name
      }

      let updateTarget = findTarget(updateImageFile.value, listIdx, idx)
      if (updateTarget) {
        updateTarget.name = newFile.name.split(".")[0]
      } else {
        updateTarget = {
          index: [listIdx, idx],
          name: newFile.name.split(".")[0]
        }
        updateImageFile.value.push(updateTarget)
      }

    } else {
      const fileTarget = findTarget(selectImageFiles.value, listIdx, idx)
      if (fileTarget) {
        fileTarget.file = null
      }

      const urlTarget = findTarget(previewimageURL.value, listIdx, idx)
      if (urlTarget) {
        urlTarget.url = null
      }

      const nameTarget = findTarget(previewImageName.value, listIdx, idx)
      if (nameTarget) {
        nameTarget.name = '請選擇圖片檔案'
      }

      const updateTarget = findTarget(updateImageFile.value, listIdx, idx)
      if (updateTarget) {
        updateImageFile.value.splice(updateImageFile.value.indexOf(updateTarget), 1)
      }
    }
  }
  
  const addImage = () => {
    projectInfo.value.imageList.push({
      class: 'single',
      images: [{
        imageURL: '',
        imagePublicId: ''
      }]
    })
    selectImageFiles.value.push({
      index: [projectInfo.value.imageList.length - 1, 0],
      file: null
    })
    updateImageFile.value.push({
      index: [projectInfo.value.imageList.length - 1, 0],
      name: ''
    })
    isImageChanging.value.push({
      index: [projectInfo.value.imageList.length - 1, 0],
      isChange: true
    })
    previewimageURL.value.push({
      index: [projectInfo.value.imageList.length - 1, 0],
      url: ''
    })
    previewImageName.value.push({
      index: [projectInfo.value.imageList.length - 1, 0],
      name: '請選擇圖片檔案'
    })
  }

  const removeParent = (data, idx) => {
    data.forEach( (file, fidx) => {
      if (file.index[0] === idx) {
        data.splice(fidx, 1)
      }
    })
  }
  const removeImage = idx => {
    projectInfo.value.imageList.splice(idx, 1)
    removeParent(updateImageFile.value, idx)
    removeParent(selectImageFiles.value, idx)
    removeParent(previewimageURL.value, idx)
    removeParent(previewImageName.value, idx)
    removeParent(isImageChanging.value, idx)
  }

  // tags
  const tempTag = ref(null)

  const addTag = () => {
    projectInfo.value.tags.push(tempTag.value)
    tempTag.value = null
  }
  
  const removeTag = idx => {
    projectInfo.value.tags.splice(idx, 1)
  }

  const backcardList = () => {
    router.push({ name: 'projectList'})
  }

  const initProjectInfo = () => {
    selectImageFiles.value = []
    updateImageFile.value = []
    if (isEdit.value) {
      projects.value.data.forEach( project => {
        if (project._id == route.params.id) {
          projectInfo.value = { ...project }
        }
      })
      projectInfo.value.imageList.forEach( (list, listIdx) => {
        list.images.forEach( (image, idx) => {
          selectImageFiles.value.push({
            index: [listIdx, idx],
            file: null
          })
          updateImageFile.value.push({
            index: [listIdx, idx],
            name: ''
          })
          previewimageURL.value.push({
            index: [listIdx, idx],
            url: ''
          })
          previewImageName.value.push({
            index: [listIdx, idx],
            name: '請選擇圖片檔案'
          })
          isImageChanging.value.push({
            index: [listIdx, idx],
            isChange: false
          })
        })
      })
    } else {
      selectImageFiles.value.push({
        index: [0, 0],
        file: null
      })
      updateImageFile.value.push({
        index: [0, 0],
        name: ''
      })
      previewimageURL.value.push({
        index: [0, 0],
        url: ''
      })
      previewImageName.value.push({
        index: [0, 0],
        name: '請選擇圖片檔案'
      })
      isImageChanging.value.push({
        index: [0, 0],
        isChange: false
      })
    }
    if (projectInfo.value.imageList.length == 0) {
      selectImageFiles.value.push({
        index: [0, 0],
        file: null
      })
      updateImageFile.value.push({
        index: [0, 0],
        name: ''
      })
      previewimageURL.value.push({
        index: [0, 0],
        url: null
      })
      previewImageName.value.push({
        index: [0, 0],
        name: '請選擇圖片檔案'
      })
      isImageChanging.value.push({
        index: [0, 0],
        isChange: false
      })
    }
  }

  const onClassChange = listIdx => {
    const type = projectInfo.value.imageList[listIdx].class
    if (type == 'single' && projectInfo.value.imageList[listIdx].images.length == 2) {
      projectInfo.value.imageList[listIdx].images.splice(1, 1)

      const selectTarget = findTarget(selectImageFiles.value, listIdx, 1)
      selectImageFiles.value.splice(selectImageFiles.value.indexOf(selectTarget), 1)

      const updateTarget = findTarget(updateImageFile.value, listIdx, 1)
      updateImageFile.value.splice(updateImageFile.value.indexOf(updateTarget), 1)

      const changeTarget = findTarget(isImageChanging.value, istIdx, 1)
      isImageChanging.value.splice(isImageChanging.value.indexOf(changeTarget), 1)

      const urlTarget = findTarget(previewimageURL.value, listIdx, 1)
      previewimageURL.value.splice(previewimageURL.value.indexOf(urlTarget), 1)

      const nameTarget = findTarget(previewImageName.value, listIdx, 1)
      previewImageName.value.splice(previewImageName.value.indexOf(nameTarget), 1)

    } else if (type == 'double' && projectInfo.value.imageList[listIdx].images.length == 1) {
      projectInfo.value.imageList[listIdx].images.push({
        imageURL: '',
        imagePublicId: ''
      })
      selectImageFiles.value.push({
        index: [listIdx, 1],
        file: null
      })
      updateImageFile.value.push({
        index: [listIdx, 1],
        name: ''
      })
      isImageChanging.value.push({
        index: [listIdx, 1],
        isChange: true
      })
      previewimageURL.value.push({
        index: [listIdx, 1],
        url: ''
      })
      previewImageName.value.push({
        index: [listIdx, 1],
        name: '請選擇圖片檔案'
      })
    }
  }

  onMounted( async () => {
    isLoading.value = true
    await getProjects.value()
    initProjectInfo()
    if (projectInfo.value.status == 'draft') {
      isDraft.value = true
    } else if (projectInfo.value.status == 'archived') {
      isArchived.value = true
    }
    updateImageFile.value = []
    selectImageFiles.value = []
  })

</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backcardList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ typeWording }}專案</h1>
    </div>
  </div>
  <div class="editArea">
    <div class="inputItem inputItem--column">
      <ul class="projectImages">
        <li v-for="(imageList, listIdx) in projectInfo.imageList">
          <div class="selectItem">
            <div class="head">排列形式</div>
            <select
              v-model="imageList.class"
              @change="onClassChange(listIdx)"
              :disabled="isArchived">
              <option value="" selected disabled>請選擇排列形式</option>
              <option value="single">單張滿版</option>
              <option value="double">兩張並列</option>
            </select>
          </div>
          <div class="imageList">
            <div class="imageList__image" v-for="(image, idx) in imageList.images">
              <img
                :src="image.imageURL"
                v-if="image.imageURL && !findTarget(isImageChanging, listIdx, idx).isChange">
              <img
                :src="findTarget(previewimageURL, listIdx, idx) && findTarget(previewimageURL, listIdx, idx).url"
                v-else-if="findTarget(previewimageURL, listIdx, idx) && findTarget(previewimageURL, listIdx, idx).url && findTarget(isImageChanging, listIdx, idx).isChange">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="findTarget(isImageChanging, listIdx, idx) && !findTarget(isImageChanging, listIdx, idx).isChange && !isArchived"
                @click="changeImage(listIdx, idx)">
                更改圖片
              </button>
              <div v-else-if="!isArchived" class="imageSelect">
                <input
                  type="file"
                  accept=".jpg, .png"
                  name="selectImage"
                  :id="`selectImage-${listIdx}-${idx}`"
                  @change="onImageFileChange($event, listIdx, idx)">
                <span v-if="findTarget(previewImageName, listIdx, idx)">{{ findTarget(previewImageName, listIdx, idx).name }}</span>
                <label :for="`selectImage-${listIdx}-${idx}`">選擇檔案</label>
              </div>
            </div>
            <div class="deleteImage" @click="removeImage(listIdx)"><span class="material-icons">close</span></div>
          </div>
        </li>
      </ul>
      <button @click="addImage()">新增圖片欄</button>
    </div>
    <div class="inputItem" v-if="isEdit">
      <div class="head">商品狀態</div>
      <select
        v-if="!isDraft"
        v-model="projectInfo.status"
        :disabled="isArchived">
        <option value="" disabled>請選擇專案狀態</option>
        <option value="active">上架</option>
        <option value="inactive">下架</option>
      </select>
      <select v-else disabled>
        <option>草稿</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">名稱</div>
      <input
        v-model="projectInfo.title"
        :disabled="isArchived"
        placeholder="請如入專案名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">分類</div>
      <select
        v-model="projectInfo.category"
        :disabled="isArchived">
        <option disabled selected>請選擇專案分類</option>
        <option value="Commercial Space">Commercial Space</option>
        <option value="Residence">Residence</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">作者</div>
      <input
        v-model="projectInfo.artist"
        :disabled="isArchived"
        placeholder="請輸入作者"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <textarea
        v-model="projectInfo.description.en"
        :disabled="isArchived"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <textarea
        v-model="projectInfo.description.zh"
        :disabled="isArchived"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">詳細內容(英)</div>
      <textarea
        v-model="projectInfo.detail.en"
        :disabled="isArchived"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">詳細內容(中)</div>
      <textarea
        v-model="projectInfo.detail.zh"
        :disabled="isArchived"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
    <!-- <div class="inputItem">
      <div class="head">標籤</div>
      <div class="tagListArea">
        <div class="tagList" v-if="projectInfo.tags.length > 0">
          <div class="tagItem" v-for="(tag, idx) in projectInfo.tags">
            <span>{{ tag }}</span>
            <div
              class="tagButton"
              @click="removeTag(idx)">
              <span class="material-icons">close</span>
            </div>
          </div>
        </div>
        <div class="addButtonArea">
          <div class="addInput">
            <input
              v-if="!isArchived"
              type="text"
              placeholder="請輸入標籤內容"
              v-model="tempTag">
            <button
              class="smallButton"
              :disabled="isArchived"
              @click="addTag()">
              新增
            </button>
          </div>
        </div>
      </div>
    </div> -->
    <div class="buttonArea" v-if="isEdit && !isArchived && !isDraft">
      <button 
        :disabled="!isReady"
        @click="editProject(projectInfo, 'edit')">儲存編輯</button>
      <button 
        :disabled="!isReady"
        v-if="!isDraft"
        @click="editProject(projectInfo, 'archive')">封存商品</button>
    </div>
    <div class="buttonArea" v-else-if="(!isEdit || isDraft) && !isArchived">
      <button  
        :disabled="!isReady"
        v-if="!isEdit"
        @click="editProject(projectInfo, 'create')">創建草稿</button>
      <button  
        :disabled="!isReady"
        v-else
        @click="editProject(projectInfo, 'save')">儲存草稿</button>
      <button  
        :disabled="!isReady"
        v-if="!isEdit"
        @click="editProject(projectInfo, 'add')">上架產品</button>
      <button  
        :disabled="!isReady"
        v-else
        @click="editProject(projectInfo, 'active')">上架產品</button>
    </div>
  </div>
</template>

<style scoped>
</style>
