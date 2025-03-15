<script lang="ts" setup>
import {onMounted, ref, toRaw, watch,} from "vue";
import {useRouter} from "vue-router";
import {getCoordinates, getWeatherNow,} from "@api/weather.ts";
import {useUserStore} from "@/stores/user.ts";
import {formatDateFromQWeather} from "@/utils/time"
import {formatCoordinates} from "@/utils/city.ts";
import {weatherRoute} from "@/routes/weatherRoute.ts";


const userStore = useUserStore();
const information = ref(null);
const weatherInformation = ref(null);
const positionInformation = ref(null);
const router = useRouter();

watch(() => [userStore.isLogin, userStore.user], () => {
  information.value = userStore.user?.information[0];
})

onMounted(() => {
  try {
    // 获取基础信息
    information.value = userStore.user?.information[0] || {};
    const city = information.value?.position_city || "秦皇岛";

    // 定义所有异步函数并立即执行
    const fetchData = () => {
      // 获取坐标
      getCoordinates(city)
          .then(result => {
            positionInformation.value = result;
            console.log("位置信息：", toRaw(positionInformation.value));
          })
          .catch(error => console.error("获取坐标失败：", error));

      // 获取当前天气
      getWeatherNow(city)
          .then(result => {
            weatherInformation.value = result;
            console.log("天气信息：", toRaw(weatherInformation.value));
          })
          .catch(error => console.error("获取当前天气失败：", error));
    };

    // 立即执行并行请求
    fetchData();
  } catch (error) {
    console.error("初始化时发生错误：", error);
  }
});

</script>
<template>
  <div class="w-full h-full flex items-start justify-center min-md:justify-around">
    <div class="max-w-225 w-full p-4 mt-6 space-y-2">
      <div class="text-xs text-gray-600">
        {{ information?.position_province || "河北省" }}
        {{ formatDateFromQWeather(weatherInformation?.updateTime) || "获取中" }}
        {{
          positionInformation?.["lat"] && positionInformation?.["lon"] && formatCoordinates(positionInformation?.["lat"], positionInformation?.["lon"]) || "获取中"
        }}
      </div>
      <div class="flex gap-5 items-center">
        <div class="text-2xl">{{ information?.position_city || "秦皇岛市" }}</div>
        <div class="rounded-2xl bg-blue-50 flex">
          <RouterLink v-for="route of weatherRoute"
                      :to="router.resolve({'name': route.name}).href"
                      class="px-3 py-1.5 min-w-16 text-center text-sm text-gray-700 rounded-2xl"
                      exact-active-class="bg-blue-500 text-white">
            {{ route.meta.title }}
          </RouterLink>
        </div>
      </div>
      <RouterView/>
    </div>
  </div>
</template>