<script setup>
  import { useInquiryStore } from '@/stores/inquiry'
  import { useLoadStore } from '@/stores/load'
  import { useProductStore } from '@/stores/product'
  import { storeToRefs } from 'pinia'
  import { ref, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  const loadStore = useLoadStore()
	const { isInquiryOpen, isInquiryShow, closeInquiry } = storeToRefs(loadStore)

  const inquiryStore = useInquiryStore()
	const { unit, amount, sendInquiry } = storeToRefs(inquiryStore)

  const productStore = useProductStore()
	const { printData } = storeToRefs(productStore)

  const inquiryInfo = ref({
    data: {
      userType: '',
      topic: '',
      question: '',
      firstName: '',
      lastName: '',
      email: '',
      number: '',
      subscribe: false
    },
    printData: {
      application: '',
      model: '',
      spec: '',
      color: '',
      amount: '',
      unit: '',
      area: '',
      date: '',
      serialNumber: ''
    },
    category: 'calculate',
    status: 'pending'
  })

  const showLanText = input => {
    return input[locale.value]
  }

  function generateDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  function generateRandomNumber() {
    const dateString = generateDate()
    const randomNum = Math.floor(Math.random() * 1000000).toString().padStart(6, '0'); // 產生六位隨機數
    return `${dateString}${randomNum}`;
  }

  onMounted( () => {
    inquiryInfo.value.printData = printData.value
    inquiryInfo.value.printData.date = generateDate()
    inquiryInfo.value.printData.serialNumber = generateRandomNumber()
  })

</script>
<template>
  <div
    class="inquiryArea"
    :class="[
      { open: isInquiryOpen },
      { show: isInquiryShow }
    ]">
    <div class="inquiryArea__box">
      <div class="inquiryTitle">
        <h2>Send Inquiry to Eonian Sales Team</h2>
        <div
          @click="closeInquiry()"
          class="closeButton">close</div>
      </div>
      <div class="contactContent__table">
        <div class="section">
          <div class="head">{{ $t('inquiry.userType') }}</div>
          <div class="inputArea">
            <input
              v-model="inquiryInfo.data.userType"
              type="text"
              :placeholder="$t('inquiry.placeholder.job')">
          </div>
        </div>
        <div class="section">
          <div class="head">{{ $t('inquiry.topic') }}</div>
          <div class="inputArea">
            <input
              v-model="inquiryInfo.data.topic"
              type="text"
              :placeholder="$t('inquiry.placeholder.topic')">
          </div>
        </div>
        <div class="section">
          <div class="head">{{ $t('inquiry.question') }}</div>
          <div class="inputArea">
            <textarea
              v-model="inquiryInfo.data.question"
              :placeholder="$t('inquiry.placeholder.message')"></textarea>
          </div>
        </div>
        <div class="section">
          <div class="head">{{ $t('inquiry.firstName') }}</div>
          <div class="inputArea">
            <input
              v-model="inquiryInfo.data.firstName"
              type="text"
              :placeholder="$t('inquiry.placeholder.firstName')">
          </div>
        </div>
        <div class="section">
          <div class="head">{{ $t('inquiry.lastName') }}</div>
          <div class="inputArea">
            <input
              v-model="inquiryInfo.data.lastName"
              type="text"
              :placeholder="$t('inquiry.placeholder.lastName')">
          </div>
        </div>
        <div class="section">
          <div class="head">{{ $t('inquiry.email') }}</div>
          <div class="inputArea">
            <input
              v-model="inquiryInfo.data.email"
              type="text"
              :placeholder="$t('inquiry.placeholder.email')">
          </div>
        </div>
        <div class="section">
          <div class="head">{{ $t('inquiry.number') }}</div>
          <div class="inputArea">
            <input
              v-model="inquiryInfo.data.number"
              type="text"
              :placeholder="$t('inquiry.placeholder.number')">
            <div class="checkboxArea">
              <input 
                v-model="inquiryInfo.data.subscribe"
                type="checkbox"
                id="checkInfo"
                checked>
              <label for="checkInfo">
                <p>{{ $t('inquiry.subscribe') }}</p>
              </label>
              <span></span>
            </div>
          </div>
        </div>
        <div class="section">
          <div class="head"></div>
          <div class="inputArea">
            <div class="buttonArea">
              <div class="reCaptcha"></div>
              <div
                @click="sendInquiry(inquiryInfo)"
                class="button">{{ $t('inquiry.send') }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>