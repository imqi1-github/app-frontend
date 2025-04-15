<script lang="ts" setup>
import logo from "@assets/logo.webp"
import {onMounted} from "vue";
import {adminInfo, adminLogout} from "@api/dashboard.ts";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {
  RiAncientGateLine,
  RiArrowLeftSLine,
  RiBarChartLine,
  RiFileLine,
  RiHomeLine,
  RiLogoutCircleLine,
  RiSettingsLine,
  RiUserLine
} from "@remixicon/vue";
import {useUserStore} from "@/stores/user.ts";

const router = useRouter();
const toast = useToast()
const userStore = useUserStore()
const items = [
  {
    type: 'link',
    name: '首页',
    icon: RiHomeLine,
    to: 'home'
  },
  {
    type: 'link',
    name: "总览",
    icon: RiBarChartLine,
    to: 'dashboard-home',
  },
  {
    type: 'tag',
    name: '内容',
  },
  {
    type: 'link',
    name: "景点",
    icon: RiAncientGateLine,
    to: 'dashboard-spot',
  },
  {
    type: "link",
    name: "帖子",
    icon: RiFileLine,
    to: "dashboard-manage-post"
  },
  {
    type: "tag",
    name: "站点",
  },
  {
    type: 'link',
    name: "用户",
    icon: RiUserLine,
    to: 'dashboard-manage-user',
  },
  {
    type: 'link',
    name: "设置",
    icon: RiSettingsLine,
    to: 'dashboard-setting',
  },
]

const dashboardLogout = async () => {
  let result = await adminLogout()

  if (result.msg) {
    toast.success(result.msg)

    setTimeout(() => {
      router.push('/dashboard/login')
    })
  }
}

onMounted(async () => {
  let result = await adminInfo();
  if (result) {
    toast.success(`欢迎，${result.information.nickname}`);
  } else {
    await router.push('/dashboard/login')
  }
})
</script>
<template>
  <div class="max-md:flex-col-reverse flex min-h-screen bg-white flex-row md:max-h-screen">
    <div
        class="sticky bottom-0 min-w-48 bg-white flex md:flex-col z-2 shadow-md shadow-gray-100 overflow-y-auto max-md:border-t-1 max-md:border-t-gray-100">
      <div class="max-md:hidden p-4 text-center font-bold text-xl flex items-center justify-center">
        <img :src="logo" alt="logo" class="size-6 rounded-full mr-2"/>
        管理后台
      </div>
      <div class="bg-white md:mt-8 flex md:flex-col grow md:pr-4 max-md:*:py-3 max-md:bg-black">
        <template v-for="item of items">
          <RouterLink v-if="item.type === 'link'"
                      :class="{'bg-blue-100 font-bold max-md:bg-gray-800': $route.matched.some(route => route.name === item.to)}"
                      :to="{'name': item.to }"
                      class="px-4 py-2 box-content border-r-3 border-r-transparent rounded-tr-xl rounded-br-xl max-md:grow max-md:flex max-md:items-center max-md:justify-center max-md:rounded-none">
            <div class="flex items-center text-gray-800">
              <component :is="item.icon" class="md:mr-3 size-4 fill-gray-800 max-md:fill-white"/>
              <div class="max-md:hidden">{{ item.name }}</div>
            </div>
          </RouterLink>
          <div v-else>
            <div class="px-4 max-md:hidden text-gray-700 text-sm font-bold p-2">{{ item.name }}</div>
          </div>
        </template>
        <button
            class="flex items-center justify-center cursor-pointer duration-200 p-2 grow md:hidden bg-black"
            @click="dashboardLogout">
          <RiLogoutCircleLine class="fill-white rotate-180 size-4"/>
        </button>
      </div>
      <div class="flex items-center justify-between p-3 max-md:hidden">
        <div class="flex gap-1">
          <img :src="userStore.user?.information.avatar_path" alt="头像"
               class="size-9 rounded-full border-1 border-gray-300"/>
        </div>
        <div class="flex gap-1">
          <RouterLink :to="{name: 'me'}"
                      class="flex items-center justify-center cursor-pointer duration-200 mt-auto p-2 hover:bg-gray-200 rounded-full">
            <RiUserLine class="size-4"/>
          </RouterLink>
          <button
              class="flex items-center justify-center cursor-pointer duration-200 mt-auto p-2 hover:bg-gray-200 rounded-full"
              @click="dashboardLogout">
            <RiLogoutCircleLine class="rotate-180 size-4"/>
          </button>
        </div>
      </div>
    </div>
    <div class="grow md:min-h-screen md:overflow-auto flex flex-col">
      <div class="px-6 py-4 flex gap-1 items-center text-xl font-bold">
        <button class="cursor-pointer rounded-full hover:bg-gray-200 p-1" @click="$router.back">
          <RiArrowLeftSLine class="size-6"/>
        </button>
        <component :is="$route.meta.icon"/>
        {{ $route.meta.title }}
      </div>
      <div class="grow p-6 bg-gray-50 border-l-1 border-l-gray-100 border-t-1 border-t-gray-100 overflow-auto">
        <RouterView :key="$route.fullPath" class="min-h-full"/>
      </div>
    </div>
  </div>
</template>