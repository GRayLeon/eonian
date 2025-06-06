<script setup>
  import { useAccountStore } from '@/stores/account'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue'

  const accountStore = useAccountStore()
	const { editAccount, accounts, getAccounts } = storeToRefs(accountStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const backAccountList = ( () => {
    router.push({ name: 'accountList'})
  })

  const account = ref({})

  const initAccount = () => {
    accounts.value.forEach(accountData => {
      if (accountData._id == route.params.id) {
          account.value = { ...accountData }
      }
      isLoading.value = false
    })
  }

  const editType = computed( () => {
    return route.params.type
  })

  const repeatPassword = ref('')

  const isReady = computed( () => {
    let ready = true
    if (!account.value.account) { ready = false }
    if (editType.value == 'pwd') {
      if (!account.value.password) { ready = false }
      if (repeatPassword.value !== account.value.password) { ready = false }
    }
    return ready
  })

  onMounted( async () => {
    isLoading.value = false
    await getAccounts.value()
    initAccount()
  })
</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backAccountList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ editType == 'edit'? '編輯帳號' : '修改密碼' }}</h1>
    </div>
  </div>
  <div class="editArea">
    <div class="editArea" v-if="editType == 'change-password'">
      <div class="inputItem">
        <div class="head">帳號</div>
        <span>{{ account.account }}</span>
      </div>
      <div class="inputItem">
        <div class="head">狀態</div>
        <span>{{ account.status == 0? '停用' : '啟用'  }}</span>
      </div>
    </div>
    <div class="editArea" v-if="editType == 'edit'">
      <div class="inputItem">
        <div class="head">帳號</div>
        <input
          :value="account.account"
          placeholder="請輸入帳號"
          readonly
          type="text"/>
      </div>
      <div class="inputItem">
        <div class="head">狀態</div>
        <select v-model="account.status">
            <option value="1">啟用</option>
            <option value="0">停用</option>
        </select>
      </div>
      <div class="inputItem">
        <div class="head">備註</div>
        <input
          v-model="account.description"
          placeholder="請輸入備註"/>
      </div>
    </div>
    <div class="editArea" v-else>
      <div class="inputItem">
        <div class="head">重設密碼</div>
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
    </div>
    <div class="buttonArea">
      <button 
        :disabled="!isReady"
        @click="editAccount(account, 'accountList')">{{ editType == 'edit'? '編輯帳號' : '修改密碼' }}</button>
    </div>
  </div>
</template>

<style scoped>
</style>
