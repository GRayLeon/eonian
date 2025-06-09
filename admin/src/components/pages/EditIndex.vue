<script setup>
  import { usePagesStore } from '@/stores/pages'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted, onUpdated } from 'vue';

  const pagesStore = usePagesStore()
	const { 
    getPages, pages, selectIndexImageFiles, updateIndexImageFile
  } = storeToRefs(pagesStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  // indexImages
  // const previewUrl = ref(null)
  // const previewName = ref('請選擇圖片檔案')

  // const isChanging = ref(false)
  // const changeImage = () => {
  //   isChanging.value = true
  // }

  // const onFileChange = event => {
  //   const file = event.target.files[0]
  //   if (file) {
  //     selectIndexFile.value = file
  //     previewUrl.value = URL.createObjectURL(file)
  //     previewName.value = file.name
  //   } else {
  //     previewUrl.value = null
  //     previewName.value = '請選擇圖片檔案'
  //   }
  // }

  const previewIndeximageURL = ref([])
  const previewIndexImageName = ref(['請選擇圖片檔案'])

  const isIndexImageChanging = ref([])
  const changeIndexImage = idx => {
    isIndexImageChanging.value[idx] = true
  }

  const onIndexImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_indexImage`, { type: file.type })
      selectIndexImageFiles.value[idx] = newFile
      previewIndeximageURL.value[idx] = URL.createObjectURL(file)
      previewIndexImageName.value[idx] = file.name
      updateIndexImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewIndeximageURL.value[idx] = null
      previewIndexImageName.value[idx] = '請選擇圖片檔案'
      updateIndexImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateIndexImageFile.value.splice(findx, 1)
        }
      })
    }
  }
  
  const addIndexImage = () => {
    pages.value.index.images.push({
      imageURL: '',
      imagePublicId: ''
    })
    isIndexImageChanging.value.push(true)
  }

  const removeIndexImage = idx => {
    pages.value.index.images.splice(idx, 1)
    selectIndexImageFiles.value.splice(idx, 1)
    previewIndeximageURL.value.splice(idx, 1)
    previewIndexImageName.value.splice(idx, 1)
    isIndexImageChanging.value.splice(idx, 1)
  }
  
  const initPages = () => {
    pages.value.index.images.forEach(() => {
      isIndexImageChanging.value.push(false)
    })
  }

  onMounted( async () => {
    isLoading.value = true
    await getPages.value()
    initPages()
    updateIndexImageFile.value = []
    selectIndexImageFiles.value = []
    isLoading.value = false
  })

</script>

<template>
  <div class="editArea">
    <!-- <img
      :src="pages.index.imageURL"
      v-if="pages.index.imageURL && !isChanging">
    <img
      :src="previewUrl"
      v-else-if="previewUrl && isChanging">
    <div class="noImage" v-else><span>沒有圖片</span></div>
    <button
      v-if="!isChanging"
      @click="changeImage">
      更改圖片
    </button>
    <div v-else class="imageSelect">
      <input
        type="file"
        accept=".jpg, .png"
        name="selectImage"
        id="selectImage"
        @change="onFileChange">
      <span>{{ previewName }}</span>
      <label for="selectImage">選擇檔案</label>
    </div> -->
    <div class="inputItem inputItem--column">
      <ul class="subImages">
        <li v-for="(indexImage, idx) in pages.index.images">
          <img
            :src="indexImage.imageURL"
            v-if="indexImage.imageURL && !isIndexImageChanging[idx]">
          <img
            :src="previewIndeximageURL[idx]"
            v-else-if="previewIndeximageURL[idx] && isIndexImageChanging[idx]">
          <div class="noImage" v-else><span>沒有圖片</span></div>
          <button
            v-if="!isIndexImageChanging[idx] && !isArchived"
            @click="changeIndexImage(idx)">
            更改圖片
          </button>
          <div v-else-if="!isArchived" class="imageSelect">
            <input
              type="file"
              accept=".jpg, .png"
              name="selectImage"
              :id="`selectIndexImage-${idx}`"
              @change="onIndexImageFileChange($event, idx)">
            <span>{{ previewIndexImageName[idx] }}</span>
            <label :for="`selectIndexImage-${idx}`">選擇檔案</label>
          </div>
          <div class="deleteImage" @click="removeIndexImage(idx)"><span class="material-icons">close</span></div>
        </li>
      </ul>
      <button @click="addIndexImage()">新增圖片</button>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <textarea
        v-model="pages.index.description.en"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <textarea
        v-model="pages.index.description.zh"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
  </div>
</template>

<style scoped>
</style>
