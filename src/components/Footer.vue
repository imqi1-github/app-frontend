<script setup lang="ts">
import {testApi} from "@api/test.ts";
import {ref} from "vue";

let available = ref<boolean>(false);
(async () => {
  available.value = await testApi();
})()

</script>
<template>
  <div class="text-gray-400 text-sm max-w-6xl w-full">
    <div class="mb-1">2025 &copy; 棋</div>
    <div class="mb-1">秦皇岛本地宝 - 致力于给小岛的居民更方便的服务</div>
    <div class="flex items-center gap-1">
      <div
          class=" w-4 h-4 rounded-full after:content-[''] after:w-2 after:h-2 flex items-center justify-center after:rounded-full animate-pulse"
          :class="available ? 'bg-green-200 after:bg-green-300' : 'bg-red-200 after:bg-red-300'"></div>
      {{ available ? '后端 API 正常' : '后端 API 出现故障' }}
    </div>
  </div>
</template>