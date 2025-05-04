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
    meta: {
      requiresAuth: false
    },
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
        redirect: {name: 'weather-home'},
        meta: {
          title: '天气'
        }
      },
      {
        path: "/ai",
        name: 'ai',
        component: () => import("@views/root/Ai.vue" as any),
        meta: {
          title: '智能导游'
        }
      },
      {
        path: "post",
        name: "post",
        children: postRoute,
        component: () => import("@views/root/PostView.vue"),
        redirect: {name: 'post-home'},
        meta: {
          title: '帖子'
        }
      },
      {
        path: "spot",
        name: "spot",
        children: spotRoute,
        component: () => import("@views/root/SpotView.vue"),
        redirect: {name: 'spot-home'},
        meta: {
          title: '景点'
        }
      },
      {
        path: "map",
        name: "map",
        component: () => import("@views/root/MapView.vue" as any),
        children: [
          {
            path: 'choose',
            name: 'map-choose',
            component: () => import("@views/root/MapView.vue" as any),
            meta: {
              title: '选择位置'
            }
          }
        ],
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
    redirect: {name: 'dashboard-home'},
    meta: {
      requiresAuth: "admin",
      title: '仪表盘'
    },
    children: dashboardRoute,
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import("@views/NotFound.vue"),
    meta: {
      title: '页面未找到 '
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to) => {
  const userStore = useUserStore();

  document.title = to.meta.title as string || '秦皇岛本地宝';

  await userStore.checkLoginStatus();

  const isLogin = userStore.isLogin;
  const role = userStore.role;
  const requireAuth = to.meta.requiresAuth;

  if (to.name === 'login' && isLogin) {
    return {name: 'me'}
  }

  if (requireAuth === 'user' && !isLogin) {
    return {name: 'login'}
  }

  if (to.name === 'dashboard-login' && isLogin && role === 'admin') {
    return {name: 'dashboard'}
  }

  if (
    typeof to.name === 'string' &&
    to.name.startsWith('dashboard-') &&
    to.name !== 'dashboard-login' &&
    role !== 'admin'
  ) {
    return {name: 'dashboard-login'};
  }

  return true;
});


export default router
