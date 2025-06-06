<script setup>
  import { usePagesStore } from '@/stores/pages'
  import { useLoadStore } from '@/stores/load'
  import { storeToRefs } from 'pinia'
  import { RouterLink, onBeforeRouteLeave, useRouter } from 'vue-router'
  import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  const pagesStore = usePagesStore()
  const { pagesInfo, getPages } = storeToRefs(pagesStore)

  const loadStore = useLoadStore()
	const { isMenuOpen, toggleMenu, isLoading } = storeToRefs(loadStore)

  const isTransitionActive = ref(false)
  const triggered = ref(false)
  const scrollThreshold = 50
  const router = useRouter()

  let touchStartY = 0

  function transitionAnimate() {
    triggered.value = true
    isTransitionActive.value = true
  }

  function triggerTransition() {
    transitionAnimate()

    setTimeout(() => {
      router.push('/product') // Vue Router 導頁
    }, 300)
  }

  function onWheel(event) {
    if (!triggered.value && event.deltaY > scrollThreshold) {
      triggerTransition()
    }
  }

  function onTouchStart(event) {
    touchStartY = event.touches[0].clientY
  }

  function onTouchMove(event) {
    const touchEndY = event.touches[0].clientY
    const deltaY = touchStartY - touchEndY

    if (!triggered.value && deltaY > scrollThreshold) {
      triggerTransition()
    }
  }

  const showLanText = input => {
    return input[locale.value]
  }

  const setLanguage = lang => {
    isLoading.value = true

    setTimeout(function() {
      locale.value = lang
      isLoading.value = false
    }, 600)
  }

  const imageArray =ref([])
  const current = ref(0)

  let timer = null


  onUnmounted(() => {
    clearInterval(timer)
  })

  onMounted( async () => {
    await getPages.value()
    pagesInfo.value.index.images.forEach( image => {
      imageArray.value.push(image.imageURL)
    })

    window.addEventListener('wheel', onWheel)
    window.addEventListener('touchstart', onTouchStart)
    window.addEventListener('touchmove', onTouchMove)

    timer = setInterval(() => {
      current.value = (current.value + 1) % imageArray.value.length
    }, 5000)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('wheel', onWheel)
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
  })

  onBeforeRouteLeave((to, from, next) => {
    transitionAnimate()
    setTimeout(() => {
      next()
    }, 300)
  })
</script>

<template>
  <div
    class="indexPage"
    :class="{ blur: isLoading }">
    <div class="indexPage__images">
      <transition name="fade" mode="in-out">
         <img :src="imageArray[current]" :key="imageArray[current]" class="fade-img">
      </transition>
    </div>
    <div class="indexPage__content">
      <div class="indexPage__header">
        <ul class="indexPage__mainNav">
          <li><RouterLink to="/product">{{ $t('title.product') }}</RouterLink></li>
          <li><RouterLink to="/project">{{ $t('title.project') }}</RouterLink></li>
          <li><RouterLink to="/brand">{{ $t('title.brand') }}</RouterLink></li>
          <li><img src="@/assets/images/indexPage__logoIcon.svg"></li>
          <li><RouterLink to="/news">{{ $t('title.news') }}</RouterLink></li>
          <li class="active"><RouterLink to="/about">{{ $t('title.about') }}</RouterLink></li>
          <li><RouterLink to="/contact">{{ $t('title.contact') }}</RouterLink></li>
        </ul>
        <ul class="indexPage__lanSwitch">
          <li
            @click="setLanguage('en')"
            :class="{ active: locale == 'en'}">EN</li>
          <li
            @click="setLanguage('zh')"
            :class="{ active: locale == 'zh'}">中文</li>
        </ul>
      </div>
      <div class="indexPage__title">
        <div class="slogan">Crafting beauty,</div>
        <img src="@/assets/images/indexPage__logo.svg">
        <div class="slogan">defining harmony.</div>
      </div>
      <div class="indexPage__footer">
        <p>{{ showLanText(pagesInfo.index.description) }}</p>
        <img src="@/assets/images/arrowDown.svg">
      </div>
    </div>
  </div>
  <div
    class="fullscreen-transition"
    :class="{ active: isTransitionActive }"></div>
</template>
<style scoped>
  .fade-img {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
    top: 0;
    left: 0;
  }

  /* transition fade-in-out 效果 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 2s ease;
  }
  .fade-enter-from {
    opacity: 0;
  }
  .fade-enter-to {
    opacity: 1;
  }
  .fade-leave-from {
    opacity: 1;
  }
  .fade-leave-to {
    opacity: 0;
  }
</style>
