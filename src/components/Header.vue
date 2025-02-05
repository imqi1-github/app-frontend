<script setup lang="ts">
import Logo from "@/assets/logo.svg";

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
  }
]
</script>

<template>
  <div class="flex justify-between w-full">
    <RouterLink class="flex items-center justify-center" :to="$router.resolve({ name: 'home' }).href">
      <img width="25" height="25" :src="Logo" alt="logo"/>
      <span class="font-bold text-gray-600 ml-2">本地宝</span>
    </RouterLink>
    <div class="flex items-center justify-between gap-8">
      <RouterLink class="hover:text-blue-600" v-for="route of routes" :to="route.path" active-class="text-blue-600">
        {{ route.name }}
      </RouterLink>
    </div>
  </div>
</template>