<script setup lang="ts">
import {onMounted, ref} from "vue";

let available = ref<boolean>(false);

async function testApi() {
  return (await fetch(import.meta.env.VITE_API_URL)).ok;
}

onMounted(async () => {
  try {
    available.value = await testApi();
  } catch {
  }
})

</script>
<template>
  <div class="text-gray-600 text-sm max-w-6xl w-full flex gap-x-2.5 justify-between items-center max-md:flex-col gap-y-1">
    <div>2025 &copy; 棋</div>
    <div>秦皇岛本地宝 - 致力做一个汇集旅游景点的网站</div>
    <div class="flex items-center gap-1">
      <div
          class="size-4 rounded-full after:size-2 flex items-center justify-center after:rounded-full animate-pulse"
          :class="available ? 'bg-green-200 after:bg-green-300' : 'bg-red-200 after:bg-red-300'"></div>
      {{ available ? '后端 API 正常' : '后端 API 出现故障' }}
    </div>
  </div>
</template>