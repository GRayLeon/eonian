<script setup>
  import { useProductStore } from '@/stores/product'
  import { useSpecStore } from '@/stores/spec'
  import { useLoadStore } from '@/stores/load'
  import { usePreviewDialogStore } from '@/stores/previewDialog'
	import { storeToRefs } from 'pinia'
	import { useRoute, useRouter } from 'vue-router'
  import { ref, computed, onMounted, onUpdated } from 'vue';

  const productStore = useProductStore()
	const { 
    // selectSizes,
    products, selectFile,
    selectSubImageFiles, updateSubImageFile,
    selectShapeImageFiles, updateShapeImageFile,
    selectColorImageFiles, updateColorImageFile,
    tempFunctionality, tempOrigin, tempAppearance, tempSupport,
    editProduct,
    getProducts
  } = storeToRefs(productStore)

  const specStore = useSpecStore()
	const { getSpecDatas, specDatas, isGetSpecs } = storeToRefs(specStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

  const previewDialogStore = usePreviewDialogStore()
	const { openPreviewDialog } = storeToRefs(previewDialogStore)

  const route = useRoute()
  const router = useRouter()

  const productInfo = ref({
    name: {
      en: '',
      zh: ''
    },
    description: {
      en: '',
      zh: ''
    },
    subImages: [],
    shapes: [],
    colors: [],
    tags: [],
    origin: [],
    appearance: [],
    functionality: [],
    support: [],
    brand: [], 
    status: 'draft',
    imageURL: '',
    basePrice: 0,
    unitArea: 0,
    slipResistance: 0,
    model: '',
    dimension: '',
    application: ''
  })


  const basePrice = ref(0)

  const isEdit = computed( () => {
    return route.params.id !== undefined
  })

  const isDraft = ref(false)
  const isArchived = ref(false)

  const typeWording = computed( () => {
    return isEdit.value? '編輯' : '新增'
  })

  const isReady = computed( () => {
    let ready = true
    return ready
  })

  // mainImages
  const previewUrl = ref(null)
  const previewName = ref('請選擇圖片檔案')

  const isChanging = ref(false)
  const changeImage = () => {
    isChanging.value = true
  }

  const onFileChange = event => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now()}_productImage`, { type: file.type })
      selectFile.value = newFile
      previewUrl.value = URL.createObjectURL(file)
      previewName.value = file.name
    } else {
      previewUrl.value = null
      previewName.value = '請選擇圖片檔案'
    }
  }

  // subImages
  const previewSubimageURL = ref([])
  const previewSubImageName = ref(['請選擇圖片檔案'])

  const isSubImageChanging = ref([])
  const changeSubImage = idx => {
    isSubImageChanging.value[idx] = true
  }

  const onSubImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_subImage`, { type: file.type })
      selectSubImageFiles.value[idx] = newFile
      previewSubimageURL.value[idx] = URL.createObjectURL(file)
      previewSubImageName.value[idx] = file.name
      updateSubImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewSubimageURL.value[idx] = null
      previewSubImageName.value[idx] = '請選擇圖片檔案'
      updateSubImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateSubImageFile.value.splice(findx, 1)
        }
      })
    }
  }
  
  const addSubImage = () => {
    productInfo.value.subImages.push({
      imageURL: '',
      imagePublicId: ''
    })
    isSubImageChanging.value.push(true)
  }

  const removeSubImage = idx => {
    productInfo.value.subImages.splice(idx, 1)
    selectSubImageFiles.value.splice(idx, 1)
    previewSubimageURL.value.splice(idx, 1)
    previewSubImageName.value.splice(idx, 1)
    isSubImageChanging.value.splice(idx, 1)
  }

  // shapes
  const previewShapeimageURL = ref([])
  const previewShapeImageName = ref(['請選擇圖片檔案'])

  const isShapeImageChanging = ref([])
  const changeShapeImage = idx => {
    isShapeImageChanging.value[idx] = true
  }

  const onShapeImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_shpaeImage`, { type: file.type })
      selectShapeImageFiles.value[idx] = newFile
      previewShapeimageURL.value[idx] = URL.createObjectURL(file)
      previewShapeImageName.value[idx] = file.name
      updateShapeImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewShapeimageURL.value[idx] = null
      previewShapeImageName.value[idx] = '請選擇圖片檔案'
      updateShapeImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateShapeImageFile.value.splice(findx, 1)
        }
      })
    }
  }

  const addShape = () => {
    productInfo.value.shapes.push({
      title: '',
      scale: '',
      imageURL: '',
      imagePublicId: ''
    })
    isShapeImageChanging.value.push(true)
  }

  const removeShape = idx => {
    productInfo.value.shapes.splice(idx, 1)
    selectShapeImageFiles.value.splice(idx, 1)
    previewShapeimageURL.value.splice(idx, 1)
    previewShapeImageName.value.splice(idx, 1)
    isShapeImageChanging.value.splice(idx, 1)
  }

  // colors
  const previewColorimageURL = ref([])
  const previewColorImageName = ref(['請選擇圖片檔案'])

  const isColorImageChanging = ref([])
  const changeColorImage = idx => {
    isColorImageChanging.value[idx] = true
  }

  const onColorImageFileChange = (event, idx) => {
    const file = event.target.files[0]
    if (file) {
      const newFile = new File([file], `${Date.now() + idx}_colorImage`, { type: file.type })
      selectColorImageFiles.value[idx] = newFile
      previewColorimageURL.value[idx] = URL.createObjectURL(file)
      previewColorImageName.value[idx] = file.name
      updateColorImageFile.value.push( {
        idx: idx,
        name: newFile.name.split(".")[0]
      })
    } else {
      previewColorimageURL.value[idx] = null
      previewColorImageName.value[idx] = '請選擇圖片檔案'
      updateColorImageFile.value.forEach( (file, findx) => {
        if (file.idx == idx) {
          updateColorImageFile.value.splice(findx, 1)
        }
      })
    }
  }
  
  const addColor = () => {
    productInfo.value.colors.push({
      title: '',
      size: '',
      imageURL: '',
      imagePublicId: ''
    })
    isColorImageChanging.value.push(true)
  }

  const removeColor = idx => {
    productInfo.value.colors.splice(idx, 1)
    selectColorImageFiles.value.splice(idx, 1)
    previewColorimageURL.value.splice(idx, 1)
    previewColorImageName.value.splice(idx, 1)
    isColorImageChanging.value.splice(idx, 1)
  }

  // tags
  const tempTag = ref(null)

  const addTag = () => {
    productInfo.value.tags.push(tempTag.value)
    tempTag.value = null
  }
  
  const removeTag = idx => {
    productInfo.value.tags.splice(idx, 1)
  }

  const backcardList = () => {
    router.push({ name: 'productList'})
  }

  const ensureArray = value => {
    if (Array.isArray(value)) { return value }
    if (value === null || value === undefined || value === '') { return [] }
    return [value]
  }

  const initProductInfo = () => {
    if (isEdit.value) {
      tempOrigin.value = []
      tempFunctionality.value = []
      tempAppearance.value = []
      tempSupport.value = []
      
      products.value.data.forEach(product => {
        if (product._id == route.params.id) {
          productInfo.value = { 
            ...product,
            origin: ensureArray(product.origin),
            appearance: ensureArray(product.appearance),
            functionality: ensureArray(product.functionality),
            support: ensureArray(product.support),
            brand: ensureArray(product.brand),
          }
          basePrice.value = product.basePrice
          product.origin.forEach( item => {
            tempOrigin.value.push({
              en: item.en,
              zh: item.zh
            })
          })
          product.functionality.forEach( item => {
            tempFunctionality.value.push({
              en: item.en,
              zh: item.zh
            })
          })
          product.appearance.forEach( item => {
            tempAppearance.value.push({
              en: item.en,
              zh: item.zh
            })
          })
          product.support.forEach( item => {
            tempSupport.value.push({
              en: item.en,
              zh: item.zh
            })
          })
        }
      })
      productInfo.value.subImages.forEach( subImage => {
        isSubImageChanging.value.push(false)
      })
      productInfo.value.shapes.forEach( shape => {
        isShapeImageChanging.value.push(false)
      })
      productInfo.value.colors.forEach( color => {
        isColorImageChanging.value.push(false)
      })
    }
  }

  onMounted( async () => {
    isLoading.value = true
    await getSpecDatas.value()
    await getProducts.value()
    initProductInfo()
    if (!isEdit.value) {
      isChanging.value = true
    }
    if (productInfo.value.status == 'draft') {
      isDraft.value = true
    } else if (productInfo.value.status == 'archived') {
      isArchived.value = true
    }
    updateSubImageFile.value = []
    updateShapeImageFile.value = []
    updateColorImageFile.value = []
    selectSubImageFiles.value = []
    selectShapeImageFiles.value = []
    selectColorImageFiles.value = []
  })

  onUpdated( () => {
    isLoading.value = false
  })

  const openPreview = () => {
    const tempProductInfo = { ...productInfo.value }

    tempProductInfo.name = { ...productInfo.value.name }
    tempProductInfo.description = { ...productInfo.value.description }
    tempProductInfo.subImages = [...productInfo.value.subImages]
    tempProductInfo.shapes = [...productInfo.value.shapes]
    tempProductInfo.colors = [...productInfo.value.colors]
    tempProductInfo.tags = [...productInfo.value.tags]
    tempProductInfo.origin = [...tempOrigin.value]
    tempProductInfo.appearance = [...tempAppearance.value]
    tempProductInfo.functionality = [...tempFunctionality.value]
    tempProductInfo.support = [...tempSupport.value]
    tempProductInfo.brand = [...productInfo.value.brand]

    if (selectFile.value) {
      tempProductInfo.imageURL = URL.createObjectURL(selectFile.value)
    }

    if (previewSubimageURL.value?.length && isSubImageChanging.value?.length) {
      const newSubImages = previewSubimageURL.value
        .map((url, index) => {
          if (isSubImageChanging.value[index] && url) {
            return {
              imageURL: url
            }
          }
          return null
        })
        .filter(Boolean)

      tempProductInfo.subImages = [...productInfo.value.subImages, ...newSubImages]
    }
    
    if (previewShapeimageURL.value?.length && isShapeImageChanging.value?.length) {
      const newShapeImages = previewShapeimageURL.value
        .map((url, index) => {
          if ((isShapeImageChanging.value[index]) && url) {
            return {
              imageURL: url
            }
          }
          return null
        })
        .filter(Boolean)

      tempProductInfo.shapes = productInfo.value.shapes.map((shape, idx) => {
        const updated = { ...shape }

        if (isShapeImageChanging.value[idx] && previewShapeimageURL.value[idx]) {
          updated.imageURL = previewShapeimageURL.value[idx]
        }

        return updated
      })

    }

    if (previewColorimageURL.value?.length && isColorImageChanging.value?.length) {
      const newColorImages = previewColorimageURL.value
        .map((url, index) => {
          if (isColorImageChanging.value[index] && url) {
            return {
              imageURL: url
            }
          }
          return null
        })
        .filter(Boolean)

      tempProductInfo.colors = productInfo.value.colors.map((color, idx) => {
        const updated = { ...color }
        if (isColorImageChanging.value[idx] && previewColorimageURL.value[idx]) {
          updated.imageURL = previewColorimageURL.value[idx]
        }
        return updated
      })


    }

    openPreviewDialog.value('product', tempProductInfo)
  }
  
</script>

<template>
  <div class="title">
    <div class="buttonTitle">
      <div class="backButton" @click="backcardList()">
        <span class="material-icons">chevron_left</span>
      </div>
      <h1>{{ typeWording }}產品</h1>
    </div>
  </div>
  <div class="editArea">
    <img
      :src="productInfo.imageURL"
      v-if="productInfo.imageURL && !isChanging">
    <img
      :src="previewUrl"
      v-else-if="previewUrl && isChanging">
    <div class="noImage" v-else><span>沒有圖片</span></div>
    <button
      v-if="!isChanging && !isArchived"
      @click="changeImage">
      更改圖片
    </button>
    <div v-else-if="!isArchived" class="imageSelect">
      <input
        type="file"
        accept=".jpg, .png"
        name="selectImage"
        id="selectImage"
        @change="onFileChange">
      <span>{{ previewName }}</span>
      <label for="selectImage">選擇檔案</label>
    </div>
    <div class="inputItem inputItem--column">
      <ul class="subImages">
        <li v-for="(subImage, idx) in productInfo.subImages">
          <img
            :src="subImage.imageURL"
            v-if="subImage.imageURL && !isSubImageChanging[idx]">
          <img
            :src="previewSubimageURL[idx]"
            v-else-if="previewSubimageURL[idx] && isSubImageChanging[idx]">
          <div class="noImage" v-else><span>沒有圖片</span></div>
          <button
            v-if="!isSubImageChanging[idx] && !isArchived"
            @click="changeSubImage(idx)">
            更改圖片
          </button>
          <div v-else-if="!isArchived" class="imageSelect">
            <input
              type="file"
              accept=".jpg, .png"
              name="selectImage"
              :id="`selectSubImage-${idx}`"
              @change="onSubImageFileChange($event, idx)">
            <span>{{ previewSubImageName[idx] }}</span>
            <label :for="`selectSubImage-${idx}`">選擇檔案</label>
          </div>
          <div class="deleteImage" @click="removeSubImage(idx)"><span class="material-icons">close</span></div>
        </li>
      </ul>
      <button @click="addSubImage()">新增圖片</button>
    </div>
    <div class="inputItem" v-if="isEdit">
      <div class="head">商品狀態</div>
      <select
        v-if="!isDraft"
        v-model="productInfo.status"
        :disabled="isArchived">
        <option value="" disabled>請選擇商品狀態</option>
        <option value="active">上架</option>
        <option value="inactive">下架</option>
      </select>
      <select v-else disabled>
        <option>草稿</option>
      </select>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">產地</div>
      <ul class="checkboxList">
        <li v-for="(origin, idx) in specDatas.origin.list">
          <input type="checkbox" :id="'origin' + idx" v-model="tempOrigin" :value="origin">
          <label :for="'origin' + idx">{{ origin['zh'] }} / {{ origin['en'] }}</label>
        </li>
      </ul>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">外觀</div>
      <ul class="checkboxList">
        <li v-for="(appearance, idx) in specDatas.appearance.list">
          <input type="checkbox" :id="'appearance' + idx" v-model="tempAppearance" :value="appearance">
          <label :for="'appearance' + idx">{{ appearance['zh'] }} / {{ appearance['en'] }}</label>
        </li>
      </ul>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">功能</div>
      <ul class="checkboxList">
        <li v-for="(functionality, idx) in specDatas.functionality.list">
          <input type="checkbox" :id="'functionality' + idx" v-model="tempFunctionality" :value="functionality">
          <label :for="'functionality' + idx">{{ functionality['zh'] }} / {{ functionality['en'] }}</label>
        </li>
      </ul>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">經典系列</div>
      <ul class="checkboxList">
        <li v-for="(support, idx) in specDatas.support.list">
          <input type="checkbox" :id="'support' + idx" v-model="tempSupport" :value="support">
          <label :for="'support' + idx">{{ support['zh'] }} / {{ support['en'] }}</label>
        </li>
      </ul>
    </div>
    <div class="inputItem" v-if="isGetSpecs">
      <div class="head">品牌</div>
      <ul class="checkboxList">
        <li v-for="(brand, idx) in specDatas.brands.list">
          <input type="checkbox" :id="'brand' + idx" v-model="productInfo.brand" :value="brand.name">
          <label :for="'brand' + idx">{{ brand.name }}</label>
        </li>
      </ul>
    </div>
    <div class="inputItem">
      <div class="head">名稱(英)</div>
      <input
        v-model="productInfo.name.en"
        :disabled="isArchived"
        placeholder="請如入英文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">名稱(中)</div>
      <input
        v-model="productInfo.name.zh"
        :disabled="isArchived"
        placeholder="請輸入中文名稱"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">型號</div>
      <input
        v-model="productInfo.model"
        :disabled="isArchived"
        placeholder="請如入型號"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">防滑度</div>
      <input
        v-model="productInfo.slipResistance"
        :disabled="isArchived"
        placeholder="請輸入防滑度"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">應用</div>
      <select
        v-model="productInfo.application"
        :disabled="isArchived">
        <option value="" disabled selected>請選擇應用場所</option>
        <option value="exterior">室外</option>
        <option value="interior">室內</option>
        <option value="exterior/interior">室內/室外</option>
      </select>
    </div>
    <div class="inputItem">
      <div class="head">敘述(英)</div>
      <input
        v-model="productInfo.description.en"
        :disabled="isArchived"
        placeholder="請輸入英文敘述"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">敘述(中)</div>
      <input
        v-model="productInfo.description.zh"
        :disabled="isArchived"
        placeholder="請輸入中文敘述"
        type="text"/>
    </div>
    <div class="inputItem">
      <div class="head">單箱面積</div>
      <input
        v-model="productInfo.unitArea"
        :disabled="isArchived"
        placeholder="請輸入單箱面積"
        type="number"/>
      <span>m²</span>
    </div>
    <div class="inputItem">
      <div class="head">面狀</div>
      <div class="shapeList">
        <div
          class="shapeInputArea"
          v-for="(shape, idx) in productInfo.shapes">
          <div class="shapeInputItem">
            <div class="imgArea">
              <img
                :src="shape.imageURL"
                v-if="shape.imageURL && !isShapeImageChanging[idx]">
              <img
                :src="previewShapeimageURL[idx]"
                v-else-if="previewShapeimageURL[idx] && isShapeImageChanging[idx]">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="!isShapeImageChanging[idx] && !isArchived"
                @click="changeShapeImage(idx)">
                更改圖片
              </button>
              <div v-else-if="!isArchived" class="imageSelect">
                <input
                  type="file"
                  accept=".jpg, .png" name="selectImage" :id="`selectShapeImage-${idx}`"
                  :disabled="isArchived"
                  @change="onShapeImageFileChange($event, idx)">
                <span>{{ previewShapeImageName[idx] }}</span>
                <label :for="`selectShapeImage-${idx}`">選擇檔案</label>
              </div>
            </div>
          </div>
          <div class="shapeInputItem">
            <div class="subHead">規格</div>
            <input
              type="text"
              v-model="shape.title"
              placeholder="請輸入面狀規格" />
          </div>
          <div class="shapeInputOption">
            <div
              class="shapeButton"
              v-if="productInfo.shapes.length > 1"
              @click="removeShape(idx)">
              <span class="material-icons">close</span>
            </div>
          </div>
        </div>
        <div class="addButtonArea">
          <button
            class="smallButton"
            :disabled="isArchived"
            @click="addShape()">
            新增
          </button>
        </div>
      </div>
    </div>
    <div class="inputItem">
      <div class="head">顏色</div>
      <div class="shapeList">
        <div
          class="shapeInputArea"
          v-for="(color, idx) in productInfo.colors">
          <div class="shapeInputItem">
            <div class="imgArea">
              <img
                :src="color.imageURL"
                v-if="color.imageURL && !isColorImageChanging[idx]">
              <img
                :src="previewColorimageURL[idx]"
                v-else-if="previewColorimageURL[idx] && isColorImageChanging[idx]">
              <div class="noImage" v-else><span>沒有圖片</span></div>
              <button
                v-if="!isColorImageChanging[idx] && !isArchived"
                @click="changeColorImage(idx)">
                更改圖片
              </button>
              <div v-else-if="!isArchived" class="imageSelect">
                <input
                  type="file"
                  accept=".jpg, .png" name="selectImage" :id="`selectColorImage-${idx}`"
                  :disabled="isArchived"
                  @change="onColorImageFileChange($event, idx)">
                <span>{{ previewColorImageName[idx] }}</span>
                <label :for="`selectColorImage-${idx}`">選擇檔案</label>
              </div>
            </div>
          </div>
          <div class="shapeInputItem">
            <div class="subHead">編號</div>
            <input
              type="text"
              v-model="color.title"
              placeholder="請輸入顏色編號" />
          </div>
          <div class="shapeInputItem">
            <div class="subHead">尺寸</div>
            <input
              type="text"
              v-model="color.size"
              placeholder="請輸入顏色尺寸" />
          </div>
          <div class="shapeInputOption">
            <div
              class="shapeButton"
              v-if="productInfo.colors.length > 1"
              @click="removeColor(idx)">
              <span class="material-icons">close</span>
            </div>
          </div>
        </div>
        <div class="addButtonArea">
          <button
            class="smallButton"
            :disabled="isArchived"
            @click="addColor()">
            新增
          </button>
        </div>
      </div>
    </div>
    <div class="buttonArea" v-if="isEdit && !isArchived && !isDraft">
      <button
        @click="openPreview()">預覽</button>
      <button 
        :disabled="!isReady"
        @click="editProduct(productInfo, 'edit', selecteFile)">儲存編輯</button>
      <button 
        :disabled="!isReady"
        v-if="!isDraft"
        @click="editProduct(productInfo, 'archive', selecteFile)">封存商品</button>
    </div>
    <div class="buttonArea" v-else-if="(!isEdit || isDraft) && !isArchived">
      <button
        @click="openPreview()">預覽</button>
      <button  
        :disabled="!isReady"
        v-if="!isEdit"
        @click="editProduct(productInfo, 'create')">創建草稿</button>
      <button  
        :disabled="!isReady"
        v-else
        @click="editProduct(productInfo, 'save')">儲存草稿</button>
      <button  
        :disabled="!isReady"
        v-if="!isEdit"
        @click="editProduct(productInfo, 'add')">上架產品</button>
      <button  
        :disabled="!isReady"
        v-else
        @click="editProduct(productInfo, 'active')">上架產品</button>
    </div>
  </div>
</template>

<style scoped>
</style>
