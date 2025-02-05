<script setup lang="ts">
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import {onMounted} from "vue";

onMounted(() => {
  console.log(`项目渲染完成，后端 API 地址为：${import.meta.env.VITE_API_URL}`);
})

</script>
<template>
  <div class="row-start-1 px-32 py-2 flex justify-center border-b-gray-300 border-b-1">
    <Header/>
  </div>
  <div class="row-start-2 flex items-center justify-center p-8">
    <RouterView/>
  </div>
  <div class="row-start-3 px-32 py-2 flex justify-center border-t-gray-300 border-t-1">
    <Footer/>
  </div>
</template>