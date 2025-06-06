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

  const addFunctionality = () => {
    specDatas.value.functionality.list.push({
      en: '',
      zh: ''
    })
  }

  const removeFunctionality = idx => {
    specDatas.value.functionality.list.splice(idx, 1)
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
        v-for="(functionality, idx) in specDatas.functionality.list">
        <td class="name">
          <input
            type="text"
            placeholder="請輸入功能英文"
            v-model="functionality.en" />
        </td>
        <td class="name">
            <input
            type="text"
            placeholder="請輸入功能中文"
            v-model="functionality.zh" />
        </td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="removeFunctionality(idx)">刪除功能</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="bottomButtonArea">
    <button @click="addFunctionality()">新增功能</button>
  </div>
</template>

<style scoped>
</style>
