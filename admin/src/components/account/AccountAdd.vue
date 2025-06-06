<script setup>
  import { useAccountStore } from '@/stores/account'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue'

  const accountStore = useAccountStore()
	const { addAccount } = storeToRefs(accountStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const router = useRouter()

  const backAccountList = ( () => {
    router.push({ name: 'accountList'})
  })

  const account = ref({
    account: '',
    type: 'administrator',
    description: '',
    password: ''
  })

  const repeatPassword = ref('')

  const isReady = computed( () => {
    let ready = true
    if (!account.value.account) { ready = false }
    // if (!account.value.type) { ready = false }
    if (!account.value.description) { ready = false }
    if (!account.value.password) { ready = false }
    if (repeatPassword.value !== account.value.password) { ready = false }
    return ready
  })

  onMounted(() => {
    isLoading.value = false
  })
</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backAccountList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>新增帳號</h1>
    </div>
  </div>
  <div class="editArea">
    <div class="inputItem">
      <div class="head">帳號</div>
      <input
        v-model="account.account"
        placeholder="請輸入帳號"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">備註</div>
      <input
        v-model="account.description"
        placeholder="請輸入備註"/>
    </div>
    <!-- <div class="inputItem">
      <div class="head">權限</div>
      <select v-model="account.type">
          <option value="">請選擇權限</option>
          <option value="administrator">administrator</option>
          <option value="editor">editor</option>
          <option value="sales">sales</option>
      </select>
    </div> -->
    <div class="inputItem">
      <div class="head">密碼</div>
      <input 
        v-model="account.password"
        placeholder="請輸入密碼"
        type="password"/>
    </div>
    <div class="inputItem">
      <div class="head">確認密碼</div>
      <input 
        v-model="repeatPassword"
        placeholder="請再次輸入密碼"
        type="password"/>
    </div>
    <div class="buttonArea">
      <button 
        :disabled="!isReady"
        @click="addAccount(account, 'accountList')">新增帳號</button>
    </div>
  </div>
</template>

<style scoped>
</style>
