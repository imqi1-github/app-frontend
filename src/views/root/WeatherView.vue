<script lang="ts" setup>
import {onMounted, ref, toRaw, watch,} from "vue";
import {useRouter} from "vue-router";
import {getCoordinates, getWeatherNow,} from "@api/weather.ts";
import {useUserStore} from "@/stores/user.ts";
import {formatDateFromQWeather} from "@/utils/time.ts"
import {formatCoordinates} from "@/utils/city.ts";
import {weatherRoute} from "@/routes/weatherRoute.ts";


const userStore = useUserStore();
const information = ref(null);
const weatherInformation = ref(null);
const positionInformation = ref(null);
const router = useRouter();

watch(() => [userStore.isLogin, userStore.user], () => {
  information.value = userStore.user?.information;
  city.value = location ? (information.value?.position_city ? information.value?.position_city + location : location) : information.value?.position_city || "秦皇岛"
  fetchData();
})

const url = new URL(window.location.href)
const location = url.searchParams.has("location") ? url.searchParams.get("location") : null;
const city = ref(location ? (information.value?.position_city ? information.value?.position_city + location : location) : information.value?.position_city || "秦皇岛")

const fetchData = () => {
  try {

    const fetchData = () => {

      getCoordinates(city.value)
          .then(result => {
            positionInformation.value = result;
            console.log("位置信息：", toRaw(positionInformation.value));
          })
          .catch(error => console.error("获取坐标失败：", error));


      getWeatherNow(city.value)
          .then(result => {
            weatherInformation.value = result;
            console.log("天气信息：", toRaw(weatherInformation.value));
          })
          .catch(error => console.error("获取当前天气失败：", error));
    };


    fetchData();
  } catch (error) {
    console.error("初始化时发生错误：", error);
  }
}

onMounted(() => {
  information.value = userStore.user?.information;
  if (!information.value) {
    return;
  }
  fetchData();
});

</script>
<template>
  <div class="size-full flex items-start justify-center min-md:justify-around">
    <div class="max-w-225 w-full p-4 mt-6 space-y-2">
      <div class="text-xs text-gray-600">
        {{ information?.position_province || "河北省" }}
        {{ formatDateFromQWeather(weatherInformation?.updateTime) || "获取中" }}
        {{
          positionInformation?.["lat"] && positionInformation?.["lon"] && formatCoordinates(positionInformation?.["lat"], positionInformation?.["lon"]) || "获取中"
        }}
        <RouterLink v-if="positionInformation" :to="`/map?location=${[positionInformation['lon'], positionInformation['lat']]}&zoom=16`"
                    class="text-blue-500 hover:text-blue-600">查看位置
        </RouterLink>
      </div>
      <div class="flex gap-5 items-center">
        <div class="text-2xl line-clamp-1 max-w-[15em]">{{ city }}</div>
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