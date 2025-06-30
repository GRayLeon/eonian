<script setup>
  import { usePreviewDialogStore } from '@/stores/previewDialog'
  import { storeToRefs } from 'pinia'
  import { ref, onMounted, computed } from 'vue'

  const previewDialogStore = usePreviewDialogStore()
	const { lan, switchLan, showLan, previewData } = storeToRefs(previewDialogStore)

  const projectInfo = ref({
    title: '',
    category: '',
    artist: '',
    description: {
      en: '',
      zh: ''
    },
    detail: {
      en: '',
      zh: ''
    },
    imageList: [{
      class: '',
      images: [{
        imageURL: '',
        imagePublicId: ''
      }]
    }],
    tags: []
  })

  onMounted( () => {
    projectInfo.value = { ...previewData.value }
  })
</script>
<template>
  <div class="projectInsideContent">
    <div class="projectInsideContent__info">
      <div class="stickyCard">
        <div class="title">
          <h2>{{ projectInfo.title }}</h2>
          <span class="category">{{ projectInfo.category }}</span>
          <div class="subtitle">{{ projectInfo.artist }}</div>
        </div>
        <div class="description">
          <p>{{ showLan(projectInfo.detail) }}</p>
        </div>
        <ul class="tagList">
          <li v-for="tag in projectInfo.tags">{{ tag }}</li>
        </ul>
      </div>
    </div>
    <div class="projectInsideContent__images">
      <div
        v-for="list in projectInfo.imageList"
        class="section">
        <img
          v-for="image in list.images"
          :src="`${image.imageURL}`">
      </div>
    </div>
  </div>
</template>