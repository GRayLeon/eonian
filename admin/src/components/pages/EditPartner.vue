<script setup>
  import { usePagesStore } from '@/stores/pages'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted, onUpdated } from 'vue';

  const pagesStore = usePagesStore()
	const { 
    getPages, pages, selectPartnerImageFiles, updatePartnerImageFile 
  } = storeToRefs(pagesStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  // partnerImages
  const previewPartnerimageURL = ref([])
  const previewPartnerImageName = ref(['請選擇圖片檔案'])

  const isPartnerImageChanging = ref([])
  const changePartnerImage = idx => {
    isPartnerImageChanging.value[idx] = true
  }

  const onPartnerImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_partnerImage`, { type: file.type })
      selectPartnerImageFiles.value[idx] = newFile
      previewPartnerimageURL.value[idx] = URL.createObjectURL(file)
      previewPartnerImageName.value[idx] = file.name
      updatePartnerImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewPartnerimageURL.value[idx] = null
      previewPartnerImageName.value[idx] = '請選擇圖片檔案'
      updatePartnerImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updatePartnerImageFile.value.splice(findx, 1)
        }
      })
    }
  }
  
  const addPartnerImage = () => {
    pages.value.partners.push({
      name: '',
      imageURL: '',
      imagePublicId: ''
    })
    isPartnerImageChanging.value.push(true)
  }

  const removePartnerImage = idx => {
    pages.value.partners.splice(idx, 1)
    selectPartnerImageFiles.value.splice(idx, 1)
    previewPartnerimageURL.value.splice(idx, 1)
    previewPartnerImageName.value.splice(idx, 1)
    isPartnerImageChanging.value.splice(idx, 1)
  }
  
  const initPartnerInfo = () => {
    pages.value.partners.forEach( partner => {
      isPartnerImageChanging.value.push(false)
    })
  }

  onMounted( async () => {
    isLoading.value = 
    await getPages.value()
    initPartnerInfo()
    updatePartnerImageFile.value = []
    selectPartnerImageFiles.value = []
    isLoading.value = false
  })

</script>

<template>
  <div class="editArea">
    <div class="partnerList">
      <div
        class="partnerInputArea"
        v-for="(partner, idx) in pages.partners">
        <div class="partnerInputItem">
          <div class="imgArea">
            <img
              :src="partner.imageURL"
              v-if="partner.imageURL && !isPartnerImageChanging[idx]">
            <img
              :src="previewPartnerimageURL[idx]"
              v-else-if="previewPartnerimageURL[idx] && isPartnerImageChanging[idx]">
            <div class="noImage" v-else><span>沒有圖片</span></div>
            <button
              v-if="!isPartnerImageChanging[idx]"
              @click="changePartnerImage(idx)">
              更改圖片
            </button>
            <div v-else class="imageSelect">
              <input
                type="file"
                accept=".jpg, .png" name="selectImage" :id="`selectPartnerImage-${idx}`"
                @change="onPartnerImageFileChange($event, idx)">
              <span>{{ previewPartnerImageName[idx] }}</span>
              <label :for="`selectPartnerImage-${idx}`">選擇檔案</label>
            </div>
          </div>
        </div>
        <div class="partnerInputItem">
          <div class="subHead">名稱</div>
          <input
            type="text"
            v-model="partner.name"
            placeholder="請輸入名稱" />
        </div>
        <div class="shapeInputOption">
          <div
            class="partnerButton"
            v-if="pages.partners.length > 1"
            @click="removePartnerImage(idx)">
            <span class="material-icons">close</span>
          </div>
        </div>
      </div>
      <div class="addButtonArea">
        <button
          class="smallButton"
          @click="addPartnerImage()">
          新增
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
