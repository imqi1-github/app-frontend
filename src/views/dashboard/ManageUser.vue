<template>
  <div v-if="data">
    <div class="rounded-xl bg-white flex flex-col divide-y-1 divide-gray-200">
      <div class="p-4 flex justify-between items-center">
        <PushButton :onClick="() => $router.push({name: 'dashboard-user-add'})" text="新增"/>
        <div class="flex gap-3 items-center">
          <button class="border-gray-200 border-1 hover:bg-gray-50 p-2 items-center flex justify-center rounded-md"
                  text="刷新"
                  @click="thisGetUserList">
            <RiRefreshLine class="size-4 fill-gray-800"/>
          </button>
          <div class="items-center flex justify-center">
            <div
                class="rounded-md flex border-1 border-gray-200 h-9 divide-x-1 divide-gray-200 *:px-1 *:hover:bg-gray-100">
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === 1}"
                      :disabled="page === 1"
                      text="上一页"
                      @click="$router.push({'name': 'dashboard-manage-user-page', params: {page: page - 1}})">
                <RiArrowLeftSLine class="size-6 fill-gray-700"/>
              </button>
              <div class="flex-1 flex justify-center items-center">
                <div class="text-gray-500 px-2">{{ page }}/{{ data.pages }}</div>
              </div>
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === data.pages}"
                      :disabled="page === data.pages"
                      text="下一页"
                      @click="$router.push({'name': 'dashboard-manage-user-page', params: {page: page + 1}})">
                <RiArrowRightSLine class="size-6 fill-gray-700"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divide-y-1 divide-gray-100">
        <div v-for="user of data.users" class="flex gap-2 items-center py-2 px-4 justify-between flex-wrap">
          <div class="flex items-center gap-2">
            <img :src="user.information.avatar_path" alt="用户头像" class="size-11 rounded-full"/>
            <div class="flex gap-1 flex-col">
              <div class="font-medium text-gray-800 flex items-center gap-1">{{ user.information.nickname }} <span
                  :class="user.state == 'active' ? 'bg-green-600' : 'bg-red-500'"
                  class="px-1 rounded p-0.25 text-[10px] text-white">{{
                  user.state == 'active' ? '正常' : '封禁'
                }}</span>
              </div>
              <div class="text-xs text-gray-500">{{ user.username }}</div>
            </div>
          </div>
          <div class="flex gap-4 items-center text-sm flex-wrap">
            <div :class="{'bg-black text-white': user.role == 'admin'}"
                 class="flex gap-1 items-center px-2 rounded py-0.5 border-1 border-gray-200">
              <RiVipCrownLine v-if="user.role == 'admin'" class="size-4 full-white"/>
              {{ user.role == 'admin' ? '管理员' : '普通用户' }}
            </div>
            <div class="flex gap-1 items-center">
              <RiImageLine class="size-4"/>
              {{ user.uploads.length }}
            </div>
            <PushButton :on-click="() => $router.push({'name': 'post-me', params: {id: user.id}})" text="查看"/>
            <PushButton :on-click="() => $router.push({'name': 'dashboard-user-edit', params: {id: user.id}})"
                        text="编辑"/>
            <button
                :class="user.state != 'active' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-500 hover:bg-red-400'"
                class="cursor-pointer rounded-lg px-3 py-1.5 text-sm text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="thisChangeUserState(user.id)">
              {{ user.state == 'active' ? '设为“封禁”' : '设为“正常”' }}
            </button>
          </div>
        </div>
        <div class="py-2 px-4 text-gray-600 text-sm">
          已有 {{ data.users_list }} 名用户注册，其中有 {{ data.banned }} 名用户被封禁
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="flex justify-center items-center h-full">
      <div class="text-gray-500">暂无数据</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import PushButton from "@components/inputs/PushButton.vue";
import {RiArrowLeftSLine, RiArrowRightSLine, RiImageLine, RiRefreshLine, RiVipCrownLine} from "@remixicon/vue";
import {useRoute} from "vue-router";
import {getUserList, setUserState} from "@api/dashboard.ts";
import {onMounted, ref} from "vue";

const route = useRoute()
const page = Number(route.params.page ?? 1)
const data = ref()

const thisGetUserList = async () => {
  const res = await getUserList(page)
  console.log("获取到用户列表：", res)
  data.value = res
}

const thisChangeUserState = async (id: number) => {
  const res = await setUserState(id)
  console.log("设置用户状态：", res)
  if (res.msg) {
    await thisGetUserList()
  }
}

onMounted(() => {
  thisGetUserList()
})
</script>