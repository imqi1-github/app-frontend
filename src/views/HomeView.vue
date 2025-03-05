<script setup lang="ts">
import Logo from "@assets/logo.webp";
import Logo1 from "@assets/icons/icon1.jpg";
import Logo2 from "@assets/icons/icon2.jpg";
import Logo3 from "@assets/icons/icon3.jpg";
import Logo4 from "@assets/icons/icon4.jpg";
import Logo5 from "@assets/icons/icon5.jpg";
import Logo6 from "@assets/icons/icon6.jpg";
import AppItem from "@components/home/AppItem.vue";

const items = [
  {
    icon: Logo1,
    name: "应用一",
    description: "应用描述一",
    to: "/number",
  },
  {
    icon: Logo2,
    name: "应用二",
    description: "应用描述二",
    to: "/number",
  },
  {
    icon: Logo3,
    name: "应用三",
    description: "应用描述三",
    to: "/number",
  },
  {
    icon: Logo4,
    name: "应用四",
    description: "应用描述四",
    to: "/number",
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
  <div class="max-w-6xl w-full p-8">
    <section class="w-full h-full my-24 flex justify-between items-center max-md:flex-col-reverse max-md:items-center gap-20">
      <div class="max-md:text-center">
        <div class="text-6xl/16 font-bold">秦皇岛本地宝</div>
        <div class="text-xl/6 font-bold my-4">天气查询、便捷出行、互帮互助、智能AI</div>
        <RouterLink to="/about"
                    class="group bg-black px-6 py-3 shadow hover:bg-red-600 leading-12 text-white transition-colors duration-200 rounded-3xl">
          了解我们
        </RouterLink>
      </div>
      <div class="size-44 mr-44 relative max-xl:mr-22 max-md:mr-0">
        <div class="-inset-12 absolute bg-gradient-favicon"></div>
        <img :src="Logo" alt="Logo" class="relative h-full w-full rounded-full overflow-hidden z-10"/>
      </div>
    </section>
    <section class="my-20">
      <div class="font-bold text-xl">服务</div>
      <div class="text-gray-600">致力于提供便民的服务</div>
      <div class="grid grid-cols-3 gap-6 mt-10 md:max-xl:grid-cols-2 max-md:grid-cols-1">
        <AppItem v-for="item in items" :item="item"/>
      </div>
    </section>
    <section>
      <div class="font-bold text-xl">应用</div>
      <div class="text-gray-600">致力于提供便民的应用</div>
      <div class="grid grid-cols-3 gap-6 mt-10 md:max-xl:grid-cols-2 max-md:grid-cols-1">
        <AppItem v-for="item in items" :item="item"/>
      </div>
    </section>
  </div>
</template>