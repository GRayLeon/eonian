<script setup>
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)


</script>

<template>
  <div class="adminLoading" v-if="isLoading">
    <span>L</span>
    <span>O</span>
    <span>A</span>
    <span>D</span>
    <span>I</span>
    <span>N</span>
    <span>G</span>
  </div>
</template>

<style scoped>
</style>
