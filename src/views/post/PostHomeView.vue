<script lang="ts" setup>
import {onMounted, onUnmounted, ref, watch} from 'vue'
import PostHomeItem from "@components/post/PostHomeItem.vue"
import {getPostList as _getPostList} from "@api/post.ts"
import {debounce} from "@/utils/func.ts"
import {useRoute} from "vue-router";
import {PlusIcon} from "@heroicons/vue/24/solid";
import {useUserStore} from "@/stores/user.ts";

defineProps({
  posts: {
    required: false,
    default: []
  }
})

const columnCount = ref(4)
const LOAD_THRESHOLD = 200
const route = useRoute()
const columns = ref<Array<any[]>>(Array.from({length: columnCount.value}, (): [] => []))
const columnHeights = ref<number[]>(Array(columnCount.value).fill(0))
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

watch(() => route.params.id, () => {
  getPostList(() => {
    columns.value = columns.value.map<[]>(() => []); // 清空每列
  })
});

const getPostList = async (before: Function | null = null) => {
  if (loading.value || !hasMore.value) return
  loading.value = true

  try {
    const res = await _getPostList(page.value, route.params.id)
    console.log("获取帖子列表", res)
    const newPosts = res?.data.posts || []

    if (newPosts.length === 0) {
      hasMore.value = false
      return
    }

    if (before) {
      before()
    }

    newPosts.forEach((post: any) => {
      const shortestColumnIdx = columnHeights.value.indexOf(Math.min(...columnHeights.value))
      columns.value[shortestColumnIdx].push(post)
      columnHeights.value[shortestColumnIdx] += post.height || 300
    })

    page.value++
  } finally {
    loading.value = false
  }
}


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
      class="w-full gap-5 grid p-4 mb-auto"
  >
    <div v-for="(col, colIndex) in columns" :key="colIndex" class="space-y-5">
      <PostHomeItem
          v-for="(item, index) in col"
          :key="`${colIndex}-${index}`"
          :post="item"
      />
    </div>
    <div v-if="loading" class="col-span-full text-center p-4">
      加载中...
    </div>
    <RouterLink v-if="useUserStore().isLogin" :to="{'name': 'post-write'}"
                class="bg-white fixed bottom-10 right-10 size-12 rounded-full border-1 border-gray-200 hover:outline-2 hover:outline-blue-700 flex items-center justify-center">
      <PlusIcon class="size-6"/>
    </RouterLink>
  </div>
</template>
