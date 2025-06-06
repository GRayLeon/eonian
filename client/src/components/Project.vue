<script setup>
  import { useProjectStore } from '@/stores/project'
  import { useLoadStore } from '@/stores/load'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router'
  import { onMounted } from 'vue'

  const projectStore = useProjectStore()
  const { getProjects } = storeToRefs(projectStore)

  const loadStore = useLoadStore()
	const { isMenuOpen } = storeToRefs(loadStore)

  onMounted( () => {
    isMenuOpen.value = false
    getProjects.value()
  })
</script>

<template>
  <RouterView v-slot="{ Component }">
    <transition name="slide" mode="out-in">
      <component :is="Component" />
    </transition>
  </RouterView>
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
