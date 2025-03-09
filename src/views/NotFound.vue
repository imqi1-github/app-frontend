<script setup lang="ts">
import Header from "@components/Header.vue";
import Footer from "@components/Footer.vue";

import {onBeforeUnmount, onMounted, reactive, ref} from "vue";
import {testLogin} from "@api/user.ts";
import PushButton from "@components/inputs/PushButton.vue";

const isScrolled = ref<boolean>(true);  // 用来控制是否滚动过

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
    <div class="row-start-2 flex items-center justify-center">
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