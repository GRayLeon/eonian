<script setup>
  import { useLoadStore } from '@/stores/load'
  import { useAuthStore } from '@/stores/auth'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted } from 'vue'

  import Dialog from '@/components/layout/Dialog.vue'
  import Loading from '@/components/layout/Loading.vue'

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const authStore = useAuthStore()
	const { isLogin, login } = storeToRefs(authStore)

  const loginAccount = ref({
    account: null,
    password: null
  })

  onMounted( () => {
    isLoading.value = false
  })

</script>

<template>
  <div class="adminView">
    <div class="loginArea">
      <div class="loginBox" v-if="!isLogin">
        <div class="titleArea">
          <h1>Eonian</h1>
          <h2>Manage System</h2>
        </div>
        <input
          type="text"
          v-model="loginAccount.account"
          placeholder="請輸入帳號">
        <input
          type="password"
          v-model="loginAccount.password"
          placeholder="請輸入密碼"
          @keydown.enter="login(loginAccount)">
        <button
          @click="login(loginAccount)">登入</button>
      </div>
    </div>
  </div>
  <Loading></Loading>
  <Dialog></Dialog>
</template>

<style scoped>
</style>
