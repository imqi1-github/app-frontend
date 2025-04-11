<script lang="ts" setup>
import {RiSearchLine} from "@remixicon/vue";

import Header from "@components/Header.vue";
import Footer from "@components/Footer.vue";

import {onBeforeUnmount, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router"
import {testLogin} from "@api/user.ts";
import {useUserStore} from "@/stores/user.ts";
import {throttle} from "@/utils/func.ts";
import {useToast} from "vue-toastification";

const router = useRouter();

const isScrolled = ref(true);  // 用来控制是否滚动过
const route = useRoute();
const userStore = useUserStore();

const handleScroll = throttle(() => {
  isScrolled.value = window.scrollY < 50;
});

const searchInput = ref("");
const toast = useToast();

const thisSearch = () => {
  if (searchInput.value.trim() !== "") {
    router.push({"name": "post-search", "params": {"keywords": searchInput.value}});
  } else {
    toast.error("请输入搜索内容")
  }
}

watch(() => searchInput.value, (newValue) => {

})

onMounted(async () => {
  window.addEventListener('scroll', throttle(handleScroll));
  try {
    const response = await testLogin();
    if (response?.user != null) {
      userStore.setUser(response.user);
      localStorage.setItem("user", JSON.stringify(response.user))
      userStore.setLogin(true);
      console.log("用户已登录：", response.user);
    } else {
      userStore.setLogin(false);
      localStorage.removeItem("user");
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
    <div :class="{
          'border-b-transparent bg-gray-50': isScrolled && route.meta.searchTo,
          'border-b-transparent bg-transparent': isScrolled && !route.meta.searchTo,
          'border-b-[1px] border-b-gray-200 bg-white': !isScrolled
        }"
         class="row-start-1 px-32 py-4 flex justify-center sticky top-0 duration-200 z-20 max-md:px-4 max-xl:px-12 min-h-15 gap-2">
      <Header>
        <template v-if="route.meta.searchTo">
          <div class="flex py-1 px-3 bg-white rounded-xl items-center justify-self-center border-gray-50">
            <input v-model="searchInput" class="w-50 max-md:w-35 outline-none" placeholder="搜索" type="text" @keyup.enter="thisSearch">
            <RiSearchLine class="size-4" @click="thisSearch"/>
          </div>
        </template>
      </Header>
    </div>
    <div class="row-start-2 flex items-center justify-center">
      <RouterView/>
    </div>
    <div class="row-start-3 flex flex-col gap-10 justify-center">
      <div class="px-12 py-5 w-full flex items-center justify-center bg-gray-50">
        <Footer/>
      </div>
    </div>
  </div>
</template>