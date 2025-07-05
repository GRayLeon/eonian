<script setup>
  import { usePreviewDialogStore } from '@/stores/previewDialog'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted, watch, computed } from 'vue'

  const previewDialogStore = usePreviewDialogStore()
	const { lan, switchLan, showLan, previewData } = storeToRefs(previewDialogStore)

  const productInfo = ref({
    name: {
      en: '',
      zh: ''
    },
    model: '',
    description: {
      en: '',
      zh: ''
    },
    subImages: [],
    shapes: [],
    colors: [],
    tags: [],
    origin: {},
    appearance: {},
    functionality: {},
    support: {},
    brand: {},
    status: 'draft',
    imageURL: '',
    unitArea: 0,
    basePrice: 0
  })

  const showOrigin = computed( () => {
    let output = ''
    if (productInfo.value.origin.length == undefined) {
      return
    }
    productInfo.value.origin.forEach( (origin, idx) => {
      if (idx == 0) {
        output += origin[lan.value]
      } else {
        output += ` / ${origin[lan.value]}`
      }
    })
    return output
  })

  const showApplication = input => {
    if (!input) return '--'
    if (lan.value == 'en') return input
    switch (input) {
      case 'exterior':
        return '室外'
        break
      case 'interior':
        return '室內'
        break
      case 'exterior/interior':
        return '室外/室內'
        break
    }
  }

  const showColor = computed( () => {
    if (productInfo.value.colors.length == 0) return '--'
    return productInfo.value.colors[0].title
  })

  const showSize = computed( () => {
    if (productInfo.value.colors.length == 0) return '--'
    return productInfo.value.colors[0].size
  })

  const tempUnitArea = ref(0)
  const tempAmount = ref(1)

  watch( tempUnitArea, nVal => {
    if (productInfo.value.unitArea) {
      tempAmount.value = Math.ceil(tempUnitArea.value / productInfo.value.unitArea)
    } else {
      tempAmount.value = 0
    }
  })

  onMounted( () => {
    productInfo.value = { ...previewData.value }
    tempUnitArea.value = productInfo.value.unitArea
  })
</script>
<template>
  <div class="productInsideContent">
    <div class="productInsideContent__option">
      <div class="optionSection">
        <div class="head">{{ lan == 'en' ? 'Shapes' : '面狀' }}</div>
        <ul v-if="productInfo.shapes.length > 0">
          <li v-for="shape in productInfo.shapes">
            <img :src="shape.imageURL">
          </li>
        </ul>
        <div v-else class="noData">
          No shapes.
        </div>
      </div>
      <div class="optionSection">
          <div class="head">{{ lan == 'en' ? 'Colors' : '顏色' }}</div>
          <ul v-if="productInfo.colors.length > 0">
          <li v-for="color in productInfo.colors">
            <img :src="color.imageURL">
          </li>
        </ul>
        <div v-else class="noData">
          No colors.
        </div>
      </div>
    </div>
    <div class="productInsideContent__images">
      <img :src="productInfo.imageURL" />
      <img v-for="img in productInfo.subImages" :src="img.imageURL" />
    </div>
    <div class="productInsideContent__info">
        <div class="stickyCard">
            <div class="productTitle">
                <h2>{{ showLan(productInfo.name) }}</h2>
                <span class="model">{{ productInfo.model }}</span>
            </div>
            <div class="description">
                <p>
                   {{ showLan(productInfo.description) }}
                </p>
            </div>
            <div class="spec">
                <div class="spec__item">
                  {{ lan == 'en' ? 'Dimension' : '尺寸' }}
                  : &ensp;&ensp;
                  {{ showSize }}
                </div>
                <div class="spec__item">
                  {{ lan == 'en' ? 'Oringin' : '產地' }}
                  :&nbsp;&nbsp;
                  {{ showOrigin }}
                </div>
                <div class="spec__item">
                  {{ lan == 'en' ? 'Colour' : '顏色' }}
                  :&nbsp;&nbsp;
                  {{ showColor }}
                </div>
                <div class="spec__item">
                  {{ lan == 'en' ? 'SlipResistance' : '防滑係數' }}
                  :&nbsp;&nbsp;
                  {{ productInfo.slipResistance?? '--'}}
                </div>
                <div class="spec__item">
                  {{ lan == 'en' ? 'Application' : '應用' }}
                  :&nbsp;&nbsp;
                  {{ showApplication(productInfo.application) }}
                </div>
            </div>
            <div class="optional">
                <div class="productInsideContent__option">
                  <div class="optionSection">
                    <div class="head">Shapes</div>
                    <ul v-if="productInfo.shapes.length > 0">
                      <li v-for="shape in productInfo.shapes">
                        <img :src="shape.imageURL">
                      </li>
                    </ul>
                    <div v-else class="noData">
                      No shapes.
                    </div>
                  </div>
                  <div class="optionSection">
                    <div class="head">Colors</div>
                    <ul v-if="productInfo.colors.length > 0">
                      <li v-for="color in productInfo.colors">
                        <img :src="color.imageURL">
                      </li>
                    </ul>
                    <div v-else class="noData">
                      No colors.
                    </div>
                  </div>
                </div>
            </div>
            <div class="inquiry">
                <div class="inquirySection">
                    <div class="head">{{ lan == 'en' ? 'Area' : '面積' }}</div>
                    <div class="option">
                        <input
                          v-model="tempUnitArea"
                          type="number">
                        <span>m²</span>
                    </div>
                </div>
                <div class="inquirySection">
                    <div class="head">{{ lan == 'en' ? 'Amonunt' : '數量' }}</div>
                    <div class="option">
                        {{ tempAmount }}
                        <span>{{ lan == 'en' ? 'Box' : '箱' }}</span>
                    </div>
                </div>
                <div class="inquirySection">
                    <div class="linkButton">
                      {{ lan == 'en' ? 'Download Inquiry PDF' : '下載諮詢PDF' }}
                    </div>
                </div>
                <div class="inquirySection">
                    <div class="linkButton">
                      {{ lan == 'en' ? 'Send Inquiry to Eonian Sales TeamTotal' : '傳送諮詢內容給業務' }}
                    </div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>