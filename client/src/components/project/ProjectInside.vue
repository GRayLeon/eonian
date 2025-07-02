<script setup>
  import { useProjectStore } from '@/stores/project'
	import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()

  const projectStore = useProjectStore()
	const { projects } = storeToRefs(projectStore)

  const route = useRoute()

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

  const showLanText = input => {
    return input[locale.value]
  }

  const initProjectInfo = () => {
    projects.value.data.forEach(project => {
      if (project._id == route.params.id) {
        projectInfo.value = { ...project }
      }
    })
  }

  watch(
    () => projects.value.data,
    (newData) => {
      if (newData.length > 0) {
        initProjectInfo()
      }
    },
    { immediate: true }
  )
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
            <p>{{ showLanText(projectInfo.detail) }}</p>
          </div>
          <ul class="tagList">
            <li v-for="tag in projectInfo.tags">{{ tag }}</li>
          </ul>
        </div>
      </div>
      <div class="projectInsideContent__images">
        <div
          v-for="list in projectInfo.imageList"
          class="section"
          :class="list.class">
          <img
            v-for="image in list.images"
            :src="`${image.imageURL}`">
        </div>
      </div>
  </div>
</template>