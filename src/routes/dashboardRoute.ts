import type {RouteRecordRaw} from "vue-router";

export const dashboardRoute: RouteRecordRaw[] = [
  {
    path: "",
    name: "dashboard-home",
    component: () => import("@views/dashboard/Home.vue")
  },
  {
    path: "statistics",
    name: "dashboard-statistics",
    component: () => import("@views/dashboard/Statistics.vue")
  },
  {
    path: "manage",
    name: "dashboard-manage",
    component: () => import("@views/dashboard/Manage.vue")
  },
  {
    path: "setting",
    name: "dashboard-setting",
    component: () => import("@views/dashboard/Setting.vue")
  },
]