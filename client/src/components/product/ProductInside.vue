<script setup>
  import { useProductStore } from '@/stores/product'
  import { useLoadStore } from '@/stores/load'
  import { useInquiryStore } from '@/stores/inquiry'
  import { useGalleryStore } from '@/stores/gallery'
	import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { ref, watch, computed, onMounted } from 'vue'
  import { useI18n } from 'vue-i18n'

  const { t, locale } = useI18n()

  const productStore = useProductStore()
	const { products, printData } = storeToRefs(productStore)

  const loadStore = useLoadStore()
	const { openInquiry } = storeToRefs(loadStore)

  const inquiryStore = useInquiryStore()
	const { unit, area, amount } = storeToRefs(inquiryStore)

  const galleryStore = useGalleryStore()
	const { openGallery } = storeToRefs(galleryStore)

  const route = useRoute()

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

  const setPrintData = () => {
    printData.value.application = productInfo.value.application
    printData.value.model = productInfo.value.model
    printData.value.spec = selectedColor.value.size
    printData.value.color = selectedColor.value.title
    printData.value.amount = amount.value
    printData.value.unit = unit.value
    printData.value.area = area.value
    openInquiry.value()
  }

  const selectedColor = ref({
    title: '--',
    size: '--'
  })

  const selectColor = ref( color => {
    selectedColor.value = color
  })

  const selectedShape = ref(null)

  const selectShape = ref( shape => {
    selectedShape.value = shape
  })

  const sumPrice = computed( () => {
    return (amount.value * productInfo.value.basePrice).toLocaleString()
  })

  const showLanText = input => {
    if (input) {
      return input[locale.value]
    }
    return '--'
  }

  const checkContent = input => {
    if (input) {
      return input
    }
    return '--'
  }

  const handleClick = (target, data) => {
    if (target == 'shape') {
      if (selectedShape.value == data) {
        openGallery.value(data.title?? '', data.imageURL)
      } else {
        selectShape.value(data)
      }
    } else if (target == 'color') {
      if (selectedColor.value == data) {
        openGallery.value(data.title?? '', data.imageURL)
      } else {
        selectColor.value(data)
      }
    }
  }

  const showOrigin = computed( () => {
    let output = ''
    if (productInfo.value.origin.length == undefined) {
      return
    }
    productInfo.value.origin.forEach( (origin, idx) => {
      if (idx == 0) {
        output += origin[locale.value]
      } else {
        output += ` / ${origin[locale.value]}`
      }
    })
    return output
  })

  const showApplication = input => {
    if (!input) return '--'
    if (locale.value == 'en') return input
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

  watch( area, nVal => {
    if (productInfo.value.unitArea) {
      amount.value = Math.ceil(area.value / productInfo.value.unitArea)
    } else {
      amount.value = 0
    }
  })

  const initProductInfo = () => {
    products.value.data.forEach(product => {
      if (product._id == route.params.id) {
        productInfo.value = { ...product }
      }
    })
    if (productInfo.value.colors.length > 0) {
      selectedColor.value = productInfo.value.colors[0]?? { title: '--', size: '--' }
    }
    if (productInfo.value.shapes.length > 0) {
      selectedShape.value = productInfo.value.shapes[0]?? { title: '--' }
    }
  }

  watch(
    () => products.value.data,
    (newData) => {
      if (newData.length > 0) {
        initProductInfo()
        area.value = productInfo.value.unitArea
      }
    },
    { immediate: true }
  )

</script>
<template>
  <div class="productInsideContent">
    <div class="productInsideContent__option">
      <div class="optionSection">
        <div class="head">{{ $t('spec.shapes') }}</div>
        <ul v-if="productInfo.shapes.length > 0">
          <li
            :class="{ active: selectedShape.title == shape.title }"
            v-for="shape in productInfo.shapes"
            @click="handleClick('shape', shape)">
            <img :src="shape.imageURL">
          </li>
        </ul>
        <div v-else class="noData">
          No shapes.
        </div>
      </div>
      <div class="optionSection">
          <div class="head">{{ $t('spec.colors') }}</div>
          <ul v-if="productInfo.colors.length > 0">
          <li
            :class="{ active: selectedColor.title == color.title }"
            v-for="color in productInfo.colors"
            @click="handleClick('color', color)">
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
                <h2>{{ showLanText(productInfo.name) }}</h2>
                <span class="model">{{ productInfo.model }}</span>
            </div>
            <div class="description">
                <p>
                   {{ showLanText(productInfo.description) }}
                </p>
            </div>
            <div class="spec">
                <div class="spec__item">
                  {{ $t('spec.dimension') }}:&nbsp;&nbsp;
                  {{ selectedColor.size?? "--" }}
                </div>
                <div class="spec__item">
                  {{ $t('spec.origin') }}:&nbsp;&nbsp;
                  {{ showOrigin }}
                </div>
                <div class="spec__item">
                  {{ $t('spec.colour') }}:&nbsp;&nbsp;
                  {{ selectedColor.title?? "--" }}
                </div>
                <div class="spec__item">
                  {{ $t('spec.slipResistance') }}:&nbsp;&nbsp;
                  {{ checkContent(productInfo.slipResistance) }}
                </div>
                <div class="spec__item">
                  {{ $t('spec.application') }}:&nbsp;&nbsp;
                  {{ showApplication(productInfo.application) }}
                </div>
            </div>
            <div class="optional">
                <div class="productInsideContent__option">
                  <div class="optionSection">
                    <div class="head">{{ $t('spec.shapes') }}</div>
                    <ul v-if="productInfo.shapes.length > 0">
                      <li
                        :class="{ active: selectedShape == shape.title }"
                        v-for="shape in productInfo.shapes"
                        @click="handleClick('shape', shape)">
                        <img :src="shape.imageURL">
                      </li>
                    </ul>
                    <div v-else class="noData">
                      No shapes.
                    </div>
                  </div>
                  <div class="optionSection">
                    <div class="head">{{ $t('spec.colors') }}</div>
                    <ul v-if="productInfo.colors.length > 0">
                      <li
                        :class="{ active: selectedColor.title == color.title }"
                        v-for="color in productInfo.colors"
                        @click="handleClick('color', color)">
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
                <!-- <div class="inquirySection">
                    <div class="head">{{ $t('spec.unit') }}</div>
                    <div class="option">
                        <select v-model="unit">
                            <option value="m2">m2</option>
                            <option value="kg">kg</option>
                        </select>
                    </div>
                </div> -->
                <div class="inquirySection">
                    <div class="head">{{ $t('spec.area') }}</div>
                    <div class="option">
                        <input
                          v-model="area"
                          type="number">
                        <span>{{ unit }}</span>
                    </div>
                </div>
                <div class="inquirySection">
                    <div class="head">{{ $t('spec.amount') }}</div>
                    <div class="option">
                        {{ amount }}
                        <span>{{ $t('spec.unit') }}</span>
                    </div>
                </div>
                <!-- <div class="inquirySection">
                    <div class="head">{{ $t('spec.total') }}</div>
                    <div class="option">
                        <div class="sum">
                            $ <span>{{ sumPrice }}</span>
                        </div>
                    </div>
                </div> -->
                <div class="inquirySection">
                    <div
                      class="linkButton"
                      @click="setPrintData">{{ $t('button.download') }}</div>
                </div>
                <div class="inquirySection">
                    <div
                      class="linkButton"
                      @click="setPrintData">{{ $t('button.send') }}</div>
                </div>
            </div>
        </div>
    </div>
  </div>
</template>