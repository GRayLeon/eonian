<script setup>
  import { useInquiryStore } from '@/stores/inquiry'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const inquiryStore = useInquiryStore()
  const { category, status, sort, order, getInquiryDatas } = storeToRefs(inquiryStore)

  onMounted( () => {
    category.value = ''
    status.value = ''
    sort.value = '_id'
    order.value = 'asc'
    getInquiryDatas.value()
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
