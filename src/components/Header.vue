<script setup lang="ts">
import Logo from "@assets/logo.webp";
import {ArrowTopRightOnSquareIcon, Bars3Icon, XMarkIcon} from "@heroicons/vue/16/solid";
import {ref} from "vue";

const routes = [
  {
    "name": "首页",
    "path": "/",
  },
  {
    "name": "数字",
    "path": "/number",
  },
  {
    "name": "登录",
    "path": "/login",
  },
  {
    "name": "访问ImQi1",
    "path": "https://imqi1.com"
  }
]

let menuShow = ref<boolean>(false);
</script>

<template>
  <div class="flex items-center justify-between w-full text-sm max-w-6xl mx-auto">
    <RouterLink class="flex items-center justify-center" :to="$router.resolve({ name: 'home' }).href">
      <img class="rounded-full overflow-hidden" width="24" height="24" :src="Logo" alt="logo"/>
      <span class="font-bold text-gray-600 ml-2">本地宝</span>
    </RouterLink>
    <div class="flex items-baseline justify-between gap-6 max-md:fixed max-md:inset-0 max-md:flex-col max-md:items-start max-md:p-12 max-md:gap-y-4 max-md:justify-start max-md:bg-gray-50 max-md:text-xl max-md:font-bold"
         :class="{'max-md:hidden': !menuShow, 'max-md:flex': menuShow}">
      <span v-for="route of routes">
        <RouterLink class="hover:text-blue-600" :to="route.path" exact-active-class="text-blue-600"
                    v-html="route.name" v-if="route.path.startsWith('/')" @click="menuShow = false">
        </RouterLink>
        <a :href="route.path" target="_blank" class="hover:text-blue-600 inline-flex items-center" v-else>
          {{ route.name }} <ArrowTopRightOnSquareIcon class="size-3 max-md:size-4" v-if="!route.path.startsWith('/')" @click="menuShow = false"/>
        </a>
      </span>
      <a href="/dashboard/login" target="_blank" class="hover:text-blue-600 inline-flex items-center" @click="menuShow = false">
        控制台
        <ArrowTopRightOnSquareIcon class="size-3 max-md:size-4"/>
      </a>
    </div>
  </div>
  <div class="hidden cursor-pointer items-center justify-center" :class="{'max-md:flex': !menuShow, 'max-md:hidden': menuShow}" @click="()=>menuShow=true">
    <Bars3Icon class="size-4"/>
  </div>
  <div class="hidden fixed top-4 right-4 cursor-pointer" :class="{'max-md:block': menuShow, 'max-md:hidden': !menuShow}" @click="()=>menuShow=false">
    <XMarkIcon class="size-6" />
  </div>
</template>