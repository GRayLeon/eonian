<script setup>
  import { useLoadStore } from '@/stores/load'
  import { useDialogStore } from '@/stores/dialog'
	import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const dialogStore = useDialogStore()
	const { dialogIsOpen, dialogIsShow, dialogStatus, dialogTitle, dialogInfo, dialogTarget } = storeToRefs(dialogStore)

  const router = useRouter()

  const resetDialog = () => {
    dialogIsShow.value = false
    setTimeout(function() {
      dialogIsOpen.value = false
    }, 250)
    dialogTitle.value = null
    dialogStatus.value = null
    dialogInfo.value = null
    dialogTarget.value = null
  }

  const redirectTo = () => {
    if (dialogTarget.value == 'reload') {
      window.location.reload()
    } else if (dialogTarget.value == 'noRedirect') {
      isLoading.value = false
    } else {
      router.push({ name: dialogTarget.value })
      isLoading.value = false
    }
    resetDialog()
  }

</script>

<template>
  <div
    class="dialog"
    :class="[
      { open: dialogIsOpen },
      { show: dialogIsShow }
    ]">
    <div class="dialog__box">
      <div class="dialog__icon" :class="dialogStatus">
        <span class="material-icons">{{ dialogStatus == 'success' ? 'check' : 'close' }}</span>
      </div>
      <div class="dialog__title">{{ dialogTitle }}</div>
      <div class="dialog__info">{{ dialogInfo }}</div>
      <button @click="redirectTo()">確定</button>
    </div>
  </div>
</template>

<style scoped>
</style>
