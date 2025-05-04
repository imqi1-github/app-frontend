import type {RouteRecordRaw} from "vue-router";

export const weatherRoute: RouteRecordRaw[] = [
  {
    path: "",
    name: "weather-home",
    component: () => import("@views/weather/WeatherHome.vue"),
    meta: {
      title: '天气'
    }
  },
  {
    path: "hourly",
    name: "weather-hourly",
    component: () => import("@views/weather/WeatherHourly.vue"),
    meta: {
      title: '小时预报'
    }
  },
  {
    path: "air",
    name: "weather-air",
    component: () => import("@views/weather/WeatherAir.vue"),
    meta: {
      title: '空气质量'
    }
  },
  {
    path: "indices",
    name: "weather-indices",
    component: () => import("@views/weather/WeatherIndices.vue"),
    meta: {
      title: '生活指数'
    }
  }
]