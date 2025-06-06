<script setup>
  import { useCategoryStore } from '@/stores/category'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const categoryStore = useCategoryStore()
	const { getCategorys } = storeToRefs(categoryStore)

  onMounted( () => {
    getCategorys.value()
  })

  onUpdated( () => {
    getCategorys.value()
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
