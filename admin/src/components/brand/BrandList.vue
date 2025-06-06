<script setup>
  import { useRouter } from 'vue-router'
  import { useBrandStore } from '@/stores/brand'
	import { storeToRefs } from 'pinia'
  import { watch } from 'vue'

  const brandStore = useBrandStore()
	const { statusList, category, status, sort, order, brands, getBrands, goToAddBrand } = storeToRefs(brandStore)

  const router = useRouter()

  const statusWording = statusValue => {
    return statusList.value.find( status => status.value == statusValue).label
  }

  watch(status, nVal => {
    getBrands.value(status.value, category.value, sort.value, order.value)
  })

  watch(category, nVal => {
    getBrands.value(status.value, category.value, sort.value, order.value)
  })

  watch(sort, nVal => {
    getBrands.value(status.value, category.value, sort.value, order.value)
  })
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">category</span>品牌管理</h1>
    <button @click="goToAddBrand">新增品牌</button>
  </div>
  <div class="filterArea">
    <div class="inputItem">
      <div class="head">狀態</div>
      <select v-model="status">
        <option value="">全部狀態</option>
        <option
          :value="status.value"
          v-for="status in statusList">
          {{ status.label }}
        </option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">排序</div>
      <select v-model="sort">
        <option value="_id">上架時間</option>
        <option value="name">名稱</option>
      </select>
    </div>
  </div>
  <ul v-if="brands.data.length" class="cardList">
    <li class="head">
      <div class="img">圖片</div>
      <div class="name">名稱</div>
      <div class="status">狀態</div>
      <div class="description">描述</div>
    </li>
    <li v-for="brand in brands.data" @click="router.push(`brand/${brand._id}`)">
          <div class="img"><img :src="brand.imageURL"></div>
      <div class="name">{{ brand.name }}</div>
      <div class="status">
        <span :class="brand.status">{{ statusWording(brand.status) }}</span>
      </div>
      <div class="description">{{  brand.description['zh'] }}</div>
    </li>
  </ul>
  <div v-else class="empty">
    沒有符合此條件的品牌。
  </div>
</template>

<style scoped>
</style>
