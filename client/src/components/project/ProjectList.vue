<script setup>
  import { useProjectStore } from '@/stores/project'
  import { storeToRefs } from 'pinia'
  import { RouterLink } from 'vue-router'
  import { ref, computed, watch, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  const projectStore = useProjectStore()
  const {
    page, projects, getProjects
  } = storeToRefs(projectStore)

  const changePageTo = idx => {
    if (idx <= projects.value.pagination.totalPages && idx >= 1) {
      page.value = idx
      getProjects.value(page.value)
    }
  }

  const searchText = ref('')
  const searchResult = ref('')

  const searchProject = async () => {
    if (searchText.value) {
      await getProjects.value(null, searchText.value)
      searchResult.value = searchText.value
      searchText.value = ''
      page.value = 1
    }
  }

  const claerSearch = () => {
    searchResult.value = ''
    getProjects.value(page.value)
  }

  const imgArray = computed(() => {
    return projects.value.data.map((project, idx) => {
      const images = []
      for (const list of project.imageList || []) {
        for (const img of list.images || []) {
          if (images.length < 4) {
            images.push(img)
          } else {
            break
          }
        }
        if (images.length >= 4) break
      }
      return { index: idx, images }
    })
  })

  const focusedIndexes = ref([])

  const setFocus = (cardIndex, imgIndex) => {
    focusedIndexes.value[cardIndex] = imgIndex
  }

  const resetFocus = cardIndex => {
    focusedIndexes.value[cardIndex] = 0
  }

  const zhCategoryMap = {
    'Residence': '住宅',
    'Commercial Space': '商業空間'
  }

  const showCategoryText = (text) => {
    return locale.value === 'zh' ? zhCategoryMap[text] || text : text
  }

  const showLanText = input => {
    return input[locale.value]
  }

  watch(
    () => projects.value.data,
    (newProjects) => {
      focusedIndexes.value = newProjects.map(() => 0)
    },
    { immediate: true }
  )

  onMounted( () => {
    getProjects.value(page.value)
  })

</script>
<template>
  <div class="projectContent">
    <div class="searchOption">
      <div
        v-if="locale == 'en'"
        :class="{ show: searchResult }"
        class="searchResult">
        <span @click="claerSearch()">✕</span>
        Search result for "{{ searchResult }}":
      </div>
      <div
        v-else
        :class="{ show: searchResult }"
        class="searchResult">
        <span @click="claerSearch()">✕</span>
        以下為包含關鍵字『{{ searchResult }}』的結果：
      </div>
      <div class="searchArea">
        <input
          type="search"
          placeholder="Search"
          v-model="searchText"
          @keyup.enter="searchProject()">
        <img @click="searchProject()" class="searchIcon" src="@/assets/images/searchIcon.svg">
      </div>
    </div>
    <ul
      v-if="projects.data.length > 0"
      class="projectContent__list">
      <li
        v-for="(project, idx) in projects.data"
        class="projectCard">
        <RouterLink :to="`/project/${project._id}`">
          <div class="info">
            <div class="title">
              <h2>{{ project.title }}</h2>
              <span class="category">{{ showCategoryText(project.category) }}</span>
            </div>
            <div class="description">
              <p>{{ showLanText(project.description) }}</p>
            </div>
          </div>
          <div class="images">
            <img
              v-for="(img, imgIdx) in imgArray.find(imgs => imgs.index == idx).images"
              :class="{ focus: imgIdx === focusedIndexes[idx] }"
              :src="img.imageURL"
              @mouseenter="setFocus(idx, imgIdx)"
              @mouseleave="resetFocus(idx)">
          </div>
        </RouterLink>
      </li>
    </ul>
    <ul class="pagesList" v-if="projects.data.length > 0">
      <li>
        <a 
        @click="changePageTo(page - 1)">﹤</a>
      </li>
      <li
        v-for="idx in projects.pagination.totalPages"
        @click="changePageTo(idx)"
        :class="{ 'active': idx == page}">
        {{ idx }}
      </li>
      <li>
        <a @click="changePageTo(page + 1)">﹥</a>
      </li>
    </ul>
    <div v-else class="noContent">
      <b v-if="locale == 'en'">No results found.</b>
      <b v-else>沒有相關結果</b>
      <span @click="claerSearch()">{{ $t('button.clear') }}</span>
    </div>
  </div>
</template>