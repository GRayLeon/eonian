<script setup>
  import { useRegionStore } from '@/stores/region'
  import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'
  
  const regionStore = useRegionStore()
	const { regions, editRegion, goToAddRegion } = storeToRefs(regionStore)

  const router = useRouter()

  const activeRegion = id => {
    let region
    regions.value.forEach( regionData => {
      if (regionData._id == id) {
        regionData.status = !regionData.status
        region = { ...regionData }
      }
    })
    setTimeout(() => {
      editRegion.value(region, 'edit', null, 'noRedirect')
    }, 300)
  }

  const goToEditRegion = id => {
    router.push({ path: `/region/${id}`})
  }
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">location_on</span>地區管理</h1>
    <button @click="goToAddRegion">新增地區</button>
  </div>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="status">狀態</th>
        <th class="image">圖片</th>
        <th class="name">名稱(英文)</th>
        <th class="name">名稱(中文)</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr
        v-for="region in regions"
        :class="{ 'inactive': !region.status }">
        <td class="status">
          <div 
            class="switchButton"
            :class="{ 'active': region.status }"
            @click="activeRegion(region._id)">
            <div class="button"></div>
          </div>
        </td>
        <td class="image">
          <img v-if="region.imageURL" :src="region.imageURL" alt="">
          <span v-else>no images.</span>
        </td>
        <td class="name">{{ region.name['en'] }}</td>
        <td class="name">{{ region.name['zh'] }}</td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="goToEditRegion(region._id)">編輯地區</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
