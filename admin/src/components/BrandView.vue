<script setup>
  import { useBrandStore } from '@/stores/brand'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const brandStore = useBrandStore()
  const { category, status, sort, order, getBrands } = storeToRefs(brandStore)

  onMounted( () => {
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getBrands.value()
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
