<script setup>
  import { useCategoryStore } from '@/stores/category'
  import { storeToRefs } from 'pinia'
	import { useRouter } from 'vue-router'
  
  const categoryStore = useCategoryStore()
	const { categorys, editCategory, goToAddCategory } = storeToRefs(categoryStore)

  const router = useRouter()

  const activeCategory = id => {
    let category
    categorys.value.forEach(categoryData => {
      if (categoryData._id == id) {
        categoryData.active = !categoryData.active
        category = { ...categoryData }
      }
    })
    setTimeout(() => {
      editCategory.value(category, 'edit', 'noRedirect')
    }, 300)
  }

  const goToEditCategory = id => {
    router.push({ path: `/category/${id}`})
  }
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">category</span>分類管理</h1>
    <button @click="goToAddCategory">新增分類</button>
  </div>
  <table class="dataTable">
    <thead>
      <tr>
        <th class="status">狀態</th>
        <th class="name">名稱(英文)</th>
        <th class="name">名稱(中文)</th>
        <th class="description">敘述(英文)</th>
        <th class="description">敘述(中文)</th>
        <th class="action">操作</th>
      </tr>
    </thead>
    
    <tbody>
      <tr
        v-for="category in categorys"
        :class="{ 'inactive': !category.active }">
        <td class="status">
          <div 
            class="switchButton"
            :class="{ 'active': category.active }"
            @click="activeCategory(category._id)">
            <div class="button"></div>
          </div>
        </td>
        <td class="name">{{ category.name['en'] }}</td>
        <td class="name">{{ category.name['zh'] }}</td>
        <td class="description">{{ category.description['en'] }}</td>
        <td class="description">{{ category.description['zh'] }}</td>
        <td class="action">
          <div class="tableButtonArea">
            <button @click="goToEditCategory(category._id)">編輯分類</button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
</style>
