import {createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import {userRoute} from './userRoute'
import {dashboardRoute} from './dashboardRoute'
import {weatherRoute} from './weatherRoute'
import {postRoute} from "./postRoute"
import {spotRoute} from "./spotRoute"
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
        component: () => import("@views/root/HomeView.vue"),
        meta: {
          title: '首页'
        }
      },
      {
        path: 'number',
        name: 'number',
        component: () => import("@views/NumberView.vue"),
        meta: {
          title: '数字'
        }
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
        component: () => import("@views/root/WeatherView.vue"),
        meta: {
          title: '天气'
        }
      },
      {
        path: "post",
        name: "post",
        children: postRoute,
        component: () => import("@views/root/PostView.vue"),
        meta: {
          title: '帖子'
        }
      },
      {
        path: "spot",
        name: "spot",
        children: spotRoute,
        component: () => import("@views/root/SpotView.vue"),
        meta: {
          title: '景点'
        }
      },
      {
        path: "map",
        name: "map",
        component: () => import("@views/root/MapView.vue" as any),
        meta: {
          title: '地图'
        }
      }
    ]
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import("@views/root/Dashboard.vue"),
    meta: {
      requiresAuth: true,
      title: '仪表盘'
    },
    children: dashboardRoute,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import("@views/NotFound.vue"),  // 404页面
    meta: {
      title: '页面未找到 '
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
  document.title = to.meta.title as string || 'Vue App'; // 默认标题为 'Vue App'
  const userStore = useUserStore();

  // 确保用户状态已初始化
  await userStore.checkLoginStatus();

  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (userStore.isLogin !== true) { // 明确检查 isLogin 是否为 true
      // 未登录，重定向到 login 并带上 from 参数
      next("/login",);
    } else {
      // 已登录，继续导航
      next();
    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (userStore.isLogin === true) {
      // 已登录，重定向到 /me
      next("/me");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router
