<script setup>
  import { useAccountStore } from '@/stores/account'
  import { useProductStore } from '@/stores/product'
  import { useProjectStore } from '@/stores/project'
  import { useBrandStore } from '@/stores/brand'
  import { useNewsStore } from '@/stores/news'
  import { useLoadStore } from '@/stores/load'
  import { useDialogStore } from '@/stores/dialog'
	import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'

  const accountStore = useAccountStore()
	const { deleteAccount } = storeToRefs(accountStore)

  const productStore = useProductStore()
	const { deleteProduct, editProduct } = storeToRefs(productStore)

  const projectStore = useProjectStore()
	const { deleteProject, editProject } = storeToRefs(projectStore)

  const brandStore = useBrandStore()
	const { deleteBrand, editBrand } = storeToRefs(brandStore)

  const newsStore = useNewsStore()
	const { deleteNews, editNews } = storeToRefs(newsStore)

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
      } else if (dialogTarget.value == 'productList') {
        deleteProduct.value(dialogData.value)
      } else if (dialogTarget.value == 'projectList') {
        deleteProject.value(dialogData.value)
      } else if (dialogTarget.value == 'brandList') {
        deleteBrand.value(dialogData.value)
      } else if (dialogTarget.value == 'newsList') {
        deleteNews.value(dialogData.value)
      }
    } else if (dialogStatus.value == 'archive') {
      if (dialogTarget.value == 'productList') {
        editProduct.value(dialogData.value, 'archive')
      } else if (dialogTarget.value == 'projectList') {
        editProject.value(dialogData.value, 'archive')
      } else if (dialogTarget.value == 'brandList') {
        editBrand.value(dialogData.value, 'archive')
      } else if (dialogTarget.value == 'newsList') {
        editNews.value(dialogData.value, 'archive')
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
        <span class="material-icons">{{ dialogStatus == 'success' ? 'check' : (dialogStatus == 'delete' || dialogStatus == 'archive')? 'priority_high' : 'close' }}</span>
      </div>
      <div class="adminDialog__title">{{ dialogTitle }}</div>
      <div class="adminDialog__info">{{ dialogInfo }}</div>
      <div class="buttonArea">
        <button v-if="dialogStatus == 'delete' || dialogStatus == 'archive'" @click="resetDialog()">取消</button>
        <button v-if="dialogStatus !== 'delete' && dialogStatus !== 'archive'" @click="redirectTo()">確定</button>
        <button v-else @click="action()">確定{{ dialogStatus == 'delete'? '刪除' : '封存'}}</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
