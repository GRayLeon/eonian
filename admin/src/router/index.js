import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import NotFound from '../views/NotFound.vue'
import { useAuthStore } from '@/stores/auth'
import { useLoadStore } from '@/stores/load'
import { storeToRefs } from 'pinia'

const router = createRouter({
  history: createWebHistory('/admin/'),
  routes: [
    {
      path: '/',
      name:  '',
      component: HomeView,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('../components/HomeView.vue'),
        },
        {
          path: 'editor',
          name: 'editor',
          component: () => import('../components/EditorView.vue'),
        },
        {
          path: 'product',
          name: 'product',
          component: () => import('../components/ProductView.vue'),
          children: [
            {
              path: '',
              name: 'productList',
              component: () => import('../components/product/ProductList.vue')
            },
            {
              path: 'add',
              name: 'productAdd',
              component: () => import('../components/product/ProductEdit.vue')
            },
            {
              path: ':id',
              name: 'productEdit',
              component: () => import('../components/product/ProductEdit.vue')
            }
          ]
        },
        {
          path: 'project',
          name: 'project',
          component: () => import('../components/ProjectView.vue'),
          children: [
            {
              path: '',
              name: 'projectList',
              component: () => import('../components/project/ProjectList.vue')
            },
            {
              path: 'add',
              name: 'projectAdd',
              component: () => import('../components/project/ProjectEdit.vue')
            },
            {
              path: ':id',
              name: 'projectEdit',
              component: () => import('../components/project/ProjectEdit.vue')
            }
          ]
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('../components/NewsView.vue'),
          children: [
            {
              path: '',
              name: 'newsList',
              component: () => import('../components/news/NewsList.vue')
            },
            {
              path: 'add',
              name: 'newsAdd',
              component: () => import('../components/news/NewsEdit.vue')
            },
            {
              path: ':id',
              name: 'newsEdit',
              component: () => import('../components/news/NewsEdit.vue')
            }
          ]
        },
        {
          path: 'brand',
          name: 'brand',
          component: () => import('../components/BrandView.vue'),
          children: [
            {
              path: '',
              name: 'brandList',
              component: () => import('../components/brand/BrandList.vue')
            },
            {
              path: 'add',
              name: 'brandAdd',
              component: () => import('../components/brand/BrandEdit.vue')
            },
            {
              path: ':id',
              name: 'brandEdit',
              component: () => import('../components/brand/BrandEdit.vue')
            }
          ]
        },
        {
          path: 'size',
          name: 'size',
          component: () => import('../components/SizeView.vue'),
          children: [
            {
              path: '',
              name: 'sizeList',
              component: () => import('../components/size/SizeList.vue')
            },
            {
              path: 'add',
              name: 'sizeAdd',
              component: () => import('../components/size/SizeEdit.vue')
            },
            {
              path: ':id',
              name: 'sizeEdit',
              component: () => import('../components/size/SizeEdit.vue')
            }
          ]
        },
        {
          path: 'category',
          name: 'category',
          component: () => import('../components/CategoryView.vue'),
          children: [
            {
              path: '',
              name: 'categoryList',
              component: () => import('../components/category/CategoryList.vue')
            },
            {
              path: 'add',
              name: 'categoryAdd',
              component: () => import('../components/category/CategoryEdit.vue')
            },
            {
              path: ':id',
              name: 'categoryEdit',
              component: () => import('../components/category/CategoryEdit.vue')
            }
          ]
        },
        {
          path: 'region',
          name: 'region',
          component: () => import('../components/RegionView.vue'),
          children: [
            {
              path: '',
              name: 'regionList',
              component: () => import('../components/region/RegionList.vue')
            },
            {
              path: 'add',
              name: 'regionAdd',
              component: () => import('../components/region/RegionEdit.vue')
            },
            {
              path: ':id',
              name: 'regionEdit',
              component: () => import('../components/region/RegionEdit.vue')
            }
          ]
        },
        {
          path: 'account',
          name: 'account',
          component: () => import('../components/AccountView.vue'),
          children: [
            {
              path: '',
              name: 'accountList',
              component: () => import('../components/account/AccountList.vue')
            },
            {
              path: 'add',
              name: 'accountAdd',
              component: () => import('../components/account/AccountAdd.vue')
            },
            {
              path: ':type/:id',
              name: 'accountEdit',
              component: () => import('../components/account/AccountEdit.vue')
            }
          ]
        },
        {
          path: 'spec',
          name: 'spec',
          component: () => import('../components/SpecView.vue'),
          children: [
            {
              path: '',
              name: 'origin',
              component: () => import('../components/spec/EditOrigin.vue')
            },
            {
              path: 'appearance',
              name: 'appearance',
              component: () => import('../components/spec/EditAppearance.vue')
            },
            {
              path: 'functionality',
              name: 'functionality',
              component: () => import('../components/spec/EditFunctionality.vue')
            },
            {
              path: 'support',
              name: 'support',
              component: () => import('../components/spec/EditSupport.vue')
            },
            {
              path: 'specBrand',
              name: 'specBrand',
              component: () => import('../components/spec/EditBrand.vue')
            }
          ]
        },
        {
          path: 'pages',
          name: 'pages',
          component: () => import('../components/PagesView.vue'),
          children: [
            {
              path: '',
              name: 'index',
              component: () => import('../components/pages/EditIndex.vue')
            },
            {
              path: 'vision',
              name: 'vision',
              component: () => import('../components/pages/EditVision.vue')
            },
            {
              path: 'partner',
              name: 'partner',
              component: () => import('../components/pages/EditPartner.vue')
            },
            {
              path: 'contact',
              name: 'contactPage',
              component: () => import('../components/pages/EditContact.vue')
            },
          ]
        },
        {
          path: 'inquiry',
          name: 'inquiry',
          component: () => import('../components/InquiryView.vue'),
          children: [
            {
              path: '',
              name: 'inquiryList',
              component: () => import('../components/inquiry/InquiryList.vue')
            },
            {
              path: ':id',
              name: 'inquiryEdit',
              component: () => import('../components/inquiry/InquiryEdit.vue')
            }
          ]
        },
      ]
    },
    {
      path: '/login',
      name:  'login',
      component: () => import('../components/LoginView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'notFound',
      component: NotFound
    }
  ]
})

router.beforeEach( async (to, from, next) => {
  const authStore = useAuthStore()
	const { isLogin, checkLogin, getProfile } = storeToRefs(authStore)

  const loadStore = useLoadStore()
	const { isLoading } = storeToRefs(loadStore)

    isLoading.value = true
    await checkLogin.value()
    if (isLogin.value) {
      next()
    } else {
      if (to.name === 'login') {
        next()
      } else {
        next('/login')
      }
    }
})

export default router
