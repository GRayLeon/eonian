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

  const addSupport = () => {
    specDatas.value.support.list.push({
      en: '',
      zh: ''
    })
  }

  const removeSupport = idx => {
    specDatas.value.support.list.splice(idx, 1)
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
        v-for="(support, idx) in specDatas.support.list">
        <td class="name">
          <input
            type="text"
            placeholder="請輸入配套英文"
            v-model="support.en" />
        </td>
        <td class="name">
            <input
            type="text"
            placeholder="請輸入配套中文"
            v-model="support.zh" />
        </td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="removeSupport(idx)">刪除配套</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
  <div class="bottomButtonArea">
    <button @click="addSupport()">新增配套</button>
  </div>
</template>

<style scoped>
</style>
