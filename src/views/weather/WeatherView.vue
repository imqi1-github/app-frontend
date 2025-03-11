<script setup lang="ts">
import {computed, onMounted, ref, toRaw, watch} from "vue";
import {
  getWeatherNow,
  getCoordinates,
  getCurrentAirQuality,
  getWeatherHourly,
  getMinutelyPrecipitation,
  getSevenDaysWeather,
  getIndices,
} from "@api/weather.ts";
import {useUserStore} from "@/stores/user.ts";
import {formatDateFromQWeather, formatDateToChinese, formatTimeFromQWeather, getDayAfter} from "@/utils/time"
import {formatCoordinates} from "@/utils/city.ts";
import {getAQILevel} from "@/utils/weather"

const userStore = useUserStore();
const information = ref(null);
const weatherInformation = ref(null);
const positionInformation = ref(null);
const airQuality = ref<any>("未获取到空气质量");
const weatherHourly = ref<any>(null);
const minutelyPrecipitation = ref<any>(null);
const sevenDaysWeather = ref<any>(null);
const indices = ref<any>(null);

const minimumTemp = computed(() => {
  const numbers = weatherHourly.value?.hourly
      ? (weatherHourly.value.hourly as { temp: number }[]).map(item => item.temp)
      : [0];
  return Math.min(...numbers);
});

const minimumDailyTemp = computed(() => {
  const numbers = sevenDaysWeather.value?.daily
      ? (sevenDaysWeather.value.daily as { tempMax: number }[]).map(item => item.tempMax)
      : [0];
  return Math.min(...numbers);
})


const menus = [
  {
    name: "天气",
    path: "/weather",
  },
  {
    name: "天气",
    path: "/",
  },
]

watch(() => [userStore.isLogin, userStore.user], () => {
  information.value = userStore.user?.information[0];
})

onMounted(async () => {
  information.value = userStore.user?.information[0] || {};
  positionInformation.value = await getCoordinates(information.value?.position_city || "秦皇岛")
  console.log("位置信息：", toRaw(positionInformation.value));
  weatherInformation.value = await getWeatherNow(information.value?.position_city || "秦皇岛");
  console.log("天气信息：", toRaw(weatherInformation.value));
  airQuality.value = await getCurrentAirQuality(information.value?.position_city || "秦皇岛");
  console.log("空气质量：", toRaw(airQuality.value));
  weatherHourly.value = await getWeatherHourly(information.value?.position_city || "秦皇岛");
  console.log("小时天气预报：", toRaw(weatherHourly.value));
  minutelyPrecipitation.value = await getMinutelyPrecipitation(information.value?.position_city || "秦皇岛");
  console.log("分钟降水预告：", toRaw(minutelyPrecipitation.value));
  sevenDaysWeather.value = await getSevenDaysWeather(information.value?.position_city || "秦皇岛");
  console.log("7天天气预报：", toRaw(sevenDaysWeather.value));
  indices.value = await getIndices(information.value?.position_city || "秦皇岛");
  console.log("天气指数：", toRaw(indices.value));
})

</script>
<template>
  <div class="bg-white w-full h-full flex items-start justify-center">
    <div class="max-w-225 w-full p-4 pb-8 mt-6">
      <div class="text-xs text-gray-600">
        {{ information?.position_province || "河北省" }}
        {{ formatDateFromQWeather(weatherInformation?.updateTime) || "获取中" }}
        {{
          positionInformation?.["lat"] && positionInformation?.["lon"] && formatCoordinates(positionInformation?.["lat"], positionInformation?.["lon"]) || "获取中"
        }}
      </div>
      <div class="flex gap-5 items-center mt-2">
        <div class="text-2xl">{{ information?.position_city || "秦皇岛市" }}</div>
        <div class="rounded-2xl bg-blue-50 flex">
          <RouterLink v-for="menu of menus"
                      :to="menu.path"
                      class="px-2 py-1.5 min-w-16 text-center text-sm text-gray-700 rounded-2xl"
                      exact-active-class="bg-blue-500 text-white">
            {{ menu.name }}
          </RouterLink>
        </div>
      </div>
      <div class="mt-6 bg-[linear-gradient(225deg,_#fee5ca,_#e9f0ff_55%,_#dce3fb)] p-4 rounded-xl"
           v-if="weatherInformation">
        <div class="text-right text-xs">{{ formatTimeFromQWeather(weatherInformation?.updateTime) ?? "获取中" }}</div>
        <div class="w-full relative mt-6">
          <div v-if="airQuality?.indexes?.[0]?.aqi"
               class="absolute -top-2 right-0 px-1.5 py-0.5 text-right rounded-lg w-fit text-white"
               :style="`background:${getAQILevel(airQuality?.indexes?.[0]?.aqi).colorClass}`"> AQI
            {{ airQuality?.indexes?.[0]?.aqi }} {{ airQuality?.indexes?.[0]?.category }}
          </div>
          <div class="grid grid-cols-2 gap-x-3 items-center">
            <div class="justify-self-end">
              <i class="text-6xl" :class="`qi-${weatherInformation?.now?.icon}-fill`"
                 v-if="weatherInformation?.now?.icon"></i>
            </div>
            <div class="justify-self-start flex flex-col">
              <div class="text-6xl" v-if="weatherInformation?.now?.temp">{{ weatherInformation?.now?.temp }}&deg;</div>
              <div class="text-2xl" v-if="weatherInformation?.now?.text">{{ weatherInformation?.now?.text }}</div>
            </div>
          </div>
        </div>
        <div class="mt-6 text-center text-sm" v-if="airQuality?.indexes?.[0]?.health?.effect">
          {{ airQuality?.indexes?.[0]?.health?.effect }}
        </div>
        <div class="flex gap-2 items-center p-4 justify-around mt-8 bg-gray-200/40 rounded-2xl flex-wrap">
          <div class="flex flex-col" v-if="weatherInformation?.now?.windScale">
            <div class="text-lg text-gray-800">{{ weatherInformation?.now?.windScale }}级</div>
            <div class="text-base text-gray-500" v-if="weatherInformation?.now?.windDir">
              {{ weatherInformation?.now?.windDir }}
            </div>
            <div class="text-base text-gray-500" v-else>风力等级</div>
          </div>
          <div class="flex flex-col" v-if="weatherInformation?.now?.windSpeed">
            <div class="text-lg text-gray-800">{{ weatherInformation?.now?.windSpeed }}km/h</div>
            <div class="text-base text-gray-500">风速</div>
          </div>
          <div class="flex flex-col" v-if="weatherInformation?.now?.humidity">
            <div class="text-lg text-gray-800">{{ weatherInformation?.now?.humidity }}%</div>
            <div class="text-base text-gray-500">相对湿度</div>
          </div>
          <div class="flex flex-col" v-if="weatherInformation?.now?.feelsLike">
            <div class="text-lg text-gray-800">{{ weatherInformation?.now?.feelsLike }}&deg;C</div>
            <div class="text-base text-gray-500">体感温度</div>
          </div>
          <div class="flex flex-col" v-if="weatherInformation?.now?.vis">
            <div class="text-lg text-gray-800">{{ weatherInformation?.now?.vis }}km</div>
            <div class="text-base text-gray-500">能见度</div>
          </div>
          <div class="flex flex-col" v-if="weatherInformation?.now?.precip">
            <div class="text-lg text-gray-800">{{ weatherInformation?.now?.precip }}mm/h</div>
            <div class="text-base text-gray-500">降水量</div>
          </div>
          <div class="flex flex-col" v-if="weatherInformation?.now?.pressure">
            <div class="text-lg text-gray-800">{{ weatherInformation?.now?.pressure }}hPa</div>
            <div class="text-base text-gray-500">大气压强</div>
          </div>
        </div>
        <div class="text-right text-xs text-gray-400 mt-3">* 数据来源于<a class="text-blue-400 hover:underline"
                                                                          :href="weatherInformation?.fxLink"
                                                                          target="_blank">和风天气</a></div>
        <div class="text-right text-xs text-gray-400 mt-3" v-if="!userStore.isLogin">* 由于你未登录，城市默认展示秦皇岛市，可
          <RouterLink to="/login" class="text-blue-400 hover:underline">登录</RouterLink>
          后设置自定义城市
        </div>
      </div>
      <div
          class="mt-6 bg-[linear-gradient(225deg,_#fee5ca,_#e9f0ff_55%,_#dce3fb)] p-16 rounded-xl flex items-center justify-center"
          v-else>
        <div class="relative w-full flex flex-col items-center gap-4">
          <div class="flex items-center justify-center">
            <div class="size-32 bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
          <div class="absolute w-20 h-5 -top-6 right-0 size-2 bg-red-200 rounded-2xl animate-pulse"></div>
          <div class="w-64 h-4 bg-gray-200 rounded-xl"></div>
          <div class="w-full h-20 bg-gray-200 rounded-3xl"></div>
        </div>
      </div>
      <div class="bg-zinc-50 w-full p-4 mt-4 rounded-2xl" v-if="weatherInformation">
        <div class="text-center text-lg">24小时天气预报</div>
        <div class="flex justify-around items-end pt-12 gap-0.5 overflow-hidden">
          <div class="flex flex-col items-center gap-1.5 max-[850px]:even:hidden"
               v-for="forecast of weatherHourly?.hourly">
            <div class="">{{ forecast?.temp }}&deg;</div>
            <div class="w-2 bg-blue-600 rounded"
                 :style="`height: ${16 + 4 * ((forecast?.temp||1) - minimumTemp)}px`"></div>
            <i class="text-xl text-blue-400" v-if="forecast?.icon" :class="`qi-${forecast?.icon}-fill`"></i>
            <div class="flex flex-col items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                   class="size-4 fill-gray-500" :style="`rotate: ${90 + Number(forecast?.wind360)}deg`">
                <path
                    d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/>
              </svg>
              <div class="text-xs text-gray-500">{{ forecast?.windSpeed }}pm</div>
            </div>
          </div>
        </div>
      </div>
      <div class="bg-zinc-50 w-full mt-4 p-4 rounded-2xl h-50 flex" v-else>
        <div class="mt-auto w-full flex gap-0.5 justify-around">
          <div class="w-2 h-16 bg-blue-200 rounded animate-pulse"
               v-for="_ of Array.from({length: 24}, (_, i) => i)"></div>
        </div>
      </div>
      <div class="mt-6 bg-gray-50 w-full rounded-2xl" v-if="sevenDaysWeather">
        <div class="text-center text-xl p-4">7天天气预报</div>
        <div class="px-4 py-2 flex items-center justify-between gap-10 w-fit max-md:gap-4"
             v-for="(weather, index) of sevenDaysWeather.daily" :key="index">
          <div class="flex flex-col">
            <div class="text-lg">{{ getDayAfter(index) }}</div>
            <div class="text-sm text-gray-500">{{ formatDateToChinese(weather.fxDate) }}</div>
          </div>
          <div class="">
            <i class="text-3xl" :class="`qi-${weather.iconDay}-fill `"></i>
          </div>
          <div class="flex justify-start mr-auto items-center flex-auto gap-2 relative"
               :style="`transform: translateX(${-8 * (Number(weather.tempMin)-minimumDailyTemp)}px)`">
            <span class="text-base">{{ weather.tempMax }}&deg;</span>
            <div class="h-2 bg-[linear-gradient(to_right,#F18360,#427BFF)] rounded md:block max-md:hidden"
                 :style="`width:${(weather.tempMax - weather.tempMin)*16}px`"></div>
            <div class="h-2 bg-[linear-gradient(to_right,#F18360,#427BFF)] rounded md:hidden max-md:block"
                 :style="`width:${(weather.tempMax - weather.tempMin)*8}px`"></div>
            <span class="text-base">{{ weather.tempMin }}&deg;</span>
          </div>
        </div>
      </div>
      <div class="mt-6 p-4 bg-gray-50 w-full rounded-2xl flex flex-col gap-2 pt-18" v-else>
        <div class="animate-pulse flex gap-12 items-center"
             v-for="_ of Array.from({length: 7}, (_, item) => item)">
          <div class="text-lg w-16 h-4 rounded-2xl bg-gray-200"></div>
          <div class="text-gray-600">···</div>
          <div class="w-32 h-2 bg-blue-200 rounded-2xl"></div>
        </div>
      </div>
      <div class="mt-6 p-4 w-full rounded-2xl bg-gray-50" v-if="indices">
        <div class="text-center text-2xl mt-4   mb-9">生活指数</div>
        <div class="grid grid-cols-2 gap-2 max-md:grid-cols-1">
          <div class="flex gap-4 items-center bg-white px-4 py-5 rounded-2xl" v-for="item of indices.daily">
            <div class="size-12 bg-gray-100 rounded-full"></div>
            <div class="flex flex-col">
              <div class="text-xl">{{ item.name }}</div>
              <div class="text-sm text-gray-700">{{ item.category }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-6 p-4 w-full rounded-2xl bg-gray-50" v-else>
        <div class="text-center text-2xl my-18"></div>
        <div class="grid grid-cols-2 gap-2 animate-pulse max-md:grid-cols-1">
          <div class="flex gap-4 items-center bg-white px-4 py-5 rounded-2xl" v-for="_ of Array.from({length:10}, (_, i) => i)">
            <div class="size-12 bg-gray-100 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>