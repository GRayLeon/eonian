<script setup>
  import { useSizeStore } from '@/stores/size'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue'

  const sizeStore = useSizeStore()
	const { sizeDatas, editSize } = storeToRefs(sizeStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const backSizeList = () => {
    router.push({ name: 'sizeList'})
  }

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isReady = computed( () => {
    let ready = true
    // if (!size.value.size) { ready = false }
    // if (!size.value.scale) { ready = false }
    return ready
  })

  const size = ref({
    size: '',
    scale: '',
    active: false
  })

  const initSize = () => {
    if (isEdit.value) {
      sizeDatas.value.forEach(sizeData => {
        if (sizeData._id == route.params.id) {
          size.value = { ...sizeData }
        }
        isLoading.value = false
      })
    }
  }

  onMounted(() => {
    isLoading.value = true
    initSize()
  })
</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backSizeList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ isEdit ? '編輯' : '新增' }}規格</h1>
    </div>
  </div>
  <div class="editArea">
    <div class="inputItem">
      <div class="head">規格</div>
      <input
        v-model="size.size"
        placeholder="請輸入規格文字"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">價格倍率</div>
      <input 
        v-model="size.scale"
        placeholder="請輸入價格倍率"
        type="number"/>
    </div>
    <div class="inputItem">
      <div class="head">狀態</div>
      <select v-model="size.active">
        <option value="" disabled>請選擇狀態</option>
        <option value="true">啟用</option>
        <option value="false">停用</option>
      </select>
    </div>
    <div class="buttonArea">
      <button
        :disabled="!isReady"
        @click="editSize(size, isEdit ? 'edit' : 'add', 'sizeList')">
        {{ isEdit ? '儲存編輯' : '新增規格' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
