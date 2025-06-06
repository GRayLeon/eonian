<script setup>
  import { useSizeStore } from '@/stores/size'
  import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'
  
  const sizeStore = useSizeStore()
	const { sizeDatas, editSize, goToAddSize } = storeToRefs(sizeStore)

  const router = useRouter()

  const activeSize = id => {
    let size
    sizeDatas.value.forEach(sizeData => {
      if (sizeData._id == id) {
        sizeData.active = !sizeData.active
        size = { ...sizeData }
      }
    })
    setTimeout(() => {
      editSize.value(size, 'edit', 'noRedirect')
    }, 300)
  }

  const goToEditSize = id => {
    router.push({ path: `/size/${id}`})
  }
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">crop_free</span>規格管理</h1>
    <button @click="goToAddSize">新增規格</button>
  </div>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="status">狀態</th>
        <th class="format">規格</th>
        <th class="scale">價格倍率</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr
        v-for="sizeData in sizeDatas"
        :class="{ 'inactive': !sizeData.active }">
        <td class="status">
          <div 
            class="switchButton"
            :class="{ 'active': sizeData.active }"
            @click="activeSize(sizeData._id)">
            <div class="button"></div>
          </div>
        </td>
        <td class="format">{{ sizeData.size }}</td>
        <td class="scale">{{ sizeData.scale }}</td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="goToEditSize(sizeData._id)">編輯規格</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
