<script setup>
  import { useSpecStore } from '@/stores/spec'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted, onUpdated } from 'vue'

  const specStore = useSpecStore()
	const { specDatas, getSpecDatas, selectBrandFiles, updateBrandFile } = storeToRefs(specStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  // brands
  const previewBrandUrl = ref([])
  const previewBrandName = ref(['請選擇圖片檔案'])

  const isBrandChanging = ref([])
  const changeBrandImage = idx => {
    isBrandChanging.value[idx] = true
  }

  const onBrandFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_brandImage`, { type: file.type })
      selectBrandFiles.value[idx] = newFile
      previewBrandUrl.value[idx] = URL.createObjectURL(file)
      previewBrandName.value[idx] = file.name
      updateBrandFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewBrandUrl.value[idx] = null
      previewBrandName.value[idx] = '請選擇圖片檔案'
      updateBrandFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateBrandFile.value.splice(findx, 1)
        }
      })
    }
  }

  const addBrand = () => {
    specDatas.value.brands.list.push({
      name: '',
      imageURL: '',
      imagePublicId: ''
    })
    isBrandChanging.value.push(true)
  }

  const removeBrand = idx => {
    specDatas.value.brands.list.splice(idx, 1)
    selectBrandFiles.value.splice(idx, 1)
    previewBrandUrl.value.splice(idx, 1)
    previewBrandName.value.splice(idx, 1)
    isBrandChanging.value.splice(idx, 1)
  }

  const initBrandInfo = () => {
    specDatas.value.brands.list.forEach( brand => {
      isBrandChanging.value.push(false)
    })
  }

  onMounted(() => {
    isLoading.value = true
    initBrandInfo()
  })

  onUpdated( () => {
    isLoading.value = false
  })
</script>

<template>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="image">圖片</th>
        <th class="name">名稱</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr
        v-for="(brand, idx) in specDatas.brands.list">
        <td class="image">
          <div class="inputImgArea">
            <img
              :src="brand.imageURL"
              v-if="brand.imageURL && !isBrandChanging[idx]">
            <img
              :src="previewBrandUrl[idx]"
              v-else-if="previewBrandUrl[idx] && isBrandChanging[idx]">
            <div class="noImage" v-else><span>沒有圖片</span></div>
            <button
              v-if="!isBrandChanging[idx]"
              @click="changeBrandImage(idx)">
              更改圖片
            </button>
            <div v-else class="imageSelect">
              <input
                type="file"
                accept=".jpg, .png" name="selectImage" :id="`selectImage-${idx}`"
                @change="onBrandFileChange($event, idx)">
              <span>{{ previewBrandName[idx] }}</span>
              <label :for="`selectImage-${idx}`">選擇檔案</label>
            </div>
          </div>
        </td>
        <td class="name">
          <input
            type="text"
            placeholder="請輸入品牌"
            v-model="brand.name" />
        </td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="removeBrand(idx)">刪除品牌</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="bottomButtonArea">
    <button @click="addBrand()">新增品牌</button>
  </div>
</template>

<style scoped>
</style>
