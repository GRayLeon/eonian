<script setup>
  import { usePagesStore } from '@/stores/pages'
  import { storeToRefs } from 'pinia'
  import { RouterLink } from 'vue-router'
  import { onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  const pagesStore = usePagesStore()
  const { pagesInfo, getPages } = storeToRefs(pagesStore)

  const showLanText = input => {
    return input[locale.value]
  }

  onMounted( () => {
    getPages.value()
  })

</script>
<template>
  <div class="footer">
    <div class="topArea">
      <div class="topArea__logo">
        <img src="@/assets/images/logo--footer.svg">
      </div>
      <div class="topArea__info">
        <div class="company">
          <div class="title">
            Eonian Acumen Co., LTD.
          </div>
          <ul>
            <li>{{ showLanText(pagesInfo.contact.address) }}</li>
            <li>service@eonian.space</li>
            <li>02 2735 3598</li>
          </ul>
        </div>
        <ul class="message">
          <li>
            <img src="@/assets/images/message--fb.png">
          </li>
          <li>
            <img src="@/assets/images/message--line.png">
          </li>
        </ul>
      </div>
    </div>
    <div class="bottomArea">
      <div class="bottomArea__copyright">
        <span>&copy; Eonian Acumen Co., LTD.</span>
      </div>
      <div class="bottomArea__link">
        <ul class="social">
          <li>
            <a href="">Facebook</a>
          </li>
          <li>
            <a href="">Instagram</a>
          </li>
        </ul>
        <ul class="subPages">
          <li>{{ $t('link.policy') }}</li>
          <li>{{ $t('link.notice') }}</li>
          <li>{{ $t('link.terms') }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>