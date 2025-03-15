import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {userRoute} from './userRoute'
import {dashboardRoute} from './dashboardRoute'
import {weatherRoute} from './weatherRoute'
import {useUserStore} from "@/stores/user.ts";

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
        children: weatherRoute,
        component: () => import("@views/weather/WeatherView.vue")
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


router.beforeEach((to, _, next) => {
  const userStore = useUserStore();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!userStore.isLogin) {
      // 如果用户未登录，阻止跳转到 /me
      next('/login');
    } else {
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (userStore.isLogin) {
      // 如果用户已登录，阻止跳转到 /login 或 /register
      next('/me');
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
