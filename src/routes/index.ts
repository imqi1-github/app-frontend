// index.js
import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import("@views/HomeView.vue")
  },
  {
    path: '/number',
    name: 'number',
    component: () => import("@views/NumberView.vue")
  },
  {
    path: "/user",
    name: "user",
    children: [
      {
        path: "/login",
        name: "login",
        component: () => import("@views/user/LoginView.vue")
      },
      {
        path: '/:pathMatch(.*)*',  // 捕获所有路径
        name: 'NotFound',
        component:  () => import("@/NotFound.vue")  // 404页面
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
