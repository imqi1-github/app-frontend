<script setup lang="ts">
import Header from "@components/Header.vue";
import Footer from "@components/Footer.vue";

import {onBeforeUnmount, onMounted, ref} from "vue";
import {testLogin} from "@api/user.ts";
import {useUserStore} from "@/stores/user.ts";

const isScrolled = ref(true);  // 用来控制是否滚动过

const userStore = useUserStore();

const handleScroll = () => {
  isScrolled.value = window.scrollY < 50;
};

onMounted(async () => {
  window.addEventListener('scroll', handleScroll);
  try {
    const response = await testLogin();
    if (response?.user != null) {
      userStore.setUser(response.user);
      userStore.setLogin(true);
      console.log("用户已登录：", response.user);
    } else {
      userStore.setLogin(false);
    }
  } catch (e) {
    console.log(e)
  }
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
  <div class="relative bg-gray-50 grid grid-rows-[max-content_1fr_max-content] min-h-screen">
    <div class="row-start-1 px-32 py-4 flex justify-center sticky top-0 duration-200 z-20 max-xl:px-12"
         :class="{'border-b-transparent': isScrolled, 'border-b-[1px] bg-white border-b-gray-200': !isScrolled}">
      <Header/>
    </div>
    <div class="row-start-2 flex items-center justify-center">
      <RouterView/>
    </div>
    <div class="row-start-3 px-12 py-4 flex justify-center border-t-[1px] bg-white border-t-gray-200">
      <Footer/>
    </div>
  </div>
</template>