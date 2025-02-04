// index.js
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import("@/views/HomeView.vue")
  },
  {
    path: '/number',
    name: 'number',
    component: () => import("@/views/NumberView.vue")
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
