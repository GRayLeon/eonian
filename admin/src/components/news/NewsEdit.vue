<script setup>
  import { useNewsStore } from '@/stores/news'
  import { useDialogStore } from '@/stores/dialog'
  import { useLoadStore } from '@/stores/load'
  import { usePreviewDialogStore } from '@/stores/previewDialog'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, watch, onMounted } from 'vue';

  const newsStore = useNewsStore()
	const { 
    news, getNews,
    selectFile, selectImageFiles, updateImageFile,
    editNews
  } = storeToRefs(newsStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { openDialog } = storeToRefs(dialogStore)

  const previewDialogStore = usePreviewDialogStore()
	const { openPreviewDialog } = storeToRefs(previewDialogStore)

  const route = useRoute()
  const router = useRouter()

  const newsInfo = ref({
    topic: {
      en: '',
      zh: ''
    },
    status: 'draft',
    category: '',
    source: '',
    imageURL: '',
    imagePublicId: '',
    description: {
      en: '',
      zh: ''
    },
    detail: {
      en: '',
      zh: ''
    },
    content: [{
      layout: {
        direction: 'single-vertical',
        position: 'image-top'
      },
      article: [{
        title: {
          en: '',
          zh: ''
        },
        text: {
          en: '',
          zh: ''
        },
        imageURL: '',
        imagePublicId: ''
      }]
    }]
  })

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isDraft = ref(false)
  const isArchived = ref(false)

  const typeWording = computed( () => {
    return isEdit.value? '編輯' : '新增'
  })

  // mainImages
  const previewUrl = ref(null)
  const previewName = ref('請選擇圖片檔案')

  const isChanging = ref(false)
  const changeImage = () => {
    isChanging.value = true
  }

  const onFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now()}_newsImage`, { type: file.type })
      selectFile.value = newFile
      previewUrl.value = URL.createObjectURL(file)
      previewName.value = file.name
    } else {
      previewUrl.value = null
      previewName.value = '請選擇圖片檔案'
    }
  }

  const isReady = computed( () => {
    let ready = true
    // if( !newsInfo.value.imageURL && !previewimageURL.value ) { ready = false}
    // if( !newsInfo.value.topic.en ) { ready = false}
    // if( !newsInfo.value.topic.zh ) { ready = false}
    // if( !newsInfo.value.source ) { ready = false}
    // if( !newsInfo.value.description.en ) { ready = false}
    // if( !newsInfo.value.description.zh ) { ready = false}
    // if( !newsInfo.value.detail.en ) { ready = false}
    // if( !newsInfo.value.detail.zh ) { ready = false}
    
    // if( newsInfo.value.topic.en == '' ) { ready = false}
    // if( newsInfo.value.topic.zh == '' ) { ready = false}
    // if( newsInfo.value.source == '' ) { ready = false}
    // if( newsInfo.value.description.en == '' ) { ready = false}
    // if( newsInfo.value.description.zh == '' ) { ready = false}
    // if( newsInfo.value.detail.en == '' ) { ready = false}
    // if( newsInfo.value.detail.zh == '' ) { ready = false}

    return ready
  })

  // newsImages
  const previewimageURL = ref([])
  const previewImageName = ref([])
  const isImageChanging = ref([])

  const changeImages = (listIdx, idx) => {
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
    ) || data[0]
  }
  const onImageFileChange = (event, listIdx, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + listIdx + idx}_newsImage`, { type: file.type })

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
    newsInfo.value.content.push({
      layout: {
        direction: 'single-vertical',
        position: 'image-top'
      },
      article: [{
        title: {
          en: '',
          zh: ''
        },
        text: {
          en: '',
          zh: ''
        },
        imageURL: '',
        imagePublicId: ''
      }]
    })
    selectImageFiles.value.push({
      index: [newsInfo.value.content.length - 1, 0],
      file: null
    })
    updateImageFile.value.push({
      index: [newsInfo.value.content.length - 1, 0],
      name: ''
    })
    isImageChanging.value.push({
      index: [newsInfo.value.content.length - 1, 0],
      isChange: true
    })
    previewimageURL.value.push({
      index: [newsInfo.value.content.length - 1, 0],
      url: ''
    })
    previewImageName.value.push({
      index: [newsInfo.value.content.length - 1, 0],
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
    newsInfo.value.content.splice(idx, 1)
    removeParent(updateImageFile.value, idx)
    removeParent(selectImageFiles.value, idx)
    removeParent(previewimageURL.value, idx)
    removeParent(previewImageName.value, idx)
    removeParent(isImageChanging.value, idx)
  }

  const backcardList = () => {
    router.push({ name: 'newsList'})
  }

  const initNewsInfo = () => {
    if (isEdit.value) {
      news.value.data.forEach( news => {
        if (news._id == route.params.id) {
          newsInfo.value = { ...news }
        }
      })
      newsInfo.value.content.forEach( (item, listIdx) => {
        item.article.forEach( (image, idx) => {
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
    if (newsInfo.value.content.length == 0) {
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

  const onClassChange = (listIdx) => {
    const type = newsInfo.value.content[listIdx].layout.direction.split('-')[0]
    if (type == 'single' && newsInfo.value.content[listIdx].article.length == 2) {
      newsInfo.value.content[listIdx].article.splice(1, 1)

      const selectTarget = findTarget(selectImageFiles.value, listIdx, 1)
      selectImageFiles.value.splice(selectImageFiles.value.indexOf(selectTarget), 1)

      const updateTarget = findTarget(updateImageFile.value, listIdx, 1)
      updateImageFile.value.splice(updateImageFile.value.indexOf(updateTarget), 1)

      const changeTarget = findTarget(isImageChanging.value, listIdx, 1)
      isImageChanging.value.splice(isImageChanging.value.indexOf(changeTarget), 1)

      const urlTarget = findTarget(previewimageURL.value, listIdx, 1)
      previewimageURL.value.splice(previewimageURL.value.indexOf(urlTarget), 1)

      const nameTarget = findTarget(previewImageName.value, listIdx, 1)
      previewImageName.value.splice(previewImageName.value.indexOf(nameTarget), 1)

    } else if (type == 'double'  && newsInfo.value.content[listIdx].article.length == 1) {
      newsInfo.value.content[listIdx].article.push({
        title: {
          en: '',
          zh: ''
        },
        text: {
          en: '',
          zh: ''
        },
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
    await getNews.value()
    initNewsInfo()
    if (newsInfo.value.status == 'draft') {
      isDraft.value = true
    } else if (newsInfo.value.status == 'archived') {
      isArchived.value = true
    }
    updateImageFile.value = []
    selectImageFiles.value = []
  })

  function moveItemInArray(array, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= array.length) return;
    const item = array.splice(fromIndex, 1)[0];
    array.splice(toIndex, 0, item);
  }

  const orderEdit = (type, listIdx) => {
    const targetIdx = type === 'up' ? listIdx - 1 : listIdx + 1;
    if (targetIdx < 0 || targetIdx >= newsInfo.value.content.length) return;

    // 移動主要內容
    moveItemInArray(newsInfo.value.content, listIdx, targetIdx);

    // 以下同步搬移每一個圖片相關的陣列中所有屬於 listIdx 的資料
    const arraysToUpdate = [
      selectImageFiles.value,
      updateImageFile.value,
      previewimageURL.value,
      previewImageName.value,
      isImageChanging.value
    ];

    arraysToUpdate.forEach(array => {
      const groupA = array.filter(item => item.index[0] === listIdx);
      const groupB = array.filter(item => item.index[0] === targetIdx);

      // 交換 index[0]
      groupA.forEach(item => item.index[0] = targetIdx);
      groupB.forEach(item => item.index[0] = listIdx);

      // 重組 array：groupA 和 groupB 位置互換，其它不變
      const rest = array.filter(item => item.index[0] !== listIdx && item.index[0] !== targetIdx);
      array.splice(0, array.length, ...rest, ...groupA, ...groupB);
    });
  };

  const openPreview = () => {
    const tempNewsInfo = { ...newsInfo.value }

    tempNewsInfo.topic = { ...newsInfo.value.topic }
    tempNewsInfo.description = { ...newsInfo.value.description }
    tempNewsInfo.detail = { ...newsInfo.value.detail }

    tempNewsInfo.imageURL = isChanging.value && previewUrl.value
      ? previewUrl.value
      : newsInfo.value.imageURL

    tempNewsInfo.content = newsInfo.value.content.map((item, listIdx) => {
      const newItem = {
        layout: { ...item.layout },
        article: item.article.map((articleItem, idx) => {
          const isChanged = isImageChanging.value.find(el =>
            el.index[0] === listIdx && el.index[1] === idx
          )?.isChange

          const newUrl = previewimageURL.value.find(el =>
            el.index[0] === listIdx && el.index[1] === idx
          )?.url

          return {
            ...articleItem,
            imageURL: isChanged && newUrl ? newUrl : articleItem.imageURL
          }
        })
      }
      return newItem
    })

    openPreviewDialog.value('news', tempNewsInfo)
  }


</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backcardList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ typeWording }}貼文</h1>
    </div>
  </div>
  <div class="editArea">
    <img
      :src="newsInfo.imageURL"
      v-if="newsInfo.imageURL && !isChanging">
    <img
      :src="previewUrl"
      v-else-if="previewUrl && isChanging">
    <div class="noImage" v-else><span>沒有圖片</span></div>
    <button
      v-if="!isChanging && !isArchived"
      @click="changeImage">
      更改圖片
    </button>
    <div v-else-if="!isArchived" class="imageSelect">
      <input
        type="file"
        accept=".jpg, .png"
        name="selectImage"
        id="selectImage"
        @change="onFileChange">
      <span>{{ previewName }}</span>
      <label for="selectImage">選擇檔案</label>
    </div>
    <div class="inputItem inputItem--column">
      <ul class="projectImages">
        <li v-for="(item, listIdx) in newsInfo.content">
          <div class="selectItemArea">
            <div class="selectItem">
              <div class="head">排列形式</div>
              <select
                v-model="item.layout.direction"
                @change="onClassChange(listIdx)"
                :disabled="isArchived">
                <option value="" selected disabled>請選擇排列形式</option>
                <option value="single-vertical">單張垂直</option>
                <option value="double-vertical">兩張垂直</option>
                <option value="single-horizon">單張平行</option>
                <option value="double-horizon">兩張平行</option>
              </select>
            </div>
            <div class="selectItem">
              <div class="head">圖片位置</div>
              <select
                v-model="item.layout.position"
                :disabled="isArchived">
                <option value="" selected disabled>請選擇圖片位置</option>
                <option
                  v-if="item.layout.direction.split('-')[1] == 'horizon'"
                  value="image-left">置左</option>
                <option
                  v-if="item.layout.direction.split('-')[1] == 'horizon'"
                  value="image-right">置右</option>
                <option
                  v-if="item.layout.direction.split('-')[1] == 'vertical'"
                  value="image-top">置頂</option>
                <option
                  v-if="item.layout.direction.split('-')[1] == 'vertical'"
                  value="image-bottom">置底</option>
              </select>
            </div>
            <div class="buttonArea">
              <button class="smallButton" @click="orderEdit('up', listIdx)">順序上移</button>
              <button class="smallButton" @click="orderEdit('down', listIdx)">順序下移</button>
            </div>
          </div>
          <div class="imageList">
            <div class="imageList__image" v-for="(article, idx) in item.article">
              <img
                :src="article.imageURL"
                v-if="article.imageURL && !findTarget(isImageChanging, listIdx, idx).isChange">
              <img
                :src="findTarget(previewimageURL, listIdx, idx) && findTarget(previewimageURL, listIdx, idx).url"
                v-else-if="findTarget(previewimageURL, listIdx, idx) && findTarget(previewimageURL, listIdx, idx).url && findTarget(isImageChanging, listIdx, idx).isChange">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="findTarget(isImageChanging, listIdx, idx) && !findTarget(isImageChanging, listIdx, idx).isChange && !isArchived"
                @click="changeImages(listIdx, idx)">
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
              <input
                v-model="article.title.en"
                placeholder="請輸入英文標題"
                type="text"
                :disabled="isArchived">
              <textarea
                v-model="article.text.en"
                placeholder="請輸入英文內容"
                :disabled="isArchived"></textarea>
              <input
                v-model="article.title.zh"
                placeholder="請輸入中文標題"
                type="text"
                :disabled="isArchived">
              <textarea
                v-model="article.text.zh"
                placeholder="請輸入中文內容"
                :disabled="isArchived"></textarea>
            </div>
            <div class="deleteImage" @click="removeImage(listIdx)"><span class="material-icons">close</span></div>
          </div>
        </li>
      </ul>
      <button @click="addImage()">新增圖片欄</button>
    </div>
    <div class="inputItem" v-if="isEdit">
      <div class="head">貼文狀態</div>
      <select
        v-if="!isDraft"
        v-model="newsInfo.status"
        :disabled="isArchived">
        <option value="" disabled>請選擇貼文狀態</option>
        <option value="active">上架</option>
        <option value="inactive">下架</option>
      </select>
      <select v-else disabled>
        <option>草稿</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">分類</div>
      <select
        v-model="newsInfo.category"
        :disabled="isArchived">
        <option value="" disabled>請選擇貼文分類</option>
        <option value="Press_Coverage">Press Coverage</option>
        <option value="Joural_Articles">Joural Articles</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">標題(英)</div>
      <input
        v-model="newsInfo.topic.en"
        :disabled="isArchived"
        placeholder="請輸入英文標題"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">標題(中)</div>
      <input
        v-model="newsInfo.topic.zh"
        :disabled="isArchived"
        placeholder="請輸入中文標題"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">來源</div>
      <input
        v-model="newsInfo.source"
        :disabled="isArchived"
        placeholder="請輸入來源"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <textarea
        v-model="newsInfo.description.en"
        :disabled="isArchived"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <textarea
        v-model="newsInfo.description.zh"
        :disabled="isArchived"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">詳細內容(英)</div>
      <textarea
        v-model="newsInfo.detail.en"
        :disabled="isArchived"
        placeholder="請輸入英文詳細內容"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">詳細內容(中)</div>
      <textarea
        v-model="newsInfo.detail.zh"
        :disabled="isArchived"
        placeholder="請輸入中文詳細內容"
        type="text"></textarea>
    </div>
    <div class="buttonArea">
      <div class="buttonArea" v-if="isEdit && !isArchived && !isDraft">
        <button
          @click="openPreview()">預覽</button>
        <button  
          :disabled="!isReady"
          @click="editNews(newsInfo, 'edit')">儲存編輯</button>
        <button  
          :disabled="!isReady"
          v-if="!isDraft"
          @click="openDialog('archive', '確定封存', '封存後將無法編輯，是否要將此貼文編輯？', 'newsList', newsInfo)">封存貼文</button>
      </div>
      <div class="buttonArea" v-else-if="(!isEdit || isDraft) && !isArchived">
        <button
          @click="openPreview()">預覽</button>
        <button  
          :disabled="!isReady"
          v-if="!isEdit"
          @click="editNews(newsInfo, 'create')">創建草稿</button>
        <button  
          :disabled="!isReady"
          v-else
          @click="editNews(newsInfo, 'save')">儲存草稿</button>
        <button  
          :disabled="!isReady"
          v-if="!isEdit"
          @click="editNews(newsInfo, 'add')">上架貼文</button>
        <button  
          :disabled="!isReady"
          v-else
          @click="editNews(newsInfo, 'active')">上架貼文</button>
      </div>
      <div class="buttonArea">
        <button  
          :disabled="!isReady"
          v-if="isEdit"
          @click="openDialog('delete', '確定刪除', '刪除後將無法復原，是否要將此貼文刪除？', 'newsList', newsInfo._id)">刪除貼文</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
