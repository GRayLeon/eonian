<script setup>
  import { usePagesStore } from '@/stores/pages'
  import { storeToRefs } from 'pinia'
  import { RouterView, RouterLink } from 'vue-router';
  import { computed, onMounted, onUpdated } from 'vue'

  const pagesStore = usePagesStore()
	const { getPages, editPages, pages } = storeToRefs(pagesStore)

  const isReady = computed( () => {
    let ready = true
    return ready
  })

  onMounted( () => {
    getPages.value()
  })

  onUpdated( () => {
    getPages.value()
  })
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">description</span>頁面管理</h1>
  </div>
  <ul class="specList">
    <li>
      <RouterLink to="/pages">首頁</RouterLink>
    </li>
    <li>
      <RouterLink to="/pages/vision">關於我們</RouterLink>
    </li>
    <li>
      <RouterLink to="/pages/partner">合作夥伴</RouterLink>
    </li>
    <li>
      <RouterLink to="/pages/contact">聯絡我們</RouterLink>
    </li>
  </ul>
  <div class="borderBox">
    <RouterView></RouterView>
  </div>
  <div class="buttonArea">
      <button
        :disabled="!isReady"
        @click="editPages(pages)">
        儲存編輯
      </button>
    </div>
</template>

<style scoped>
</style>
