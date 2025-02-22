<script setup lang="ts">
import Footer from "@components/Footer.vue";
import Header from "@components/Header.vue";
import PushButton from "@components/inputs/PushButton.vue";
</script>
<template>
  <div class="relative grid grid-rows-[max-content_1fr_max-content] min-h-screen">
    <div class="row-start-1 px-32 py-4 flex justify-center sticky top-0 duration-200 z-20 border-b-transparent">
      <Header/>
    </div>
    <div class="row-start-2 flex items-center justify-center p-8">
      <div class="text-center">
        <div class="italic text-9xl font-bold text-gray-700">
          404
        </div>
        <div class="text-2xl mt-8 mb-4">你查找的页面不存在！</div>
        <PushButton :onClick="()=>$router.push('/')" text="回到首页"/>
      </div>
    </div>
    <div class="row-start-3 px-16 py-12 flex justify-center">
      <Footer/>
    </div>
  </div>
</template>