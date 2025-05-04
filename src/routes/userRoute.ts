import type {RouteRecordRaw} from "vue-router";

export const userRoute: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@views/user/LoginView.vue"),
    meta: {
      requiresAuth: false,
      title: "登录"
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@views/user/RegisterView.vue"),
    meta: {
      requiresAuth: false,
      title: "注册"
    }
  },
  {
    path: "/me",
    name: "me",
    component: () => import("@views/user/Me.vue"),
    meta: {
      requiresAuth: "user",
      title: "账户设置"
    }
  },
  {
    path: "my-uploads",
    name: "my-uploads",
    component: () => import("@views/user/Uploads.vue"),
    meta: {
      requiresAuth: "user",
      title: "我的图片"
    }
  }
];