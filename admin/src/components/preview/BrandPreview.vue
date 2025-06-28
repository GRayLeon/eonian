<script setup>
  import { usePreviewDialogStore } from '@/stores/previewDialog'
  import { storeToRefs } from 'pinia'
  import { ref, onMounted, computed } from 'vue'

  const previewDialogStore = usePreviewDialogStore()
	const { previewData } = storeToRefs(previewDialogStore)

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
            <div class="title">{{ article.title.en }}</div>
            <p>{{ article.text.en }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="brandInsideContent__description">
      <div class="stickyCard">
        <p>{{ brandInfo.description.en }}</p>
      </div>
    </div>
  </div>
</template>