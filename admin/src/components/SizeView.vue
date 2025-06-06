<script setup>
  import { useSizeStore } from '@/stores/size'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const sizeStore = useSizeStore()
	const { getSizeDatas } = storeToRefs(sizeStore)

  onMounted( () => {
    getSizeDatas.value()
  })

  onUpdated( () => {
    getSizeDatas.value()
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
