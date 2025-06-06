<script setup>
  import { useInquiryStore } from '@/stores/inquiry'
  import { useAuthStore } from '@/stores/auth'
  import { useLoadStore } from '@/stores/load'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted } from 'vue'

  const inquiryStore = useInquiryStore()
	const { categoryList, inquirys, getInquiryDatas, editInquiry, downloadInquiry } = storeToRefs(inquiryStore)

  const authStore = useAuthStore()
	const { profile } = storeToRefs(authStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const route = useRoute()
  const router = useRouter()

  const categoryWording = categoryId => {
    if (categoryId) {
      return categoryList.value.find( category => category.value == categoryId ).label
    }
  }

  const backInquiryList = () => {
    router.push({ name: 'inquiryList'})
  }

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isReady = computed( () => {
    let ready = true
    return ready
  })

  const isSubscribe = status => {
    return status? '已訂閱' : '未訂閱'
  }

  const isProcesserShow = ref(false)

  const showTime = (time) => {
    const date = new Date(time)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    const seconds = String(date.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
  }

  const inquiryInfo = ref({
    data: {
      userType: '',
      topic: '',
      question: '',
      firstName: '',
      lastName: '',
      email: '',
      number: '',
      subscribe: false,
    },
    printData: {
      title: '',
      subtitle: ''
    },
    category: '',
    status: 'pending',
    processer: '',
    createTime: ''
  })

  const initInquiry = () => {
    inquirys.value.data.forEach( inquiry => {
      if (inquiry._id == route.params.id) {
        inquiryInfo.value = { ...inquiry }
      }
      if (inquiryInfo.value.processer) {
        isProcesserShow.value = true
      } else {
        inquiryInfo.value.processer = profile.value.account
      }
      isLoading.value = false
    })
  }

  onMounted( async () => {
    isLoading.value = true
    await getInquiryDatas.value()
    initInquiry()
  })
</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backInquiryList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>諮詢表單詳細內容</h1>
    </div>
  </div>
  <div class="editArea">
    <div class="inputItem">
      <div class="head">身份</div>
      <span>{{ inquiryInfo.data.userType }}</span>
    </div>
    <div class="inputItem">
      <div class="head">標題</div>
      <span>{{ inquiryInfo.data.topic }}</span>
    </div>
    <div class="inputItem">
      <div class="head">問題</div>
      <span>{{ inquiryInfo.data.question }}</span>
    </div>
    <div class="inputItem">
      <div class="head">姓名</div>
      <span>{{ inquiryInfo.data.firstName }} {{ inquiryInfo.data.lastName }}</span>
    </div>
    <div class="inputItem">
      <div class="head">電子信箱</div>
      <span>{{ inquiryInfo.data.email }}</span>
    </div>
    <div class="inputItem">
      <div class="head">手機號碼</div>
      <span>{{ inquiryInfo.data.number }}</span>
    </div>
    <div class="inputItem">
      <div class="head">是否訂閱</div>
      <span>{{ isSubscribe(inquiryInfo.data.subscribe) }}</span>
    </div>
    <div class="inputItem">
      <div class="head">類型</div>
      <span>{{ categoryWording(inquiryInfo.category) }}</span>
    </div>
    <div class="inputItem">
      <div class="head">處理人</div>
      <input
        v-if="!isProcesserShow"
        v-model="inquiryInfo.processer"
        placeholder="請輸入處理人"
        type="text"/>
      <span v-else>{{ inquiryInfo.processer }}</span>
    </div>
    <div class="inputItem">
      <div class="head">狀態</div>
      <select v-model="inquiryInfo.status">
        <option value="" disabled>請選擇狀態</option>
        <option value="pending">未處理</option>
        <option value="processing">處理中</option>
        <option value="processed">已處理</option>
        <option value="ignore">擱置</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">諮詢時間</div>
      <span>{{ showTime(inquiryInfo.createTime) }}</span>
    </div>
    <div class="buttonArea">
      <button
        v-if="inquiryInfo.printData"
        @click="downloadInquiry(inquiryInfo._id)">
        下載表單
      </button>
      <button
        :disabled="!isReady"
        @click="editInquiry(inquiryInfo)">
        儲存編輯
      </button>
    </div>
  </div>
</template>

<style scoped>
</style>
