<script setup>
  import { usePagesStore } from '@/stores/pages'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted, onUpdated } from 'vue';

  const pagesStore = usePagesStore()
	const { pages } = storeToRefs(pagesStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  onMounted( async () => {
    isLoading.value = true
  })

  onUpdated( () => {
    isLoading.value = false
  })

</script>

<template>
  <div class="editArea">
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <textarea
        v-model="pages.contact.description.en"
        placeholder="請輸入英文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <textarea
        v-model="pages.contact.description.zh"
        placeholder="請輸入中文敘述"
        type="text"></textarea>
    </div>
    <div class="inputItem">
      <div class="head">地址(英)</div>
      <input
        v-model="pages.contact.address.en"
        placeholder="請輸入英文地址"
        type="text" />
    </div>
    <div class="inputItem">
      <div class="head">地址(中)</div>
      <input
        v-model="pages.contact.address.zh"
        placeholder="請輸入中文地址"
        type="text" />
    </div>
  </div>
</template>

<style scoped>
</style>
