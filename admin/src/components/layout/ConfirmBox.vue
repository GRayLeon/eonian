<script setup>
  import { useAccountStore } from '@/stores/account'
  import { useLoadStore } from '@/stores/load'
  import { useDialogStore } from '@/stores/dialog'
	import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'

  const accountStore = useAccountStore()
	const { deleteAccount } = storeToRefs(accountStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { dialogIsOpen, dialogStatus, dialogTitle, dialogInfo, dialogTarget, dialogData } = storeToRefs(dialogStore)

  const router = useRouter()

  const resetDialog = () => {
    dialogIsOpen.value = false
    dialogTitle.value = null
    dialogStatus.value = null
    dialogInfo.value = null
    dialogTarget.value = null
  }

  const action = () => {
    if (dialogStatus.value == 'delete') {
      if (dialogTarget.value == 'accountList') {
        deleteAccount.value(dialogData.value)
      }
    }
  }

  const redirectTo = () => {
    if (dialogTarget.value == 'reload') {
      window.location.reload()
    } else if (dialogTarget.value == 'noRedirect') {
      isLoading.value = false
    } else {
      router.push({ name: dialogTarget.value })
    }
    resetDialog()
  }

</script>

<template>
  <div class="adminDialog" v-if="dialogIsOpen">
    <div class="adminDialog__box">
      <div class="adminDialog__icon" :class="dialogStatus">
        <span class="material-icons">{{ dialogStatus == 'success' ? 'check' : 'close' }}</span>
      </div>
      <div class="adminDialog__title">{{ dialogTitle }}</div>
      <div class="adminDialog__info">{{ dialogInfo }}</div>
      <button v-if="dialogStatus !== 'delete'" @click="redirectTo()">確定</button>
      <button v-else @click="action()">確定刪除</button>
    </div>
  </div>
</template>

<style scoped>
</style>
