import type {RouteRecordRaw} from "vue-router";

export const spotRoute: RouteRecordRaw[] = [
  {
    path: "",
    name: "spot-home",
    component: () => import("@views/spot/Home.vue"),
    meta: {
      title: "首页 - 景点浏览"
    }
  },
  {
    path: "/spot/:id",
    name: "spot-detail",
    component: () => import("@views/spot/Spot.vue"),
    meta: {
      title: "景点详情"
    }
  }
]