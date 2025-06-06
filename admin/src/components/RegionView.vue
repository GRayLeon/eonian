<script setup>
  import { useRegionStore } from '@/stores/region'
  import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router';
  import { onMounted, onUpdated } from 'vue'

  const regionStore = useRegionStore()
	const { getRegions } = storeToRefs(regionStore)

  onMounted( () => {
    getRegions.value()
  })

  onUpdated( () => {
    getRegions.value()
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
