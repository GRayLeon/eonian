<script setup>
  import { useNewsStore } from '@/stores/news'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router'
  import { onMounted } from 'vue'

  const newsStore = useNewsStore()
	const { getNews } = storeToRefs(newsStore)

  const loadStore = useLoadStore()
	const { isMenuOpen } = storeToRefs(loadStore)

  onMounted( () => {
    isMenuOpen.value = false
    getNews.value()
  })
</script>

<template>
  <transition name="fade" mode="out-in">
    <RouterView />
  </transition>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to, .fade-leave-from {
    opacity: 1;
  }
</style>
