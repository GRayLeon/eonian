<script setup>
  import { useNewsStore } from '@/stores/news'
	import { storeToRefs } from 'pinia'
  import { RouterLink } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()

  const newsStore = useNewsStore()
	const { page, news, getNews } = storeToRefs(newsStore)

  const dateFormate = isoDate => {
    const date = new Date(isoDate)
    return date.toISOString().split('T')[0].replace(/-/g, '.')
  }

  const changePageTo = async idx => {
    if (idx <= news.value.pagination.totalPages && idx >= 1) {
      page.value = idx
      await getNews.value(page.value)
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }

  const focusCategory = ref('all')

  const categorySwitch = category => {
    let categoryQuery = category == 'all'? null : category
    getNews.value(page.value, categoryQuery)
    focusCategory.value = category
  }

  const showLanText = input => {
    return input[locale.value]
  }



  onMounted( () => {
    getNews.value(page.value)
  })
</script>
<template>
  <div class="newsContent">
    <ul class="newsContent__categoryList">
      <li
        :class="{ active: focusCategory == 'all' }"
        @click="categorySwitch('all')">
        <span class="category">{{ $t('news.all') }}</span>
        <span class="amount">({{ (news.categoryAmount['Press_Coverage'] || 0) + (news.categoryAmount['Joural_Articles'] || 0)}})</span>
      </li>
      <li
        :class="{ active: focusCategory == 'Press_Coverage' }"
        @click="categorySwitch('Press_Coverage')">
        <span class="category">{{ $t('news.coverage') }}</span>
        <span class="amount">({{ news.categoryAmount['Press_Coverage'] || 0 }})</span>
      </li>
      <li
        :class="{ active: focusCategory == 'Joural_Articles' }"
        @click="categorySwitch('Joural_Articles')">
        <span class="category">{{ $t('news.article') }}</span>
        <span class="amount">({{ news.categoryAmount['Joural_Articles']|| 0 }})</span>
      </li>
    </ul>
    <ul class="newsContent__list" v-if="news.data.length > 0">
      <li v-for="news in news.data">
        <div class="info">
          <div class="title">
            <h2>{{ showLanText(news.topic) }}</h2>
            <span class="category">{{ news.category.split('_')[0] }} {{ news.category.split('_')[1] }}</span>
          </div>
          <span class="date">{{ dateFormate(news.createTime) }}</span>
        </div>
        <div class="image">
          <img :src="news.imageURL">
        </div>
        <div class="description">
          <p>{{ showLanText(news.description) }}</p>
          <RouterLink :to="`/news/${news._id}`" class="linkButton">{{ $t('button.more') }}...</RouterLink>
        </div>
      </li>
    </ul>
    <ul class="pagesList" v-if="news.data.length > 0">
        <li>
          <a 
          @click="changePageTo(page - 1)">﹤</a>
        </li>
        <li
          v-for="idx in news.pagination.totalPages"
          @click="changePageTo(idx)"
          :class="{ 'active': idx == page}">
          {{ idx }}
        </li>
        <li>
          <a @click="changePageTo(page + 1)">﹥</a>
        </li>
      </ul>
      <div v-else class="noContent">
        沒有相關結果
      </div>
  </div>
</template>