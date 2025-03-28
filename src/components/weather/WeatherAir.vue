<script lang="ts" setup>
import {onMounted, ref, toRaw} from "vue";
import {getCurrentAirQuality, getDailyAirQuality} from "@api/weather.ts";
import {useUserStore} from "@/stores/user.ts";
import Ring from "@components/weather/charts/Ring.vue";
import {formatOnlyDateFromQWeather, getDayAfter} from "@/utils/time.ts";

const userStore = useUserStore();
const airQuality = ref<any>(null);
const dailyQuality = ref<any>(null);
const city = userStore.user?.information.position_city || "秦皇岛";


onMounted(() => {
  getCurrentAirQuality(city)
      .then(result => {
        airQuality.value = result;
        console.log("天气质量：", toRaw(airQuality.value));
      })
      .catch(error => console.error("获取天气质量失败：", error));
  getDailyAirQuality(city)
      .then(result => {
        dailyQuality.value = result;
        console.log("每日天气质量：", toRaw(dailyQuality.value));
      })
      .catch(error => console.error("获取每日天气质量失败：", error))

})
</script>
<template>
  <div class="space-y-10">
    <div class="bg-white p-4 rounded-2xl mt-6">
      <div class="text-center my-4 text-xl">天气质量</div>
      <div class="flex p-4 justify-between gap-x-3 gap-y-6 items-center max-md:flex-col">
        <Ring
            :category="airQuality?.indexes[0].category"
            :color="`rgba(${airQuality?.indexes[0].color.red},${airQuality?.indexes[0].color.green},${airQuality?.indexes[0].color.blue},${airQuality?.indexes[0].color.alpha})`"
            :value="Number(airQuality?.indexes[0].aqi || 0)"
        />
        <div v-if="airQuality?.pollutants" class="grid grid-cols-2 gap-2 sm:max-md:grid-cols-3">
          <div v-for="(item, index) in airQuality?.pollutants || []" :key="index"
               class="flex flex-col gap-y-1 items-center">
            <div class="">{{ item.concentration.value }}<sub>{{ item.concentration.unit }}</sub></div>
            <div class="w-30 max-md:w-40 h-2 rounded bg-gray-100 overflow-hidden relative">
              <div
                  :style="`width: ${Number(item.concentration.value) / 3}%; background-color: ${item.concentration.value && item.concentration.value < 50 ? 'oklch(0.765 0.236 142.126)' : item.concentration.value < 100 ? 'orange' : item.concentration.value < 150 ? 'red' : item.concentration.value < 200 ? 'purple' : 'brown'}`"
                  class="absolute w-25 h-2 left-0 top-0 bottom-0 bg-gray-300 rounded duration-300"></div>
            </div>
            <div class="text-gray-600">{{ item.name }}</div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-x-2 gap-y-8 sm:max-md:grid-cols-3 animate-pulse" v-else>
          <div class="w-30 max-md:w-40 h-2 rounded bg-gray-200 overflow-hidden relative">
          </div>
          <div class="w-30 max-md:w-40 h-2 rounded bg-gray-200 overflow-hidden relative">
          </div>
          <div class="w-30 max-md:w-40 h-2 rounded bg-gray-200 overflow-hidden relative">
          </div>
          <div class="w-30 max-md:w-40 h-2 rounded bg-gray-200 overflow-hidden relative">
          </div>
          <div class="w-30 max-md:w-40 h-2 rounded bg-gray-200 overflow-hidden relative">
          </div>
          <div class="w-30 max-md:w-40 h-2 rounded bg-gray-200 overflow-hidden relative">
          </div>
        </div>
        <div v-if="airQuality?.indexes[0].health" class="max-w-2/5 space-y-5 max-md:max-w-4/5">
          <div class="text-lg">{{ airQuality?.indexes[0].health.effect }}</div>
          <div class="text-gray-700">{{ airQuality?.indexes[0].health.advice.generalPopulation }}</div>
        </div>
        <div class="space-y-5 animate-pulse" v-else>
          <div class="bg-gray-200 rounded-xl h-10 w-75"></div>
          <div class="bg-gray-100 rounded-xl h-5 w-50"></div>
        </div>
      </div>
    </div>
    <div v-if="dailyQuality?.days" class="bg-white p-8 rounded-2xl mt-6 space-y-6">
      <div class="text-center my-4 text-xl">空气质量预报</div>
      <div v-for="(item, index) of dailyQuality?.days || []" :key="index"
           class="flex gap-5 items-center justify-between">
        <div class="">
          <div class="text-base">{{ getDayAfter(index) }}</div>
          <div class="text-gray-600">{{ formatOnlyDateFromQWeather(item.forecastStartTime) }}</div>
        </div>
        <div class="relative bg-gray-100 rounded overflow-hidden max-w-100 w-full h-2 max-sm:hidden">
          <div
              :style="`width: ${Number(item.indexes[0].aqi) / 3}%; background: rgba(${item.indexes[0].color.red}, ${item.indexes[0].color.green}, ${item.indexes[0].color.blue}, ${item.indexes[0].color.alpha})`"
              class="absolute left-0 top-0 bottom-0 bg-gray-300 rounded"
          />
        </div>
        <div class="text-base">
          {{ item.indexes[0].aqi }}
        </div>
        <div class="text-base">
          {{ item.indexes[0].category }}
        </div>
      </div>
      <div class="mt-8 text-sm text-gray-700">
        * 和风天气仅提供 3 天范围的免费空气质量预报。
      </div>
    </div>
    <div class="bg-white h-100 rounded-2xl p-8 mt-6 animate-pulse" v-else>
    </div>
    <div v-if="airQuality?.stations" class="p-12 rounded-2xl bg-white">
      <div class="text-xl">数据监测点：</div>
      <div class="flex gap-x-10 gap-y-5 flex-wrap mt-8">
        <div class="px-10 py-4 text-lg bg-gray-100 rounded-4xl overflow-hidden" v-for="(item, index) in airQuality?.stations || []" :key="index">
          {{ item.name }}
        </div>
      </div>
    </div>
    <div class="bg-white h-60 rounded-2xl p-8 mt-6 animate-pulse" v-else>
    </div>
    <div class="text-sm text-gray-700">
      * 注：本页数据来源于 <a class="text-blue-400 hover:underline" href="https://dev.qweather.com"
                             target="_blank">和风天气</a>。<br/>由于和风天气仅能通过经纬度获取空气质量，而经纬度的精度较低，因此获取到的数据不准确。<br/>若要获取准确的空气质量，建议前往
      <a class="text-blue-400 hover:underline" href="https://www.cnemc.cn/" target="_blank">中国环境监测总站</a> 查询。
    </div>
  </div>
</template>