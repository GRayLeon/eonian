<script setup>
  import { RouterView, useRouter } from 'vue-router'
  import { useAuthStore } from '@/stores/auth'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { watch, onMounted } from 'vue'

  import Nav from '../components/layout/Nav.vue'
  import AccountBox from '../components/layout/AccountBox.vue'
  import Dialog from '../components/layout/Dialog.vue'
  import Preview from '../components/layout/Preview.vue'
  import Loading from '../components/layout/Loading.vue'

  const authStore = useAuthStore()
	const { isLogin } = storeToRefs(authStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const router = useRouter()

  watch( isLogin, nVal => {
    if (!nVal) {
      router.push({ name: 'login'})
    }
  })

  onMounted( () => {
    isLoading.value = false
  })
</script>

<template>
  <div class="adminView">
    <AccountBox></AccountBox>
    <Nav></Nav>
    <div class="adminContent">
      <RouterView></RouterView>
    </div>
  </div>
  <Loading></Loading>
  <Dialog></Dialog>
  <Preview></Preview>
</template>

<style scoped>
</style>
