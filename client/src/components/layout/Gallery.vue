<script setup>
  import { useGalleryStore } from '@/stores/gallery'
	import { storeToRefs } from 'pinia'

  const galleryStore = useGalleryStore()
	const { galleryIsOpen, galleryIsShow, galleryTitle, galleryData, closeGallery } = storeToRefs(galleryStore)

</script>

<template>
  <div
    class="dialog"
    :class="[
      { open: galleryIsOpen },
      { show: galleryIsShow }
    ]">
    <div class="dialog__box dialog__box--gallery">
      <div class="dialog__title">{{ galleryTitle }}</div>
      <img class="dialog__image" :src="galleryData" />
      <span @click="closeGallery()">關閉</span>
    </div>
  </div>
</template>

<style scoped>
</style>
