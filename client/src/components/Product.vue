<script setup>
  import { useProductStore } from '@/stores/product'
  import { useLoadStore } from '@/stores/load'
  import { useSpecStore } from '@/stores/spec'
	import { storeToRefs } from 'pinia'
  import { RouterView } from 'vue-router'
  import { onMounted } from 'vue'

  const productStore = useProductStore()
	const { page, getProducts } = storeToRefs(productStore)

  const specStore = useSpecStore()
	const { getSpecDatas } = storeToRefs(specStore)

  const loadStore = useLoadStore()
	const { isMenuOpen } = storeToRefs(loadStore)

  onMounted( () => {
    isMenuOpen.value = false
    getProducts.value(page.value)
    getSpecDatas.value()
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
