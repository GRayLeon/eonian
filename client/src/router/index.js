import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/IndexView.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: () => import('../views/HomeView.vue'),
      children: [
        {
          path: 'product',
          name: 'product',
          component: () => import('../components/Product.vue'),
          children: [
            {
              path: '',
              name: 'productList',
              component: () => import('../components/product/ProductList.vue')
            },
            {
              path: ':id',
              name: 'productInside',
              component: () => import('../components/product/ProductInside.vue')
            }
          ]
        },
        {
          path: 'project',
          name: 'project',
          component: () => import('../components/Project.vue'),
          children: [
            {
              path: '',
              name: 'projectList',
              component: () => import('../components/project/ProjectList.vue')
            },
            {
              path: ':id',
              name: 'projectInside',
              component: () => import('../components/project/ProjectInside.vue')
            }
          ]
        },
        {
          path: 'brand',
          name: 'brand',
          component: () => import('../components/Brand.vue'),
          children: [
            {
              path: '',
              name: 'brandList',
              component: () => import('../components/brand/BrandList.vue')
            },
            {
              path: ':id',
              name: 'brandInside',
              component: () => import('../components/brand/BrandInside.vue')
            }
          ]
        },
        {
          path: 'news',
          name: 'news',
          component: () => import('../components/News.vue'),
          children: [
            {
              path: '',
              name: 'newsList',
              component: () => import('../components/news/NewsList.vue')
            },
            {
              path: ':id',
              name: 'newsInside',
              component: () => import('../components/news/NewsInside.vue')
            }
          ]
        },
        {
          path: 'contact',
          name: 'contact',
          component: () => import('../components/Contact.vue'),
        },
        {
          path: 'about',
          name: 'about',
          component: () => import('../components/About.vue'),
        }
      ]
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
