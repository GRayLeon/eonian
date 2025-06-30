<script setup>
  import { usePreviewDialogStore } from '@/stores/previewDialog'
	import { storeToRefs } from 'pinia'
  import { ref, onMounted, computed } from 'vue'

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


  const showColor = computed( () => {
    if (productInfo.value.colors.length == 0) return '--'
    return productInfo.value.colors[0].title
  })

  const showShape = computed( () => {
    if (productInfo.value.shapes.length == 0) return '--'
    return productInfo.value.shapes[0].title
  })

  onMounted( () => {
    productInfo.value = { ...previewData.value }
  })
</script>
<template>
  <div class="productInsideContent">
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
                  Dimension:&nbsp;&nbsp;
                  {{ showColor }}
                </div>
                <div class="spec__item">
                  Origin:&nbsp;&nbsp;
                  {{ showOrigin }}
                </div>
                <div class="spec__item">
                  Colour:&nbsp;&nbsp;
                  {{ showShape }}
                </div>
                <div class="spec__item">
                  SlipResistance:&nbsp;&nbsp;
                  {{ productInfo.slipResistance?? '--'}}
                </div>
                <div class="spec__item">
                  Application:&nbsp;&nbsp;
                  {{ productInfo.application?? '--' }}
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
                    <div class="head">Area</div>
                    <div class="option">
                        <input
                          type="number">
                        <span>m²</span>
                    </div>
                </div>
                <div class="inquirySection">
                    <div class="head">Amount</div>
                    <div class="option">
                        1
                        <span>Box</span>
                    </div>
                </div>
                <div class="inquirySection">
                    <div class="linkButton">Download Inquiry PDF</div>
                </div>
                <div class="inquirySection">
                    <div class="linkButton">Send Inquiry to Eonian Sales TeamTotal</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>