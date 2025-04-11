<template>
  <RouterLink :to="{name: 'spot-detail', params: {id: $props.spot.id }}"
              class="border-1 rounded-xl border-gray-200 overflow-hidden">
    <div class="aspect-4/3">
      <img :src="$props.spot.pictures[0]" alt="封面" class="size-full hover:brightness-90 object-cover"/>
    </div>
    <div class="px-3 py-2">
      <div class="text-2xl font-bold mt-2">{{ $props.spot.title }}</div>
      <div class="text-xs text-gray-600">{{ $props.spot.position }}</div>
      <hr class="border-gray-300 my-3">
      <div class="line-clamp-2">
        {{ stripMarkdown($props.spot.content).slice(0, 60) }}
      </div>
    </div>
  </RouterLink>
</template>
<script lang="ts" setup>
defineProps({
  spot: {
    type: Object,
    required: true
  }
})

function stripMarkdown(md: string) {
  return md
      .replace(/!\[.*?\]\(.*?\)/g, "")                  // 去除图片
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")          // 去除链接，只保留文本
      .replace(/`([^`]+)`/g, "$1")                      // 去除行内代码标记
      .replace(/\*\*([^*]+)\*\*/g, "$1")                // 去除加粗
      .replace(/\*([^*]+)\*/g, "$1")                    // 去除斜体
      .replace(/#+\s*(.*)/g, "$1")                      // 去除标题符号
      .replace(/^-{3,}|_{3,}/g, "")                     // 去除分割线
      .replace(/>\s?(.*)/g, "$1")                       // 去除引用符号
      .replace(/!\[.*?\]\(.*?\)/g, "")                  // 再次去除图片（防重复）
      .trim();
}
</script>