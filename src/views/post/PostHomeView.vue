<script lang="ts" setup>
import {onMounted, onUnmounted, ref, watch} from 'vue'
import PostHomeItem from "@components/post/PostHomeItem.vue"
import {getPostList as _getPostList, searchPost} from "@api/post.ts"
import {debounce} from "@/utils/func.ts"
import {useRoute} from "vue-router";
import {RiAddLine} from "@remixicon/vue";
import {useUserStore} from "@/stores/user.ts";

defineProps({
  posts: {
    required: false,
    default: []
  }
})

const columnCount = ref(4) // 默认值，稍后会根据窗口宽度调整
const LOAD_THRESHOLD = 200
const route = useRoute()
const columns = ref<Array<any[]>>([])
const columnHeights = ref<number[]>([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)
const skeletonCounts = ref<number[]>([])
const isFirstLoad = ref(true) // 标记是否第一次加载

// 初始化列数和骨架屏
const initColumns = () => {
  const width = window.innerWidth
  let newColumnCount = 4
  if (width < 640) newColumnCount = 1
  else if (width < 1024) newColumnCount = 2
  else if (width < 1280) newColumnCount = 3

  columnCount.value = newColumnCount
  columns.value = Array.from({length: newColumnCount}, (): [] => [])
  columnHeights.value = Array(newColumnCount).fill(0)
  skeletonCounts.value = Array(newColumnCount).fill(2) // 每列 2 个骨架屏
}

// 首次加载前初始化列数
initColumns()

watch(() => route.params.id, () => {
  isFirstLoad.value = true
  getPostList(() => {
    columns.value = columns.value.map<[]>(() => [])
    skeletonCounts.value = Array(columnCount.value).fill(2) // 重置时显示动态列数的骨架屏
  })
})

const noContent = ref(false); // 新增：用于控制是否显示"暂无内容"

const getPostList = async (before: Function | null = null) => {
  if (loading.value || (!isFirstLoad.value && !hasMore.value)) return;
  loading.value = true;

  // 除第一次加载外，后续加载在开始时设置骨架屏
  if (!isFirstLoad.value) {
    skeletonCounts.value = skeletonCounts.value.map(() => 2);
  }

  try {
    let res, newPosts;
    if (route.params.keywords) {
      res = await searchPost(route.params.keywords as string);
      newPosts = res?.posts || [];
    } else {
      res = await _getPostList(page.value, route.params.id);
      newPosts = res?.data.posts || res || [];
    }

    if (newPosts.length === 0) {
      hasMore.value = false;
      if (!isFirstLoad.value) {
        skeletonCounts.value = skeletonCounts.value.map(() => 0);
      }
      noContent.value = true; // 如果没有帖子，设置“暂无内容”
      return;
    }

    if (before) {
      before();
    }

    newPosts.forEach((post: any) => {
      const shortestColumnIdx = columnHeights.value.indexOf(Math.min(...columnHeights.value));
      columns.value[shortestColumnIdx].push(post);
      columnHeights.value[shortestColumnIdx] += post.height || 300;
    });

    page.value++;
    skeletonCounts.value = skeletonCounts.value.map(() => 0);
    if (isFirstLoad.value) {
      isFirstLoad.value = false;
    }

    noContent.value = false; // 重置“暂无内容”
  } catch (error) {
    console.error("加载帖子失败:", error);
  } finally {
    loading.value = false;
  }
};


const handleScroll = debounce(() => {
  const scrollBottom =
      document.documentElement.scrollHeight -
      window.innerHeight -
      document.documentElement.scrollTop
  if (scrollBottom < LOAD_THRESHOLD && !loading.value) {
    getPostList()
  }
}, 50)

const updateColumnCount = () => {
  const width = window.innerWidth
  let newColumnCount = 4
  if (width < 640) newColumnCount = 1
  else if (width < 1024) newColumnCount = 2
  else if (width < 1280) newColumnCount = 3

  if (newColumnCount !== columnCount.value) {
    columnCount.value = newColumnCount
    const allPosts = columns.value.flat()
    columns.value = Array.from({length: newColumnCount}, (): [] => [])
    columnHeights.value = Array(newColumnCount).fill(0)
    skeletonCounts.value = Array(newColumnCount).fill(isFirstLoad.value ? 2 : 0)
    allPosts.forEach(post => {
      const shortestColumnIdx = columnHeights.value.indexOf(Math.min(...columnHeights.value))
      columns.value[shortestColumnIdx].push(post)
      columnHeights.value[shortestColumnIdx] += post.height || 300
    })
  }
}

const handleResize = debounce(updateColumnCount, 100)

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
  await getPostList()
  updateColumnCount()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})
</script>

<template>
  <div
      :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
      class="w-full gap-3 grid p-4 mb-auto"
  >
    <div v-if="noContent" class="w-full text-center text-gray-500">
      暂无内容
    </div>

    <div v-for="(col, colIndex) in columns" v-else :key="colIndex" class="space-y-5">
      <PostHomeItem
          v-for="(item, index) in col"
          :key="`${colIndex}-${index}`"
          :post="item"
      />
      <div
          v-for="skeletonIndex in skeletonCounts[colIndex]"
          :key="`skeleton-${colIndex}-${skeletonIndex}`"
          class="space-y-2 animate-pulse"
      >
        <div class="min-h-100 rounded-2xl bg-gray-200"></div>
        <div class="mx-2 w-3/5 h-5 bg-gray-100 rounded"></div>
        <div class="px-2 flex justify-between">
          <div class="w-40 h-4 rounded bg-gray-100"></div>
          <div class="w-8 h-4 rounded bg-red-100"></div>
        </div>
      </div>
    </div>

    <RouterLink v-if="useUserStore().isLogin" :to="{'name': 'post-write'}"
                class="bg-white fixed bottom-10 right-10 size-12 rounded-full border-1 border-gray-200 hover:outline-2 hover:outline-blue-700 flex items-center justify-center">
      <RiAddLine class="size-6"/>
    </RouterLink>
  </div>
</template>
