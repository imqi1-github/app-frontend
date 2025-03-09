import type {RouteRecordRaw} from "vue-router";

export const userRoute: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "login",
    component: () => import("@views/user/LoginView.vue")
  },
  {
    path: "/register",
    name: "register",
    component: () => import("@views/user/RegisterView.vue")
  },
  {
    path: "/me",
    name: "me",
    component: () => import("@views/user/Me.vue")
  }
];