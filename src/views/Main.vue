<script setup lang="ts">
import Header from "@components/Header.vue";
import Footer from "@components/Footer.vue";

import {onBeforeUnmount, onMounted, ref} from "vue";
const isScrolled = ref(true);  // 用来控制是否滚动过

const handleScroll = () => {
  isScrolled.value = window.scrollY < 50;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});

</script>

<template>
  <div class="relative grid grid-rows-[max-content_1fr_max-content] min-h-screen">
    <div class="row-start-1 px-32 py-4 flex justify-center sticky top-0 duration-200 z-20 max-xl:px-12"
         :class="{'border-b-transparent': isScrolled, 'border-b-[1px] bg-white border-b-gray-200': !isScrolled}">
      <Header/>
    </div>
    <div class="row-start-2 flex items-center justify-center p-8">
      <RouterView/>
    </div>
    <div class="row-start-3 px-16 py-12 flex justify-center">
      <Footer/>
    </div>
  </div>
</template>