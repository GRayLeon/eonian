import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useLoadStore = defineStore('load', () => {

  const isLanLoading = ref(false)

  const isLoading = ref(false)

  const isLoadingOpen = ref(false)
  const isLoadingShow = ref(false)

  const openLoading = ref( () => {
    isLoadingOpen.value = true
    setTimeout(function() {
      isLoadingShow.value = true
    }, 10)
  })

  const closeLoading = ref( () => {
    isLoadingShow.value = false
    setTimeout(function() {
      isLoadingOpen.value = false
    }, 300)
  })

  const isInquiryOpen = ref(false)
  const isInquiryShow = ref(false)

  const openInquiry = ref( () => {
    isInquiryOpen.value = true
    setTimeout(function() {
      isInquiryShow.value = true
    }, 250)
  })

  const closeInquiry = ref( () => {
    isInquiryShow.value = false
    setTimeout(function() {
      isInquiryOpen.value = false
    }, 250)
  })

  const isInfoOpen = ref(false)
  const isInfoShow = ref(false)

  const infoPage = ref('')

  const openInfo = ref( target => {
    infoPage.value = target
    isInfoOpen.value = true
    setTimeout(function() {
      isInfoShow.value = true
    }, 250)
  })

  const closeInfo = ref( () => {
    isInfoShow.value = false
    setTimeout(function() {
      isInfoOpen.value = false
    }, 250)
  })

  const isMenuOpen = ref(false)

  const toggleMenu = ref( () => {
    isMenuOpen.value = !isMenuOpen.value
  })

  return { 
    isLanLoading,
    isLoading, isLoadingOpen, isLoadingShow,
    openLoading, closeLoading,
    isInquiryOpen, isInquiryShow,
    openInquiry, closeInquiry,
    isInfoOpen, isInfoShow, infoPage,
    openInfo, closeInfo,
    isMenuOpen, toggleMenu
  }
})
