<script setup>
  import { useRouter } from 'vue-router'
  import { useNewsStore } from '@/stores/news'
	import { storeToRefs } from 'pinia'
  import { watch } from 'vue'

  const newsStore = useNewsStore()
	const { statusList, category, status, sort, order, news, getNews, goToAddNews } = storeToRefs(newsStore)

  const router = useRouter()

  const statusWording = statusValue => {
    return statusList.value.find( status => status.value == statusValue).label
  }

  watch(status, nVal => {
    getNews.value(status.value, category.value, sort.value, order.value)
  })

  watch(category, nVal => {
    getNews.value(status.value, category.value, sort.value, order.value)
  })

  watch(sort, nVal => {
    getNews.value(status.value, category.value, sort.value, order.value)
  })
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">article</span>貼文管理</h1>
    <button @click="goToAddNews">新增貼文</button>
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
        <option value="parentCategory">分類</option>
        <option value="basePrice">價錢</option>
      </select>
    </div>
  </div>
  <ul v-if="news.data.length" class="cardList">
    <li class="head">
      <div class="name">標題</div>
      <div class="status">狀態</div>
      <div class="category">分類</div>
      <div class="description">描述</div>
    </li>
    <li v-for="news in news.data" @click="router.push(`news/${news._id}`)">
      <div class="name">{{ news.topic.zh }}</div>
      <div class="status">
        <span :class="news.status">{{ statusWording(news.status) }}</span>
      </div>
      <div class="category">{{  news.category }}</div>
      <div class="description">{{  news.description['zh'] }}</div>
    </li>
  </ul>
  <div v-else class="empty">
    沒有符合此條件的專案。
  </div>
</template>

<style scoped>
</style>
