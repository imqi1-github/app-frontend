import type {RouteRecordRaw} from "vue-router";

export const userRoute: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@views/user/LoginView.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@views/user/RegisterView.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/me",
    name: "me",
    component: () => import("@views/user/Me.vue"),
    meta: {
      requiresAuth: true
    }
  }
];
