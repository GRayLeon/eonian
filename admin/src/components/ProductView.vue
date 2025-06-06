<script setup>
  import { useProductStore } from '@/stores/product'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted } from 'vue'

  const productStore = useProductStore()
  const { category, status, sort, order, getProducts } = storeToRefs(productStore)

  onMounted( () => {
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getProducts.value()
  })

</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
