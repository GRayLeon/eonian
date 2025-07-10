<script setup>
  import { useBrandStore } from '@/stores/brand'
	import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { locale } = useI18n()

  const brandStore = useBrandStore()
	const { brands } = storeToRefs(brandStore)

  const route = useRoute()
  
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

  const showLanText = input => {
    return input[locale.value]
  }

  const initBrandInfo = () => {
    brands.value.data.forEach( brand => {
      if (brand._id == route.params.id) {
        brandInfo.value = { ...brand }
      }
    })
  }

  watch(
    () => brands.value.data,
    (newData) => {
      if (newData.length > 0) {
        initBrandInfo()
      }
    },
    { immediate: true }
  )
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
            v-if="article.title.en !== '' || article.title.zh !== '' || article.text.en !== '' ||  article.text.zh !== ''"
            class="article">
            <div class="title">{{ showLanText(article.title) }}</div>
            <p>{{ showLanText(article.text) }}</p>
          </div>
        </div>
      </div>
    </div>
    <div class="brandInsideContent__description">
      <div class="stickyCard">
        <p>{{ showLanText(brandInfo.description) }}</p>
      </div>
    </div>
  </div>
</template>