<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {ref, onMounted, onBeforeUnmount} from 'vue';

const isScrolled = ref(false);  // 用来控制是否滚动过
onMounted(() => {
  console.log(`项目渲染完成，后端 API 地址为：${import.meta.env.VITE_API_URL}`);
});

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
  <div class="row-start-1 px-32 py-4 flex justify-center sticky top-0 duration-200"
       :class="{'border-b-transparent': isScrolled, 'border-b-[1px] bg-white border-b-gray-200': !isScrolled}">
    <Header/>
  </div>
  <div class="row-start-2 flex items-center justify-center p-8">
    <RouterView/>
  </div>
  <div class="row-start-3 px-16 py-12 flex justify-center">
    <Footer/>
  </div>
</template>
