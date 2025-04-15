<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {setPublished} from "@api/dashboard.ts";
import {useRoute} from "vue-router";
import PushButton from "@components/inputs/PushButton.vue";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiHeartLine,
  RiImageLine,
  RiMessage2Line,
  RiRefreshLine
} from "@remixicon/vue";
import {useToast} from "vue-toastification";
import {getPostList} from "@api/dashboard";
import {formatRelativeTime} from "@/utils/time.ts";

const data = ref()
const route = useRoute()
const page = Number(route.params.page ?? 1)
const toast = useToast()
const per_page = ref(12)

const thisGetPostList = async () => {
  const res = await getPostList(page, per_page.value)
  console.log("获取到帖子列表：", res)
  data.value = res
}

const thisSetPostPublish = async (id: number) => {
  const res = await setPublished(id)
  if (res.msg) {
    toast.success(res.msg)
    await thisGetPostList()
  }
  console.log("设置是否合规：", res)
}

onMounted(() => {
  thisGetPostList()
})
</script>
<template>
  <div v-if="data" class="">
    <div class="rounded-xl bg-white flex flex-col divide-y-1 divide-gray-200">
      <div class="p-4 flex justify-between items-center">
        <PushButton :onClick="() => $router.push({name: 'dashboard-add-spot'})" text="新增"/>
        <div class="flex gap-3 items-center">
          <div class="flex items-center gap-1 text-gray-800">
            每页
            <input
                v-model="per_page"
                :max="data.posts_counts"
                class="border-gray-200 border-1 hover:bg-gray-50 p-1 items-center flex justify-center rounded-md focus:outline-blue-600 w-14"
                min="1" type="number" @click="thisGetPostList"/>
            条数据
          </div>
          <button class="border-gray-200 border-1 hover:bg-gray-50 p-2 items-center flex justify-center rounded-md"
                  text="刷新"
                  @click="thisGetPostList">
            <RiRefreshLine class="size-4 fill-gray-800"/>
          </button>
          <div class="items-center flex justify-center">
            <div
                class="rounded-md flex border-1 border-gray-200 h-9 divide-x-1 divide-gray-200 *:px-1 *:hover:bg-gray-100">
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === 1}"
                      :disabled="page === 1"
                      text="上一页"
                      @click="$router.push({'name': 'dashboard-manage-post-page', params: {page: page - 1}})">
                <RiArrowLeftSLine class="size-6 fill-gray-700"/>
              </button>
              <div class="flex-1 flex justify-center items-center">
                <div class="text-gray-500 px-2">{{ page }}/{{ data.pages }}</div>
              </div>
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === data.pages}"
                      :disabled="page === data.pages"
                      text="下一页"
                      @click="$router.push({'name': 'dashboard-manage-post-page', params: {page: page + 1}})">
                <RiArrowRightSLine class="size-6 fill-gray-700"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divide-y-1 divide-gray-100">
        <div v-for="post of data.posts" class="flex gap-2 items-center py-2 px-4 justify-between flex-wrap">
          <div class="flex gap-1 flex-col">
            <div class="font-medium text-gray-800 flex items-center gap-1">{{ post.title }} <span
                :class="post.published==1 ? 'bg-green-500' : 'bg-red-500'"
                class="px-1 rounded p-0.25 text-[10px] text-white">{{
                post.published == 1 ? '合规' : '不合规'
              }}</span></div>
            <div class="text-xs text-gray-500">发布于 {{ formatRelativeTime(post.create_time) }}，共 {{
                post.content.length
              }} 字
            </div>
          </div>
          <div class="flex gap-4 items-center text-sm flex-wrap">
            <div v-for="category of post.categories"
                 class="flex gap-1 items-center px-2 rounded py-0.5 border-1 border-gray-200">
              {{ category.name }}
            </div>
            <div class="flex gap-1 items-center">
              <img :src="post.user.information.avatar_path" alt="头像" class="size-6 rounded-full"/>
              {{ post.user.information.nickname }}
            </div>
            <div class="flex gap-1 items-center">
              <RiMessage2Line class="size-4"/>
              {{ post.comments.length }}
            </div>
            <div class="flex gap-1 items-center">
              <RiImageLine class="size-4"/>
              {{ post.attachments.length }}
            </div>
            <div class="flex gap-1 items-center">
              <RiHeartLine class="size-4 fill-red-600"/>
              {{ post.likes }}
            </div>
            <PushButton :on-click="() => $router.push({'name': 'post-content', params: {id: post.id}})" text="查看"/>
            <button
                :class="post.published==0 ? 'bg-green-500 hover:bg-green-400' : 'bg-red-500 hover:bg-red-400'"
                class="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="thisSetPostPublish(post.id)">
              {{ post.published == 1 ? '设为“不合规”' : '设为“合规”' }}
            </button>
          </div>
        </div>
        <div class="py-2 px-4 text-gray-600 text-sm">
          累计已发送 {{ data.posts_count }} 条帖子，有 {{ data.not_published }} 条不合规
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-4">获取中</div>
</template>