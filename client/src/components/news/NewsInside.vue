<script setup>
  import { useNewsStore } from '@/stores/news'
	import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()

  const newsStore = useNewsStore()
	const { news } = storeToRefs(newsStore)

  const route = useRoute()
  
  const newsInfo = ref({
    topic: {
      en: '',
      zh: ''
    },
    category: '',
    source: '',
    imageURL: '',
    imagePublicId: '',
    description: {
      en: '',
      zh: ''
    },
    detail: {
      en: '',
      zh: ''
    },
    content: [{
      layout: {
        direction: 'single-vertical',
        position: 'image-left'
      },
      article: [{
        title: {
          en: '',
          zh: ''
        },
        text: {
          en: '',
          zh: ''
        },
        imageURL: '',
        imagePublicId: ''
      }]
    }],
    creatTime: ''
  })

  const dateFormate = isoDate => {
    const date = new Date(isoDate)
    return date.toISOString().split('T')[0].replace(/-/g, '.')
  }

  const showLanText = input => {
    return input[locale.value]
  }

  const initNewsInfo = () => {
    news.value.data.forEach( news => {
      if (news._id == route.params.id) {
        newsInfo.value = { ...news }
      }
    })
  }

  watch(
    () => news.value.data,
    (newData) => {
      if (newData.length > 0) {
        initNewsInfo()
      }
    },
    { immediate: true }
  )
</script>
<template>
  <div class="newsInsideContent">
    <div class="newsInsideContent__mainInfo">
      <div class="info">
        <div class="title">
          <div class="dtae">{{ newsInfo.createTime? dateFormate(newsInfo.createTime) : '' }}</div>
          <h2>{{ showLanText(newsInfo.topic) }}</h2>
          <div class="category">{{ newsInfo.category.split('_')[0] }} {{ newsInfo.category.split('_')[1] }}</div>
        </div>
        <div class="description">
          <p>{{ showLanText(newsInfo.detail) }}</p>
        </div>
      </div>
      <div class="image">
        <img :src="newsInfo.imageURL">
      </div>
    </div>
    <div class="newsInsideContent__detail">
      <div
        v-for="section in newsInfo.content"
        class="section">
        <div
          v-for="article in section.article"
          :class="section.layout.position"
          class="card">
          <img :src="article.imageURL">
          <div class="text" v-if="!article.title && !article.text">
            <h3>
              {{ showLanText(article.title) }}
            </h3>
            <p>{{ showLanText(article.text) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>