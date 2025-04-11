<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {getCategories} from "@api/post.ts";

const categories = ref([])


onMounted(() => {
  getCategories().then(res => {
    if (!res) return
    console.log("帖子目录：", res.data);
    categories.value = res.data;
  });
})
</script>
<template>
  <div class="max-w-300 flex items-center justify-center size-full">
    <div class="size-full flex items-center justify-center flex-col">
      <template v-if="$route.meta.showCategory">
        <div class="w-full p-4 text-2xl my-2" v-if="$route.params.keywords">“{{ $route.params.keywords }}”的搜索结果</div>
        <div v-else-if="categories.length > 0" class="flex gap-x-4 flex-wrap max-md:justify-center px-6 py-3 mr-auto">
          <RouterLink :to="{'name': 'post-home'}" class="px-3 py-2 rounded-xl" exact-active-class="bg-gray-100">全部
          </RouterLink>
          <RouterLink v-for="category of categories" :to="{'name': 'post-category', 'params': {'id': category.id}}"
                      class="px-3 py-2 rounded-xl"
                      exact-active-class=" bg-gray-100">{{ category.name }}
          </RouterLink>
        </div>
        <div v-else class="flex gap-4 flex-wrap max-md:justify-center px-6 py-3 mr-auto">
          <div v-for="item of 8" class="w-27 h-9 bg-gray-200 rounded animate-pulse">
          </div>
        </div>
      </template>
      <RouterView :key="$route.fullPath"/>
    </div>
  </div>
</template>