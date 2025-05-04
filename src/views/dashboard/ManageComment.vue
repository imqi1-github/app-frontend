<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {deleteComment, getComments} from "@api/dashboard.ts";
import {useRoute} from "vue-router";
import PushButton from "@components/inputs/PushButton.vue";
import {RiArrowLeftSLine, RiArrowRightSLine, RiRefreshLine} from "@remixicon/vue";
import {useToast} from "vue-toastification";
import {formatRelativeTime} from "@/utils/time.ts";

const data = ref()
const route = useRoute()
const page = Number(route.params.page ?? 1)
const toast = useToast()
const per_page = ref(route.query.per_page ?? 12)

const thisGetComments = async () => {
  const res = await getComments(page, per_page.value)
  console.log("获取到评论列表：", res)
  data.value = res
}

const thisDeleteComment = async (id: number) => {
  const res = await deleteComment(id);
  if (res.msg) {
    toast.success(res.msg)
    await thisGetComments()
  }
}

onMounted(() => {
  thisGetComments()
})
</script>
<template>
  <div v-if="data" class="">
    <div class="rounded-xl bg-white flex flex-col divide-y-1 divide-gray-200">
      <div class="p-4 flex justify-end items-center">
        <div class="flex gap-3 items-center">
          <div class="flex items-center gap-1 text-gray-800">
            每页
            <input
                v-model="per_page"
                :max="data.posts_counts"
                class="border-gray-200 border-1 hover:bg-gray-50 p-1 items-center flex justify-center rounded-md focus:outline-blue-600 w-14"
                min="1" type="number" @click="thisGetComments"/>
            条数据
          </div>
          <button class="border-gray-200 border-1 hover:bg-gray-50 p-2 items-center flex justify-center rounded-md"
                  text="刷新"
                  @click="thisGetComments">
            <RiRefreshLine class="size-4 fill-gray-800"/>
          </button>
          <div class="items-center flex justify-center">
            <div
                class="rounded-md flex border-1 border-gray-200 h-9 divide-x-1 divide-gray-200 *:px-1 *:hover:bg-gray-100">
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === 1}"
                      :disabled="page === 1"
                      text="上一页"
                      @click="$router.push({'name': 'dashboard-manage-comment-page', params: {page: page - 1}, query: {per_page: per_page}})">
                <RiArrowLeftSLine class="size-6 fill-gray-700"/>
              </button>
              <div class="flex-1 flex justify-center items-center">
                <div class="text-gray-500 px-2">{{ page }}/{{ data.pages }}</div>
              </div>
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === data.pages}"
                      :disabled="page === data.pages"
                      text="下一页"
                      @click="$router.push({'name': 'dashboard-manage-comment-page', params: {page: page + 1}, query: {per_page: per_page}})">
                <RiArrowRightSLine class="size-6 fill-gray-700"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divide-y-1 divide-gray-100">
        <div v-for="comment of data.comments" class="flex gap-2 items-center py-2 px-4 justify-between flex-wrap">
          <div class="flex gap-1 flex-col">
            <div class="text-gray-800 text-base">
              {{ comment.content }}
            </div>
            <div class="text-xs text-gray-500">发布于 {{ formatRelativeTime(comment.create_time) }}
            </div>
          </div>
          <div class="flex gap-4 items-center text-sm flex-wrap">
            <div class="flex gap-1 items-center">
              <img :src="comment.user.information.avatar_path" alt="头像" class="size-6 rounded-full"/>
              {{ comment.user.information.nickname }}
            </div>
            <PushButton :on-click="() => $router.push({'name': 'post-content', params: {id: comment.post_id}})"
                        text="查看"/>
            <button
                class="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                @click="thisDeleteComment(comment.id)">
              删除
            </button>
          </div>
        </div>
        <div class="py-2 px-4 text-gray-600 text-sm">
          累计已发送 {{ data.comments_count }} 条评论
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-4">获取中</div>
</template>