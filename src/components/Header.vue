<script setup lang="ts">
import Logo from "@assets/logo.jpg";
import {ArrowTopRightOnSquareIcon} from "@heroicons/vue/16/solid";

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
</script>

<template>
  <div class="flex items-center justify-between w-full text-sm max-w-6xl mx-auto">
    <RouterLink class="flex items-center justify-center" :to="$router.resolve({ name: 'home' }).href">
      <img class="rounded-full overflow-hidden" width="24" height="24" :src="Logo" alt="logo"/>
      <span class="font-bold text-gray-600 ml-2">本地宝</span>
    </RouterLink>
    <div class="flex items-baseline justify-between gap-6">
      <span v-for="route of routes">
        <RouterLink class="hover:text-blue-600" :to="route.path" exact-active-class="text-blue-600"
                    v-html="route.name" v-if="route.path.startsWith('/')">
        </RouterLink>
        <a :href="route.path" target="_blank" class="hover:text-blue-600 inline-flex items-center" v-else>
          {{ route.name }} <ArrowTopRightOnSquareIcon class="w-3 h-3" v-if="!route.path.startsWith('/')"/>
        </a>
      </span>
      <a href="/dashboard/login" target="_blank" class="hover:text-blue-600 inline-flex items-center">
        控制台 <ArrowTopRightOnSquareIcon class="w-3 h-3"/>
      </a>
    </div>
  </div>
</template>