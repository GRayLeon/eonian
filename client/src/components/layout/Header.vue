<script setup>
  import { useLoadStore } from '@/stores/load'
  import { storeToRefs } from 'pinia'
  import { RouterLink } from 'vue-router'
  import { useI18n } from 'vue-i18n'
  import {ref } from 'vue'

  const { t, locale } = useI18n()

  const loadStore = useLoadStore()
	const { isMenuOpen, toggleMenu, isLoading, isLanLoading } = storeToRefs(loadStore)

  const setLanguage = lang => {
    isLoading.value = true
    isLanLoading.value = true

    setTimeout(function() {
      locale.value = lang
      isLoading.value = false
      isLanLoading.value = false
    }, 600)
  }

</script>
<template>
  <div
    class="header"
      :class="{ open: isMenuOpen }">
      <RouterLink to="/"><img class="logo" src="@/assets/images/logo.svg"></RouterLink>
      <ul class="mainNav">
        <li><RouterLink :to="{ name: 'productList' }">{{ $t('title.product') }}</RouterLink> </li>
        <li><RouterLink to="/project">{{ $t('title.project') }}</RouterLink> </li>
        <li><RouterLink to="/brand">{{ $t('title.brand') }}</RouterLink> </li>
        <li><RouterLink to="/news">{{ $t('title.news') }}</RouterLink> </li>
        <li><RouterLink to="/about">{{ $t('title.about') }}</RouterLink> </li>
        <li><RouterLink to="/contact">{{ $t('title.contact') }}</RouterLink> </li>
      </ul>
      <ul class="lanSwitch">
        <li
          @click="setLanguage('en')"
          :class="{ active: locale == 'en'}">EN</li>
        <li
          @click="setLanguage('zh')"
          :class="{ active: locale == 'zh'}">中文</li>
      </ul>
      <div
        @click="toggleMenu()"
        class="switchButton"></div>
  </div>
</template>