<script lang="ts" setup>
import Logo from "@assets/logo.webp";
import WeatherIcon from "@assets/icons/weather.png";
import MapLogo from "@assets/icons/map.png"
import Logo3 from "@assets/icons/icon3.jpg";
import Logo4 from "@assets/icons/icon4.jpg";
import AppItem from "@components/home/AppItem.vue";
import {usePWAInstall} from "@/composables/usePWAInstall.ts";
import Images from "@assets/home-imgs"
import {RiMouseLine} from "@remixicon/vue";

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
]

const {canInstall, installApp} = usePWAInstall()
const images = Images();

</script>
<template>
  <div class="max-w-6xl w-full p-8 flex flex-col items-center">
    <section
        class="size-full my-24 flex justify-around items-center max-md:flex-col-reverse max-md:items-center gap-20">
      <div class="max-md:text-center">
        <div class="text-6xl/16 font-bold font-ms">秦皇岛本地宝</div>
        <div class="text-xl/6 font-bold my-4 font-ms">天气查询、便捷出行、互帮互助、智能AI</div>
        <div class="flex max-md:justify-center">
          <RiMouseLine class="size-4 animate-bounce" />
        </div>
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
    <section class="my-8 max-w-225 w-full text-right">
      <div class="font-bold text-xl">游遍秦皇岛</div>
      <div class="text-gray-600">海滩、动物园；阿那亚、山海关...</div>
      <div class="w-full h-96 overflow-hidden">
        <div class="h-full flex items-center gap-9 animate-[move] [animation-duration:60s] [animation-timing-function:linear] [animation-iteration-count:infinite]">
          <img v-for="image of images" :src="image" class="max-h-72 max-w-128 size-full object-cover" alt="景点"/>
        </div>
      </div>
    </section>
    <section v-if="canInstall" class="my-8 max-w-225 w-full flex flex-col items-center">
      <div class="font-bold text-xl">立即使用</div>
      <div class="text-gray-600">点击下方按钮安装应用</div>
      <button @click="installApp"
          class="mt-3 cursor-pointer text-lg px-4 py-2 rounded-full bg-blue-100 text-gray-700 hover:bg-blue-700 hover:text-white">
        安装
      </button>
    </section>
  </div>
</template>
<style>
@keyframes move {
  0% {
    transform: translateX(0)
  }

  to {
    transform: translateX(-3200px)
  }
}
</style>