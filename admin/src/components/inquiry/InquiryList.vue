<script setup>
  import { useRouter } from 'vue-router'
  import { useInquiryStore } from '@/stores/inquiry'
	import { storeToRefs } from 'pinia'
  import { watch, onMounted } from 'vue'

  const inquiryStore = useInquiryStore()
	const { categoryList, statusList, category, status, sort, order, inquirys, getInquiryDatas } = storeToRefs(inquiryStore)

  const router = useRouter()

  const categoryWording = categoryId => {
    return categoryList.value.find( category => category.value == categoryId ).label
  }

  const statusWording = statusValue => {
    return statusList.value.find( status => status.value == statusValue ).label
  }

  watch(status, nVal => {
    getInquiryDatas.value(status.value, category.value, sort.value, order.value)
  })

  watch(category, nVal => {
    getInquiryDatas.value(status.value, category.value, sort.value, order.value)
  })

  watch(sort, nVal => {
    getInquiryDatas.value(status.value, category.value, sort.value, order.value)
  })

</script>

<template>
  <div class="title">
    <h1><span class="material-icons">edit_note</span>表單管理</h1>
  </div>
  <div class="filterArea">
    <div class="inputItem">
      <div class="head">排序</div>
      <select v-model="sort">
        <option value="_id">上架時間</option>
        <option value="processor">處理人</option>
      </select>
    </div>
  </div>
  <ul v-if="inquirys.data.length" class="cardList">
    <li class="head">
      <div class="name">身份</div>
      <div class="status">狀態</div>
      <div class="category">分類</div>
      <div class="description">問題</div>
    </li>
    <li v-for="inquiry in inquirys.data" @click="router.push(`inquiry/${inquiry._id}`)">
      <div class="name">{{ inquiry.data.userType }}</div>
      <div class="status">
        <span :class="inquiry.status">{{ statusWording(inquiry.status) }}</span>
      </div>
      <div class="category">
        {{ categoryWording(inquiry.category) }}
      </div>
      <div class="description">{{  inquiry.data.question }}</div>
    </li>
  </ul>
  <div v-else class="empty">
    沒有符合此條件的表單。
  </div>
</template>

<style scoped>
</style>
