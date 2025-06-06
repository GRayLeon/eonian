<script setup>
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { onMounted } from 'vue'

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  onMounted( () => {
    isLoading.value = false
  })
</script>

<template>
  <div class="homeContent">
    <h2>功能介紹：</h2>
    <ul>
      <li><b>產品管理：</b>調整產品狀態，管理產品上架或下架。</li>
      <li><b>規格管理：</b>編輯商品相關各項規格，提供前台使用者篩選商品。</li>
      <li><b>品牌管理：</b>調整品牌狀態，管理品牌上架或下架。</li>
      <li><b>專案管理：</b>調整專案狀態，管理專案上架或下架。</li>
      <li><b>貼文管理：</b>調整貼文狀態，管理貼文上架或下架。</li>
      <li><b>諮詢管理：</b>調整諮詢表單狀態，並下載諮詢表單</li>
      <li><b>頁面管理：</b>調整頁面內容。</li>
      <li><b>帳號管理：</b>設置與管理後台帳號及其使用權限。</li>
    </ul>
    <hr>
    <h2>開發環境：</h2>
    <ul>
      <li><b>前端：</b>Vue 3 + Vite</li>
      <li><b>後端：</b>Express</li>
      <li><b>資料庫：</b>MongoDB Atlas</li>
      <li><b>媒體存儲：</b>Cloudinary</li>
      <li><b>部署平台：</b>Render</li>
    </ul>
  </div>
</template>

<style scoped>
</style>
