<script setup lang="ts">
import Logo from "@assets/logo.jpg";

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
    "name": "访问ImQi1 <i class='ri-sm ri-external-link-line'></i>",
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
        <RouterLink class="hover:text-blue-600" :to="route.path" active-class="text-blue-600"
                    v-html="route.name" v-if="route.path.startsWith('/')">
        </RouterLink>
        <a :href="route.path" target="_blank" class="hover:text-blue-600" v-else v-html="route.name"></a>
      </span>
    </div>
  </div>
</template>