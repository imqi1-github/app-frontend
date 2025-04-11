<script lang="ts" setup>
import Logo from "@assets/logo.webp";
import WeatherIcon from "@assets/icons/weather.png";
import MapLogo from "@assets/icons/map.png"
import Logo3 from "@assets/icons/icon3.jpg";
import Logo4 from "@assets/icons/icon4.jpg";
import Logo5 from "@assets/icons/icon5.jpg";
import Logo6 from "@assets/icons/icon6.jpg";
import AppItem from "@components/home/AppItem.vue";

const items = [
  {
    icon: WeatherIcon,
    name: "天气",
    description: "天气随时查，出行更潇洒",
    to: {"name": "weather-home"},
  },
  {
    icon: MapLogo,
    name: "地图",
    description: "导航寻路，出行更方便",
    to: {"name": "map"},
  },
  {
    icon: Logo3,
    name: "帖子",
    description: "网友的意见更清楚",
    to: {name: "post-home"},
  },
  {
    icon: Logo4,
    name: "景点",
    description: "游遍秦皇岛",
    to: {name: "spot-home"},
  },
  {
    icon: Logo5,
    name: "应用五",
    description: "应用描述五",
    to: "/number",
  },
  {
    icon: Logo6,
    name: "应用六",
    description: "应用描述六",
    to: "/number",
  },
]

</script>
<template>
  <div class="max-w-6xl w-full p-8 flex flex-col items-center">
    <section
        class="size-full my-24 flex justify-around items-center max-md:flex-col-reverse max-md:items-center gap-20">
      <div class="max-md:text-center">
        <div class="text-6xl/16 font-bold font-ms">秦皇岛本地宝</div>
        <div class="text-xl/6 font-bold my-4 font-ms">天气查询、便捷出行、互帮互助、智能AI</div>
        <RouterLink
            class="group bg-black px-6 py-3 shadow hover:bg-red-600 leading-12 text-white transition-colors duration-200 rounded-3xl"
            to="/about">
          了解我们
        </RouterLink>
      </div>
      <div class="size-44 mr-44 relative max-xl:mr-22 max-md:mr-0">
        <div class="-inset-12 absolute bg-gradient-favicon"></div>
        <img :src="Logo" alt="Logo" class="relative h-full w-full rounded-full overflow-hidden z-10"/>
      </div>
    </section>
    <section class="my-8 max-w-225 w-full">
      <div class="font-bold text-xl">服务</div>
      <div class="text-gray-600">致力于提供便民的服务</div>
      <div class="grid justify-around grid-cols-2 gap-6 mt-10 max-md:grid-cols-1">
        <AppItem v-for="item in items" :item="item"/>
      </div>
    </section>
  </div>
</template>