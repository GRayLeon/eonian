<script setup>
  import { useSpecStore } from '@/stores/spec'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
  import { onMounted, onUpdated } from 'vue'

  const specStore = useSpecStore()
	const { specDatas } = storeToRefs(specStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  // origin

  const addOrigin = () => {
    specDatas.value.origin.list.push({
      en: '',
      zh: ''
    })
  }

  const removeOrigin = idx => {
    specDatas.value.origin.list.splice(idx, 1)
  }

  onMounted(() => {
    isLoading.value = true
  })

  onUpdated( () => {
    isLoading.value = false
  })
</script>

<template>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="name">名稱(英文)</th>
        <th class="name">名稱(中文)</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr
        v-for="(origin, idx) in specDatas.origin.list">
        <td class="name">
          <input
            type="text"
            placeholder="請輸入地區英文"
            v-model="origin.en" />
        </td>
        <td class="name">
            <input
            type="text"
            placeholder="請輸入地區中文"
            v-model="origin.zh" />
        </td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="removeOrigin(idx)">刪除地區</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="bottomButtonArea">
    <button @click="addOrigin()">新增地區</button>
  </div>
</template>

<style scoped>
</style>
