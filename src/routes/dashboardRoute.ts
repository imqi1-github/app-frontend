import type {RouteRecordRaw} from "vue-router";
import {RiAncientGateLine, RiHomeLine} from "@remixicon/vue";

export const dashboardRoute: RouteRecordRaw[] = [
  {
    path: "",
    name: "dashboard-home",
    component: () => import("@views/dashboard/Home.vue"),
    meta: {
      title: "首页 - 仪表盘",
      icon: RiHomeLine,
    }
  },
  {
    path: "manage",
    name: "dashboard-spot",
    component: () => import("@views/dashboard/ManageSpot.vue"),
    meta: {
      title: "管理景点 - 仪表盘",
      icon: RiAncientGateLine
    }
  },
  {
    path: "setting",
    name: "dashboard-setting",
    component: () => import("@views/dashboard/Setting.vue"),
    meta: {
      title: "设置 - 仪表盘"
    }
  },
  {
    path: "add-spot",
    name: "dashboard-add-spot",
    component: () => import("@views/dashboard/SpotEdit.vue"),
    meta: {
      title: "添加景点"
    }
  }
]