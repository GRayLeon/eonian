<script setup>
  import { useCategoryStore } from '@/stores/category'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue'

  const categoryStore = useCategoryStore()
	const { categorys, editCategory } = storeToRefs(categoryStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const backCategoryList = () => {
    router.push({ name: 'categoryList'})
  }

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const category = ref({
    name: {
      en: '',
      zh: ''
    },
    description: {
      en: '',
      zh: ''
    },
    active: false
  })

  const initCategory = () => {
    if (isEdit.value) {
      categorys.value.forEach(categoryData => {
        if (categoryData._id == route.params.id) {
          category.value = { ...categoryData }
        }
        isLoading.value = false
      })
    }
  }

  onMounted(() => {
    isLoading.value = true
    initCategory()
  })
</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backCategoryList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ isEdit ? '編輯' : '新增' }}分類</h1>
    </div>
  </div>
  <div class="editArea">
    <div class="inputItem">
      <div class="head">名稱(英)</div>
      <input
        v-model="category.name['en']"
        placeholder="請輸入英文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">名稱(中)</div>
      <input
        v-model="category.name['zh']"
        placeholder="請輸入中文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <input
        v-model="category.description['en']"
        placeholder="請輸入英文敘述"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <input
        v-model="category.description['zh']"
        placeholder="請輸入中文敘述"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">狀態</div>
      <select v-model="category.active">
        <option value="" disabled>請選擇狀態</option>
        <option value="true">啟用</option>
        <option value="false">停用</option>
      </select>
    </div>
    <div class="buttonArea">
      <button @click="editCategory(category, isEdit ? 'edit' : 'add', 'categoryList')">
        {{ isEdit ? '儲存編輯' : '新增分類' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
