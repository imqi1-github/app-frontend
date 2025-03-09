import type {RouteRecordRaw} from "vue-router";

export const weatherRoute: RouteRecordRaw[] = [
  {
    path: "",
    name: "weather-home",
    component: () => import("@views/weather/WeatherView.vue")
  },
]