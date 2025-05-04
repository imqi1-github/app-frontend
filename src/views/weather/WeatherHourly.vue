<script lang="ts" setup>
import WeatherHourlyChart from "@components/charts/WeatherHourlyChart.vue";
import {onMounted, ref, toRaw} from "vue";
import {getWeatherHourly} from "@api/weather.ts";
import {useUserStore} from "@/stores/user.ts";
import WeatherHourlyHumidityChart from "@components/charts/WeatherHourlyHumidityChart.vue";
import WeatherHourlyPrecipChart from "@components/charts/WeatherHourlyPrecipChart.vue";
import WeatherHourlyWindChart from "@components/charts/WeatherHourlyWindChart.vue";

const userStore = useUserStore();
const weatherHourly = ref<any>(null);
const city = userStore.user?.information.position_city || "秦皇岛";
onMounted(() => {
  // 获取小时天气预报
  getWeatherHourly(city)
      .then(result => {
        weatherHourly.value = result;
        console.log("小时天气预报：", toRaw(weatherHourly.value));
      })
      .catch(error => console.error("获取小时天气失败：", error));

})
</script>
<template>
  <div class="space-y-10">
    <div class="bg-white p-4 rounded-2xl mt-6">
      <div class="text-center my-4 text-xl">每小时天气预报</div>
      <WeatherHourlyChart :weatherHourly="weatherHourly"/>
    </div>
    <div class="my-12 w-full h-px border-b-1 border-b-gray-300"></div>
    <div class="my-12 text-center text-2xl">更多每小时预报</div>
    <div class="bg-white p-4 rounded-2xl mt-6">
      <div class="text-center my-4 text-xl">每小时湿度预报</div>
      <WeatherHourlyHumidityChart :weatherHourly="weatherHourly"/>
    </div>
    <div class="bg-white p-4 rounded-2xl mt-6">
      <div class="text-center my-4 text-xl">每小时降水量预报</div>
      <WeatherHourlyPrecipChart :weatherHourly="weatherHourly"/>
    </div>
    <div class="bg-white p-4 rounded-2xl mt-6">
      <div class="text-center my-4 text-xl">每小时大风预报</div>
      <WeatherHourlyWindChart :weatherHourly="weatherHourly"/>
    </div>
    <div class="mt-8 text-sm text-gray-700">
      * 时间后面的“+1”符号代表是第二天。
    </div>
  </div>
</template>