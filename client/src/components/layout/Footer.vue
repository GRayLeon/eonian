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
            <a href="https://www.facebook.com/mosatilestw" target="_blank">
              <img src="@/assets/images/message--fb.png">
            </a>
          </li>
          <li>
            <a href="https://lin.ee/BOaZY0z" target="_blank">
              <img src="@/assets/images/message--line.png">
            </a>
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
            <a href="https://www.facebook.com/mosatilestw" target="_blank">Facebook</a>
          </li>
          <li>
            <a href="https://www.instagram.com/eonian.taipei/" target="_blank">Instagram</a>
          </li>
        </ul>
        <ul class="subPages">
          <li>
            <a href="">{{ $t('link.policy') }}</a>
          </li>
          <li>
            <a href="">{{ $t('link.notice') }}</a>
          </li>
          <li>
            <a href="">{{ $t('link.terms') }}</a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>