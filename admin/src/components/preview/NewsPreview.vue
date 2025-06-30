<script setup>
  import { usePreviewDialogStore } from '@/stores/previewDialog'
  import { storeToRefs } from 'pinia'
  import { ref, onMounted, computed } from 'vue'

  const previewDialogStore = usePreviewDialogStore()
	const { lan, switchLan, showLan, previewData } = storeToRefs(previewDialogStore)

  const dateFormate = isoDate => {
    const date = new Date(isoDate)
    return date.toISOString().split('T')[0].replace(/-/g, '.')
  }

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

  onMounted( () => {
    newsInfo.value = { ...previewData.value }
  })
</script>
<template>
  <div class="newsInsideContent">
    <div class="newsInsideContent__mainInfo">
      <div class="info">
        <div class="title">
          <div class="dtae">{{ newsInfo.createTime? dateFormate(newsInfo.createTime) : '' }}</div>
          <h2>{{ showLan(newsInfo.topic) }}</h2>
          <div class="category">{{ newsInfo.category.split('_')[0] }} {{ newsInfo.category.split('_')[1] }}</div>
        </div>
        <div class="description">
          <p>{{ showLan(newsInfo.detail) }}</p>
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
          <div class="text">
            <h3>
              {{ showLan(article.title) }}
            </h3>
            <p>{{ showLan(article.text) }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>