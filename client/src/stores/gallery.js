import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGalleryStore = defineStore('gallery', () => {

  const galleryIsOpen = ref(false)
  const galleryIsShow = ref(false)
  const galleryTitle = ref(null)
  const galleryData = ref(null)

  const openGallery = ref( (title, data) => {
    galleryTitle.value = title
    galleryData.value = data
    galleryIsOpen.value = true
    setTimeout(function() {
      galleryIsShow.value = true
    }, 250)
  })

  const closeGallery = ref( () => {
    galleryTitle.value = null
    galleryData.value = null
    galleryIsShow.value = false
    setTimeout(function() {
      galleryIsOpen.value = false
    }, 250)
  })


  return { galleryIsOpen, galleryIsShow, galleryTitle, galleryData, openGallery, closeGallery }
})
