<script setup lang="ts">
type Item = {
  to: string;
  icon: string;
  name: string;
  description: string;
};

defineProps<{
  item: Item;
}>();
</script>
<template>
  <div class="flex gap-x-12">
    <div class="w-24 h-24">
      <img :src="item.icon" :alt="item.name" class="rounded-3xl overflow-hidden"/>
    </div>
    <div class="flex flex-col justify-between py-0.5">
      <div>
        <div class="text-xl font-bold">{{ item.name }}</div>
        <div class="text-sm text-gray-600">{{ item.description }}</div>
      </div>
      <RouterLink :to="item.to" class="px-4 py-1 text-white bg-blue-700 w-fit rounded-xl hover:bg-blue-500 duration-300 text-sm">前往</RouterLink>
    </div>
  </div>
</template>