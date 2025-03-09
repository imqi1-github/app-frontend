import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {userRoute} from './userRoute'
import {dashboardRoute} from './dashboardRoute'
import {weatherRoute} from './weatherRoute'

const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard/login',
    name: 'dashboard-login',
    component: () => import("@views/dashboard/Login.vue"),
    children: []
  },
  {
    path: '/',
    component: () => import("@views/Main.vue"),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import("@views/HomeView.vue")
      },
      {
        path: 'number',
        name: 'number',
        component: () => import("@views/NumberView.vue")
      },
      {
        path: 'user',
        name: 'user',
        children: userRoute
      },
      {
        path: "weather",
        name: "weather",
        children: weatherRoute
      },
    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import("@views/Dashboard.vue"),
    children: dashboardRoute,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import("@views/NotFound.vue")  // 404页面
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
