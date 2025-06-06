<script setup>
  import { useBrandStore } from '@/stores/brand'
	import { storeToRefs } from 'pinia'
  import { RouterLink } from 'vue-router'
  import { onMounted } from 'vue'

  const brandStore = useBrandStore()
	const { brands, getBrands } = storeToRefs(brandStore)

  onMounted( () => {
    getBrands.value()
  })
</script>
<template>
  <div class="brandContent">
    <ul class="brandContent__list">
      <li v-for="brand in brands.data">
        <RouterLink :to="`/brand/${brand._id}`">
          <img :src="brand.imageURL">
        </RouterLink>
      </li>
    </ul>
  </div>
</template>