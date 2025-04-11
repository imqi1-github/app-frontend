<template>
  <div class="p-4 size-full">
    <div v-if="!images">
      加载中...
    </div>
    <div v-else class="flex gap-6 flex-wrap w-full">
      <div v-for="(item, index) in images" :key="index" class="flex flex-col gap-2 max-w-64 w-full">
        <img :src="item.filepath" :alt="item.filename" data-fancybox="gallery" :data-caption="item.filename" class="size-full rounded-md shadow-md shadow-gray-200">
        <div>
          <div class="text-gray-800 text-lg font-bold line-clamp-1 break-all">{{ item.filename }}</div>
          <div class="flex flex-wrap justify-between text-sm text-gray-600">{{ item.comment }} {{ formatRelativeTime(item.upload_time) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, onUnmounted, ref} from "vue";
import {useUserStore} from "@/stores/user.ts";
import {getMyUploads} from "@api/user.ts";
import {formatRelativeTime} from "@/utils/time.ts";
import {Fancybox} from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css'; // 引入默认样式

const userStore = useUserStore();
const images = ref();

const initFancybox = () => {
  // @ts-ignore
  Fancybox.bind('[data-fancybox="gallery"]', {
    loop: true,
    buttons: ['close'],
    animationEffect: 'zoom-in-out',
  });
};

onMounted(async () => {
  const results = await getMyUploads(userStore.user.id);
  console.log("已上传图片：", results);
  images.value = results.uploads;
  initFancybox();
});

onUnmounted(() => {
  Fancybox.unbind('[data-fancybox="gallery"]');
  Fancybox.close();
});
</script>