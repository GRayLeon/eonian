<script setup>
  import { useNewsStore } from '@/stores/news'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const newsStore = useNewsStore()
  const { category, status, sort, order, getNews } = storeToRefs(newsStore)

  onMounted( () => {
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getNews.value()
  })
  
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
