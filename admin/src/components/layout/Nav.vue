<script setup>
  import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="mainNav">
    <nav>
      <RouterLink to="/">
        <span class="material-icons">home</span>
        <span>系統首頁</span>
      </RouterLink>
      <!-- <RouterLink to="/editor">頁面文案</RouterLink> -->
      <RouterLink to="/product">
        <span class="material-icons">list_alt</span>
        <span>產品管理</span>
      </RouterLink>
      <RouterLink to="/spec">
        <span class="material-icons">crop_free</span>
        <span>規格管理</span>
      </RouterLink>
      <RouterLink to="/brand">
        <span class="material-icons">category</span>
        <span>品牌管理</span>
      </RouterLink>
      <RouterLink to="/project">
        <span class="material-icons">folder</span>
        <span>專案管理</span>
      </RouterLink>
      <RouterLink to="/news">
        <span class="material-icons">article</span>
        <span>貼文管理</span>
      </RouterLink>
      <RouterLink to="/inquiry">
        <span class="material-icons">edit_note</span>
        <span>諮詢管理</span>
      </RouterLink>
      <RouterLink to="/pages">
        <span class="material-icons">description</span>
        <span>頁面管理</span>
      </RouterLink>
      <RouterLink to="/account">
        <span class="material-icons">group</span>
        <span>帳號管理</span>
      </RouterLink>
    </nav>
  </div>
</template>

<style scoped>
</style>