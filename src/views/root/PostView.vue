<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {getCategories} from "@api/post.ts";

const categories = ref([])


onMounted(() => {
  getCategories().then(res => {
    console.log("帖子目录：", res.data);
    categories.value = res.data;
  });
})
</script>
<template>
  <div class="max-w-300 flex items-center justify-center size-full">
    <div class="size-full flex items-center justify-center flex-col">
      <div v-if="$route.meta.showCategory" class="flex gap-x-4 flex-wrap max-md:justify-center px-6 py-3 mr-auto">
        <RouterLink :to="{'name': 'post-home'}" class="px-3 py-2 rounded-xl" exact-active-class="bg-gray-100">全部
        </RouterLink>
        <template v-if="categories.length > 0">
          <RouterLink v-for="category of categories" :to="{'name': 'post-category', 'params': {'id': category.id}}"
                      class="px-3 py-2 rounded-xl"
                      exact-active-class=" bg-gray-100">{{ category.name }}
          </RouterLink>
        </template>
      </div>
      <RouterView></RouterView>
    </div>
  </div>
</template>