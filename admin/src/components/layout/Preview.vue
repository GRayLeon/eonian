<script setup>
  import { usePreviewDialogStore } from '@/stores/previewDialog'
	import { storeToRefs } from 'pinia'

  import ProductPreview from '../preview/ProductPreview.vue'
  import ProjectPreview from '../preview/ProjectPreview.vue'
  import NewsPreview from '../preview/NewsPreview.vue'
  import BrandPreview from '../preview/BrandPreview.vue'

  const previewDialogStore = usePreviewDialogStore()
	const { previewDialogIsOpen, previewType, closePreviewDialog } = storeToRefs(previewDialogStore)

</script>

<template>
  <div class="previewDialog" v-if="previewDialogIsOpen">
    <div class="previewDialog__box">
      <div class="previewDialog__content">
        <ProductPreview v-if="previewType == 'product'"></ProductPreview>
        <ProjectPreview v-if="previewType == 'project'"></ProjectPreview>
        <NewsPreview v-if="previewType == 'news'"></NewsPreview>
        <BrandPreview v-if="previewType == 'brand'"></BrandPreview>
      </div>
      <div
        class="button close"
        @click="closePreviewDialog()">關閉預覽</div>
    </div>
  </div>
</template>

<style scoped>
</style>
