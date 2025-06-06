<script setup>
  import { useLoadStore } from '@/stores/load'
  import { storeToRefs } from 'pinia'

  import Header from '@/components/layout/Header.vue'
  import Footer from '@/components/layout/Footer.vue'
  import InquiryBox from '@/components/layout/InquiryBox.vue'
  import Loading from '@/components/layout/Loading.vue'
  import Dialog from '@/components/layout/Dialog.vue'
  import { RouterView } from 'vue-router'
  import { watch } from 'vue'

  const loadStore = useLoadStore()
	const { isLoading, openLoading, closeLoading } = storeToRefs(loadStore)
  

  let debounceTimer = null

  watch(() => isLoading.value, (nVal) => {
    if (debounceTimer) clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      if (nVal) {
        openLoading.value()
      } else {
        closeLoading.value()
      }
    }, 300)
})

</script>

<template>
  <div
    class="appContent">
    <Header />
    <div class="content">
      <transition name="fade" mode="out-in">
        <RouterView />
      </transition>
    </div>
    <Footer />
    <InquiryBox />
    <Loading />
    <Dialog />
  </div>
</template>

<style scoped>
  .fade-enter-active, .fade-leave-active {
    transition: opacity 1s ease;
  }
  .fade-enter-from, .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-to, .fade-leave-from {
    opacity: 1;
  }
</style>
