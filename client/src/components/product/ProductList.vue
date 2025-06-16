<script setup>
  import { useProductStore } from '@/stores/product'
  import { useSpecStore } from '@/stores/spec'
	import { storeToRefs } from 'pinia'
  import { RouterLink } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  const productStore = useProductStore()
	const { 
    page, products, getProducts
  } = storeToRefs(productStore)

  const specStore = useSpecStore()
	const {
    getSpecDatas, specDatas
  } = storeToRefs(specStore)

  const isOpen = ref('origin')
  const isActive = ref(null)
  const openFilter = isOpenName => {
    if (isOpen.value !== isOpenName) {
      isOpen.value = isOpenName
    } else {
      isOpen.value = null
    }
    
  }
  const activeFilter = (filter, isActiveName) => {
    getProducts.value(page.value, filter, isActiveName)
    isActive.value = isActiveName
  }

  const changePageTo = idx => {
    if (idx <= products.value.pagination.totalPages && idx >= 1) {
      page.value = idx
      getProducts.value(page.value)
    }
  }

  const showLanText = input => {
    return input[locale.value]
  }

  onMounted( () => {
    getProducts.value(page.value)
    getSpecDatas.value()
  })
</script>
<template>
  <div class="productContent">
    <div class="productContent__nav">
      <div class="contentTitle">{{ $t('title.product')}}</div>
      <ul class="productContent__filter">
        <li
          :class="{ active: isOpen == specDatas.origin.name.en }">
          <div
            class="head"
            @click="openFilter(specDatas.origin.name.en)">
            <span>{{ showLanText(specDatas.origin.name) }}</span>
            <div class="switchButton"></div>
          </div>
          <ul>
            <li
              v-for="origin in specDatas.origin.list"
              :class="{ active: isActive == origin.en }"
              @click="activeFilter('origin', origin.en)">{{ showLanText(origin) }}</li>
          </ul>
        </li>
        <li
          :class="{ active: isOpen == specDatas.appearance.name.en }">
          <div
            class="head"
            @click="openFilter(specDatas.appearance.name.en)">
            <span>{{ showLanText(specDatas.appearance.name) }}</span>
            <div class="switchButton"></div>
          </div>
          <ul>
            <li
              v-for="appearance in specDatas.appearance.list"
              :class="{ active: isActive == appearance.en }"
              @click="activeFilter('appearance', appearance.en)">{{ showLanText(appearance) }}</li>
          </ul>
        </li>
        <li
          :class="{ active: isOpen == specDatas.functionality.name.en }">
          <div
            class="head"
            @click="openFilter(specDatas.functionality.name.en)">
            <span>{{ showLanText(specDatas.functionality.name) }}</span>
            <div class="switchButton"></div>
          </div>
          <ul>
            <li
              v-for="functionality in specDatas.functionality.list"
              :class="{ active: isActive == functionality.en }"
              @click="activeFilter('functionality', functionality.en)">{{ showLanText(functionality) }}</li>
          </ul>
        </li>
        <li
          :class="{ active: isOpen == specDatas.support.name.en }">
          <div
            class="head"
            @click="openFilter(specDatas.support.name.en)">
            <span>{{ showLanText(specDatas.support.name) }}</span>
            <div class="switchButton"></div>
          </div>
          <ul>
            <li
              v-for="support in specDatas.support.list"
              :class="{ active: isActive == support.en }"
              @click="activeFilter('support', support.en)">{{ showLanText(support) }}</li>
          </ul>
        </li>
        <li
          :class="{ active: isOpen == specDatas.brands.name.en }">
          <div
            class="head"
            @click="openFilter(specDatas.brands.name.en)">
            <span>{{ showLanText(specDatas.brands.name) }}</span>
            <div class="switchButton"></div>
          </div>
          <ul>
            <li
              v-for="brand in specDatas.brands.list"
              :class="{ active: isActive == brand.name }"
              @click="activeFilter('brand', brand.name)">{{ brand.name }}</li>
          </ul>
        </li>
      </ul>
      <div class="switchButton"></div>
    </div>
    <div class="productContent__list">
      <ul class="cards" v-if="products.data.length > 0">
          <li :key="product._id" v-for="product in products.data">
            <RouterLink :to="`/product/${product._id}`">
              <img :src="product.imageURL">
              <div class="name">{{ showLanText(product.name) }}</div>
            </RouterLink>
          </li>
      </ul>
      <ul class="pagesList" v-if="products.data.length > 0">
        <li>
          <a 
          @click="changePageTo(page - 1)">﹤</a>
        </li>
        <li
          v-for="idx in products.pagination.totalPages"
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
  </div>
</template>