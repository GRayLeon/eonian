<script setup>
  import { useProjectStore } from '@/stores/project'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const projectStore = useProjectStore()
  const { category, status, sort, order, getProjects } = storeToRefs(projectStore)

  onMounted( () => {
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getProjects.value()
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
