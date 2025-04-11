<template>
  <div class="lg:p-4 max-w-300 size-full space-y-6">
    <div class="max-lg:p-4 text-sm/4 text-gray-800">
      秦皇岛市 > 景点
    </div>
    <div class="lg:p-6 flex max-lg:flex-col gap-12 my-9 max-lg:items-center">
      <div class="lg:max-w-140 lg:max-h-110 size-full lg:shadow-lg shadow-gray-400 relative">
        <div class="z-1 absolute -left-6 -top-6 -bottom-6 right-6 bg-blue-500 max-lg:hidden"></div>
        <img alt="封面" class="relative z-2 block size-full object-cover" src="/img/spot-cover.png"/>
      </div>
      <div class="flex justify-center flex-col gap-6">
        <div class="text-6xl font-extrabold font-ms">秦皇岛内景点</div>
        <div class="text-xl text-gray-700">查看秦皇岛内各处景点：<br/>老龙头、北戴河、动物园、海滩</div>
      </div>
    </div>
    <hr class="border-gray-300 my-14">
    <div class="max-lg:p-4 ">
      <div class="text-3xl font-bold">不容错过的体验</div>
      <div class="text-gray-800">先从哪里玩起呢</div>
    </div>
    <div class="max-lg:p-4 grid grid-cols-3 gap-4 md:max-lg:grid-cols-2 max-md:grid-cols-1">
      <HomeSpotItem v-for="spot of spots" :spot/>
    </div>
    <div class="text-sm/4 text-gray-800">
      秦皇岛市 > 景点
    </div>
  </div>
</template>
<script lang="ts" setup>
import HomeSpotItem from "@components/spot/HomeSpotItem.vue";
import {onMounted, ref} from "vue";
import {getSpotsRandom} from "@api/spot.ts";

const spots = ref();
onMounted(() => {
  getSpotsRandom().then(res => {
    console.log("获取到随机景点列表：", res)
    spots.value = res
  })
})
</script>