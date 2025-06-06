<script setup>
  import { useSpecStore } from '@/stores/spec'
  import { storeToRefs } from 'pinia'
  import { RouterView, RouterLink } from 'vue-router';
  import { computed, onMounted, onUpdated } from 'vue'

  const specStore = useSpecStore()
	const { getSpecDatas, editSpec, specDatas, selectBrandFiles, updateBrandFile } = storeToRefs(specStore)

  const isReady = computed( () => {
    let ready = true
    return ready
  })

  onMounted( () => {
    getSpecDatas.value()
  })

  onUpdated( () => {
    getSpecDatas.value()
  })
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">crop_free</span>規格管理</h1>
  </div>
  <ul class="specList">
    <li>
      <RouterLink to="/spec">地區管理</RouterLink>
    </li>
    <li>
      <RouterLink to="/spec/appearance">外觀管理</RouterLink>
    </li>
    <li>
      <RouterLink to="/spec/functionality">功能管理</RouterLink>
    </li>
    <li>
      <RouterLink to="/spec/support">配套管理</RouterLink>
    </li>
    <li>
      <RouterLink to="/spec/specBrand">品牌管理</RouterLink>
    </li>
  </ul>
  <div class="borderBox">
    <RouterView></RouterView>
  </div>
  <div class="buttonArea">
      <button
        :disabled="!isReady"
        @click="editSpec(specDatas, selectBrandFiles, updateBrandFile)">
        儲存編輯
      </button>
    </div>
</template>

<style scoped>
</style>
