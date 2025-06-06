<script setup>
  import { useRouter } from 'vue-router'
  import { useProjectStore } from '@/stores/project'
	import { storeToRefs } from 'pinia'
  import { watch } from 'vue'

  const projectStore = useProjectStore()
	const { statusList,category, status, sort, order, projects, getProjects, goToAddProject } = storeToRefs(projectStore)

  const router = useRouter()

  const statusWording = statusValue => {
    return statusList.value.find( status => status.value == statusValue ).label
  }

  watch(status, nVal => {
    getProjects.value(status.value, category.value, sort.value, order.value)
  })

  watch(category, nVal => {
    getProjects.value(status.value, category.value, sort.value, order.value)
  })

  watch(sort, nVal => {
    getProjects.value(status.value, category.value, sort.value, order.value)
  })
</script>

<template>
  <div class="title">
    <h1><span class="material-icons">folder</span>專案管理</h1>
    <button @click="goToAddProject">新增專案</button>
  </div>
  <div class="filterArea">
    <div class="inputItem">
      <div class="head">狀態</div>
      <select v-model="status">
        <option value="">全部狀態</option>
        <option
          :value="status.value"
          v-for="status in statusList">
          {{ status.label }}
        </option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">排序</div>
      <select v-model="sort">
        <option value="_id">上架時間</option>
        <option value="name">名稱</option>
        <option value="parentCategory">分類</option>
        <option value="basePrice">價錢</option>
      </select>
    </div>
  </div>
  <ul v-if="projects.data.length" class="cardList">
    <li class="head">
      <div class="name">名稱</div>
      <div class="status">狀態</div>
      <div class="description">描述</div>
    </li>
    <li v-for="project in projects.data" @click="router.push(`project/${project._id}`)">
      <div class="name">{{ project.title }}</div>
      <div class="status">
        <span :class="project.status">{{ statusWording(project.status) }}</span>
      </div>
      <div class="description">{{  project.description['zh'] }}</div>
    </li>
  </ul>
  <div v-else class="empty">
    沒有符合此條件的專案。
  </div>
</template>

<style scoped>
</style>
