<script setup>
  import { useAccountStore } from '@/stores/account'
  import { useDialogStore } from '@/stores/dialog'
  import { storeToRefs } from 'pinia'
  import { useRouter } from 'vue-router'
  import { onMounted } from 'vue'

  const accountStore = useAccountStore()
	const { accounts, getAccounts, goToAddAccount } = storeToRefs(accountStore)

  const dialogStore = useDialogStore()
	const { openDialog } = storeToRefs(dialogStore)


  const router = useRouter()

  const showDate = inputDate => {
    if (inputDate) {
      const date = new Date(inputDate)
      return date.toLocaleString()
    } else {
      return '尚未登入'
    }
  }

  const goToEditAccount = (id, type) => {
    router.push({ path: `/account/${type}/${id}`})
  }

  onMounted( () => {
    getAccounts.value()
  })
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">group</span> 帳號管理</h1>
    <button @click="goToAddAccount()">新增帳號</button>
  </div>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="name">帳號</th>
        <th class="type">備註</th>
        <th class="type">狀態</th>
        <th class="lastLogin">最後登入時間</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr v-for="account in accounts">
        <td class="name">{{ account.account }}</td>
        <td class="type">{{ account.description ?? '--' }}</td>
        <td class="name">{{ account.status == 0? '停用' : '啟用'  }}</td>
        <td class="lastLogin">{{ showDate(account.lastLogin) }}</td>
        <td>
          <div class="buttonArea buttonArea--flex-start">
            <button @click="openDialog('delete', '確定刪除', '刪除後將無法復原，是否要將此帳號刪除？', 'accountList', account._id)">刪除帳號</button>
            <button @click="goToEditAccount(account._id, 'edit')">編輯帳號</button>
            <button @click="goToEditAccount(account._id, 'change-password')">修改密碼</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
