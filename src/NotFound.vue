<script setup lang="ts">
import PushButton from "@components/inputs/PushButton.vue";
</script>

<template>
  <div class="text-center">
    <div class="italic text-9xl font-bold text-gray-700">
      404
    </div>
    <div class="text-2xl mt-8 mb-4">你查找的页面不存在！</div>
    <PushButton :onClick="() => $router.push('/')" text="回到首页"/>
  </div>
</template>