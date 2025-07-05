<script setup>
  import { RouterView } from 'vue-router'
  import { useAccountStore } from '@/stores/account'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { onMounted, onUpdated } from 'vue'
  
  const accountStore = useAccountStore()
	const { getAccounts } = storeToRefs(accountStore)

  onMounted( () => {
    getAccounts.value()
  })
</script>

<template>
  <RouterView></RouterView>
</template>

<style scoped>
</style>
