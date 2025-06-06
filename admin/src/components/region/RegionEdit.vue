<script setup>
  import { useRegionStore } from '@/stores/region'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue'

  const regionStore = useRegionStore()
	const { regions, editRegion } = storeToRefs(regionStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const backRegionList = () => {
    router.push({ name: 'regionList'})
  }

  const region = ref({
    name: {
      en: '',
      zh: ''
    },
    status: false,
    imageURL: '',
    imagePiblicId: ''
  })

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const selectFile = ref(null)
  const previewUrl = ref(null)
  const previewName = ref('請選擇圖片檔案')

  const isChanging = ref(false)
  const changeImage = () => {
    isChanging.value = true
  }

  const onFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      selectFile.value = file
      previewUrl.value = URL.createObjectURL(file)
      previewName.value = file.name
    } else {
      previewUrl.value = null
      previewName.value = '請選擇圖片檔案'
    }
  }

  const initRegion = () => {
    if (isEdit.value) {
      regions.value.forEach(regionData => {
        if (regionData._id == route.params.id) {
          region.value = { ...regionData }
        }
        isLoading.value = false
      })
    }
  }

  onMounted(() => {
    isLoading.value = true
    initRegion()
  })
</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backRegionList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ isEdit ? '編輯' : '新增' }}地區</h1>
    </div>
  </div>
  <div class="editArea">
    <img
      :src="region.imageURL"
      v-if="region.imageURL && !isChanging">
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
      <input type="file" accept=".jpg, .png" name="selectImage" id="selectImage" @change="onFileChange">
      <span>{{ previewName }}</span>
      <label for="selectImage">選擇檔案</label>
    </div>
    <div class="inputItem">
      <div class="head">名稱(英)</div>
      <input
        v-model="region.name['en']"
        placeholder="請輸入英文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">名稱(中)</div>
      <input
        v-model="region.name['zh']"
        placeholder="請輸入中文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">狀態</div>
      <select v-model="region.status">
        <option value="" disabled>請選擇狀態</option>
        <option value="true">啟用</option>
        <option value="false">停用</option>
      </select>
    </div>
    <div class="buttonArea">
      <button @click="editRegion(region, isEdit ? 'edit' : 'add', selectFile, 'regionList')">
        {{ isEdit ? '儲存編輯' : '新增地區' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
