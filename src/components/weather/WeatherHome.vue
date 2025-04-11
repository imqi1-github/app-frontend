<script lang="ts" setup>
import {computed, onMounted, ref, toRaw, watch,} from "vue";
import {useRouter} from "vue-router";
import {
  getCoordinates,
  getCurrentAirQuality,
  getIndices,
  getMinutelyPrecipitation,
  getSevenDaysWeather,
  getWeatherHourly,
  getWeatherNow,
} from "@api/weather.ts";
import {useUserStore} from "@/stores/user.ts";
import {formatDateToChinese, formatTimeFromQWeather, getDayAfter} from "@/utils/time.ts"
import {getAQILevel} from "@/utils/weather.ts"
import Cloth from "@assets/icons/cloth.svg"
import Emotion from "@assets/icons/emotion.svg"
import Makeup from "@assets/icons/makeup.svg"
import Pollution from "@assets/icons/pollution.svg"
import Sick from "@assets/icons/sick.svg"
import Sun from "@assets/icons/sun.svg"
import Sunglasses from "@assets/icons/sunglasses.svg"
import Traffic from "@assets/icons/traffic.svg"
import Travel from "@assets/icons/travel.svg"
import Uv from "@assets/icons/uv.svg"
import {RiArrowRightDoubleLine} from "@remixicon/vue";

const userStore = useUserStore();
const information = ref(null);
const weatherInformation = ref(null);
const positionInformation = ref(null);
const airQuality = ref<any>("未获取到空气质量");
const weatherHourly = ref<any>(null);
const minutelyPrecipitation = ref<any>(null);
const sevenDaysWeather = ref<any>(null);
const indices = ref<any>(null);
const router = useRouter();

const indicesIcon: Record<number, string> = {
  3: Cloth,
  5: Uv,
  6: Travel,
  8: Emotion,
  9: Sick,
  10: Pollution,
  12: Sunglasses,
  13: Makeup,
  15: Traffic,
  16: Sun,
}

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

watch(() => [userStore.isLogin, userStore.user], () => {
  information.value = userStore.user?.information;
})

onMounted(() => {
  try {
    // 获取基础信息
    information.value = userStore.user?.information || {};
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

      // 获取空气质量
      getCurrentAirQuality(city)
          .then(result => {
            airQuality.value = result;
            console.log("空气质量：", toRaw(airQuality.value));
          })
          .catch(error => console.error("获取空气质量失败：", error));

      // 获取小时天气预报
      getWeatherHourly(city)
          .then(result => {
            weatherHourly.value = result;
            console.log("小时天气预报：", toRaw(weatherHourly.value));
          })
          .catch(error => console.error("获取小时天气失败：", error));

      // 获取分钟降水预告
      getMinutelyPrecipitation(city)
          .then(result => {
            minutelyPrecipitation.value = result;
            console.log("分钟降水预告：", toRaw(minutelyPrecipitation.value));
          })
          .catch(error => console.error("获取分钟降水失败：", error));

      // 获取7天天气预报
      getSevenDaysWeather(city)
          .then(result => {
            sevenDaysWeather.value = result;
            console.log("7天天气预报：", toRaw(sevenDaysWeather.value));
          })
          .catch(error => console.error("获取7天天气失败：", error));

      // 获取天气指数
      getIndices(city)
          .then(result => {
            indices.value = result;
            console.log("天气指数：", toRaw(indices.value));
          })
          .catch(error => console.error("获取天气指数失败：", error));
    };

    // 立即执行并行请求
    fetchData();
  } catch (error) {
    console.error("初始化时发生错误：", error);
  }
})
</script>

<template>

  <div v-if="weatherInformation"
       class="mt-6 bg-[linear-gradient(225deg,_#fee5ca,_#e9f0ff_55%,_#dce3fb)] p-4 rounded-xl">
    <div class="text-right text-xs text-gray-700">更新于
      {{ formatTimeFromQWeather(weatherInformation?.updateTime) ?? "获取中" }}
    </div>
    <div class="w-full relative mt-6">
      <div v-if="airQuality?.indexes?.[0]?.aqi"
           :style="{background: getAQILevel(airQuality?.indexes?.[0]?.aqi).colorClass}"
           class="absolute -top-2 right-0 px-1.5 py-0.5 text-right rounded-lg w-fit text-white"> AQI
        {{ airQuality?.indexes?.[0]?.aqi }} {{ airQuality?.indexes?.[0]?.category }}
      </div>
      <div class="grid grid-cols-2 gap-x-3 items-center">
        <div class="justify-self-end">
          <i v-if="weatherInformation?.now?.icon" :class="`qi-${weatherInformation?.now?.icon}-fill`"
             class="text-6xl"></i>
        </div>
        <div class="justify-self-start flex flex-col">
          <div v-if="weatherInformation?.now?.temp" class="text-6xl">{{ weatherInformation?.now?.temp }}&deg;</div>
          <div v-if="weatherInformation?.now?.text" class="text-2xl">{{ weatherInformation?.now?.text }}</div>
        </div>
      </div>
    </div>
    <div v-if="airQuality?.indexes?.[0]?.health?.effect" class="mt-6 text-center text-sm text-gray-600">
      {{ airQuality?.indexes?.[0]?.health?.effect }}
    </div>
    <div class="flex gap-2 items-center p-4 justify-around mt-8 bg-gray-200/40 rounded-2xl flex-wrap">
      <div v-if="weatherInformation?.now?.windScale" class="flex flex-col">
        <div class="text-lg text-gray-800">{{ weatherInformation?.now?.windScale }}级</div>
        <div v-if="weatherInformation?.now?.windDir" class="text-sm text-gray-500">
          {{ weatherInformation?.now?.windDir }}
        </div>
        <div v-else class="text-sm text-gray-500">风力等级</div>
      </div>
      <div v-if="weatherInformation?.now?.windSpeed" class="flex flex-col">
        <div class="text-lg text-gray-800">{{ weatherInformation?.now?.windSpeed }}km/h</div>
        <div class="text-sm text-gray-500">风速</div>
      </div>
      <div v-if="weatherInformation?.now?.humidity" class="flex flex-col">
        <div class="text-lg text-gray-800">{{ weatherInformation?.now?.humidity }}%</div>
        <div class="text-sm text-gray-500">相对湿度</div>
      </div>
      <div v-if="weatherInformation?.now?.feelsLike" class="flex flex-col">
        <div class="text-lg text-gray-800">{{ weatherInformation?.now?.feelsLike }}&deg;C</div>
        <div class="text-sm text-gray-500">体感温度</div>
      </div>
      <div v-if="weatherInformation?.now?.vis" class="flex flex-col">
        <div class="text-lg text-gray-800">{{ weatherInformation?.now?.vis }}km</div>
        <div class="text-sm text-gray-500">能见度</div>
      </div>
      <div v-if="weatherInformation?.now?.precip" class="flex flex-col">
        <div class="text-lg text-gray-800">{{ weatherInformation?.now?.precip }}mm/h</div>
        <div class="text-sm text-gray-500">降水量</div>
      </div>
      <div v-if="weatherInformation?.now?.pressure" class="flex flex-col">
        <div class="text-lg text-gray-800">{{ weatherInformation?.now?.pressure }}hPa</div>
        <div class="text-sm text-gray-500">大气压强</div>
      </div>
    </div>
    <div class="text-right text-xs text-gray-400 mt-3">* 数据来源于<a :href="weatherInformation?.fxLink"
                                                                      class="text-blue-400 hover:underline"
                                                                      target="_blank">和风天气</a></div>
    <div v-if="!userStore.isLogin" class="text-right text-xs text-gray-400 mt-3">* 由于你未登录，城市默认展示秦皇岛市，可
      <RouterLink class="text-blue-400 hover:underline" to="/login">登录</RouterLink>
      后设置自定义城市
    </div>
  </div>
  <div
      v-else
      class="mt-6 bg-[linear-gradient(225deg,_#fee5ca,_#e9f0ff_55%,_#dce3fb)] p-16 rounded-xl flex items-center justify-center">
    <div class="relative w-full flex flex-col items-center gap-4">
      <div class="flex items-center justify-center">
        <div class="size-32 bg-gray-200 rounded-2xl animate-pulse"></div>
      </div>
      <div class="absolute w-20 h-5 -top-6 right-0 size-2 bg-red-200 rounded-2xl animate-pulse"></div>
      <div class="w-64 h-4 bg-gray-200 rounded-xl"></div>
      <div class="w-full h-20 bg-gray-200 rounded-3xl"></div>
    </div>
  </div>
  <div v-if="weatherInformation" class="bg-white w-full p-4 mt-4 rounded-2xl">
    <div class="text-center text-lg">24小时天气预报</div>
    <div class="flex justify-around items-end pt-12 gap-0.5 overflow-hidden">
      <div v-for="forecast of weatherHourly?.hourly"
           class="flex flex-col items-center gap-1.5 max-[850px]:even:hidden">
        <div class="">{{ forecast?.temp }}&deg;</div>
        <div :style="`height: ${16 + 4 * ((forecast?.temp||1) - minimumTemp)}px`"
             class="w-2 bg-blue-600 rounded"></div>
        <i v-if="forecast?.icon" :class="`qi-${forecast?.icon}-fill`" class="text-xl text-blue-400"></i>
        <div class="flex flex-col items-center">
          <svg :style="`rotate: ${90 + Number(forecast?.wind360)}deg`" class="size-4 fill-gray-500" fill="currentColor"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z"/>
          </svg>
          <div class="text-xs text-gray-500">{{ forecast?.windSpeed }}pm</div>
        </div>
      </div>
    </div>
    <div class="text-right mt-2">
      <RouterLink :to="router.resolve({'name': 'weather-hourly'})" class="text-sm text-blue-400"><span
          class="inline-flex items-center group">查看<RiArrowRightDoubleLine
          class="size-4 group-hover:translate-x-1 duration-100 "/></span></RouterLink>
    </div>
  </div>
  <div v-else class="bg-white w-full mt-4 p-4 rounded-2xl h-50 flex">
    <div class="mt-auto w-full flex gap-0.5 justify-around">
      <div v-for="_ of Array.from({length: 24}, (_, i) => i)"
           class="w-2 h-16 bg-blue-200 rounded animate-pulse"></div>
    </div>
  </div>
  <div v-if="sevenDaysWeather" class="mt-6 bg-white w-full rounded-2xl">
    <div class="text-center text-xl p-4">7天天气预报</div>
    <div v-for="(weather, index) of sevenDaysWeather.daily"
         :key="index" class="px-4 py-2 flex items-center justify-between gap-10 w-fit max-md:gap-4">
      <div class="flex flex-col">
        <div class="text-lg">{{ getDayAfter(index) }}</div>
        <div class="text-sm text-gray-500">{{ formatDateToChinese(weather.fxDate) }}</div>
      </div>
      <div class="">
        <i :class="`qi-${weather.iconDay}-fill `" class="text-3xl"></i>
      </div>
      <div :style="`transform: translateX(${-8 * (Number(weather.tempMin)-minimumDailyTemp)}px)`"
           class="flex justify-start mr-auto items-center flex-auto gap-2 relative">
        <span class="text-base">{{ weather.tempMax }}&deg;</span>
        <div :style="`width:${(weather.tempMax - weather.tempMin)*16}px`"
             class="h-2 bg-[linear-gradient(to_right,#F18360,#427BFF)] rounded md:block max-md:hidden"></div>
        <div :style="`width:${(weather.tempMax - weather.tempMin)*8}px`"
             class="h-2 bg-[linear-gradient(to_right,#F18360,#427BFF)] rounded md:hidden max-md:block"></div>
        <span class="text-base">{{ weather.tempMin }}&deg;</span>
      </div>
    </div>
  </div>
  <div v-else class="mt-6 p-4 bg-white w-full rounded-2xl flex flex-col gap-2 pt-18">
    <div v-for="_ of Array.from({length: 7}, (_, item) => item)"
         class="animate-pulse flex gap-12 items-center">
      <div class="text-lg w-16 h-4 rounded-2xl bg-gray-200"></div>
      <div class="text-gray-600">···</div>
      <div class="w-32 h-2 bg-blue-200 rounded-2xl"></div>
    </div>
  </div>
  <div v-if="indices" class="mt-6 p-4 w-full rounded-2xl bg-gray-50">
    <div class="text-center text-2xl mt-4   mb-9">生活指数</div>
    <div class="grid grid-cols-2 gap-2 max-md:grid-cols-1">
      <div v-for="item of indices.daily" class="flex gap-4 items-center bg-white px-4 py-5 rounded-2xl">
        <img :alt="item.name" :src="indicesIcon[item.type as number]" class="size-12 bg-gray-100 rounded-full">
        <div class="flex flex-col">
          <div class="text-xl">{{ item.name }}</div>
          <div class="text-sm text-gray-700">{{ item.category }}</div>
        </div>
      </div>
    </div>
    <div class="text-right mt-2">
      <RouterLink :to="router.resolve({'name': 'weather-indices'})" class="text-sm text-blue-400"><span
          class="inline-flex items-center group">查看<RiArrowRightDoubleLine
          class="size-4 group-hover:translate-x-1 duration-100 "/></span></RouterLink>
    </div>
  </div>
  <div v-else class="mt-6 p-4 w-full rounded-2xl bg-gray-50">
    <div class="text-center text-2xl my-18"></div>
    <div class="grid grid-cols-2 gap-2 animate-pulse max-md:grid-cols-1">
      <div v-for="_ of Array.from({length:10}, (_, i) => i)"
           class="flex gap-4 items-center bg-white px-4 py-5 rounded-2xl">
        <div class="size-12 bg-gray-100 rounded-full"></div>
      </div>
    </div>
  </div>
</template>