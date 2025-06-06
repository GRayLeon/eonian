<script setup>
    import { useRouter } from 'vue-router'

    const router = useRouter()

    setTimeout( () => {
        router.push({ name: 'home'})
    }, 2000)
</script>

<template>
  <div class="building">
    <span>找不到此頁面</span>
  </div>
</template>

<style scoped>
</style>
