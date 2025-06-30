<script setup>
  import { usePreviewDialogStore } from '@/stores/previewDialog'
  import { storeToRefs } from 'pinia'
  import { ref, onMounted, computed } from 'vue'

  const previewDialogStore = usePreviewDialogStore()
	const { lan, switchLan, showLan, previewData } = storeToRefs(previewDialogStore)

  const brandInfo = ref({
    name: '',
    imageURL: '',
    imagePublicId: '',
    description: {
      en: '',
      zh: ''
    },
    content: [{
      layout: {
        direction: 'single-vertical',
        position: 'image-top'
      },
      article: [{
        text: {
          en: '',
          zh: ''
        },
        imageURL: '',
        imagePublicId: ''
      }]
    }]
  })

  onMounted( () => {
    brandInfo.value = { ...previewData.value }
  })
</script>
<template>
  <div class="brandInsideContent">
    <div class="brandInsideContent__info">
      <h2>{{ brandInfo.name }}</h2>
    </div>
    <div class="brandInsideContent__detail">
      <div class="section">
        <img :src="brandInfo.imageURL">
      </div>
      <div
        v-for="section in brandInfo.content"
        class="section">
        <div
          v-for="article in section.article"
          class="articleLayout"
          :class="section.layout.position">
          <img
            v-if="article.imageURL"
            :src="article.imageURL">
          <div
            v-if="article.text.en"
            class="article">
            <div class="title">{{ showLan(article.title) }}</div>
            <p>{{ showLan(article.text) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="brandInsideContent__description">
      <div class="stickyCard">
        <p>{{ showLan(brandInfo.description) }}</p>
      </div>
    </div>
  </div>
</template>