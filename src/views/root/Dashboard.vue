<script lang="ts" setup>
import logo from "@assets/logo.webp"
import {onMounted, ref} from "vue";
import {adminInfo, adminLogout} from "@api/dashboard.ts";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {
  RiAncientGateLine,
  RiBarChartHorizontalLine,
  RiCloseFill,
  RiHomeLine,
  RiLogoutBoxLine,
  RiMenuFill,
  RiSettingsLine
} from "@remixicon/vue";

const router = useRouter();
const toast = useToast()
const menuShow = ref(false)

const items = [
  {
    type: 'link',
    name: "总览",
    icon: RiHomeLine,
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
  <div class="flex min-h-screen bg-white flex-row max-h-screen">
    <div class="min-w-48 min-h-full flex flex-col z-2 shadow-md shadow-gray-100" :class="{'max-md:fixed inset-0 z-2 bg-white': menuShow, 'max-md:hidden': !menuShow}" @click="menuShow=false">
      <div class="p-4 text-center font-bold text-xl flex items-center justify-center">
        <img :src="logo" alt="logo" class="size-6 rounded-full mr-2"/>
        管理后台
      </div>
      <div class="mt-8 flex flex-col grow pr-4">
        <template v-for="item of items">
          <RouterLink v-if="item.type === 'link'" :to="{'name': item.to }"
                      class="px-4 py-2 box-content border-r-3 border-r-transparent rounded-tr-xl rounded-br-xl"
                      exact-active-class="bg-blue-100">
            <div class="flex items-center justify-center text-gray-700">
              <component :is="item.icon" class="mr-3 size-4 fill-gray-600"/>
              {{ item.name }}
            </div>
          </RouterLink>
          <div v-else>
            <div class="px-4 text-gray-700 text-sm font-bold p-2">{{ item.name }}</div>
          </div>
        </template>
      </div>
      <button
          class="w-full cursor-pointer hover:bg-gray-200 duration-200 mt-auto p-4 border-t border-gray-100 text-center"
          @click="dashboardLogout">
        <span class="flex items-center justify-center gap-2">
          <RiLogoutBoxLine class="size-4"/> 退出登录
        </span>
      </button>
    </div>
    <div class="grow min-h-screen overflow-auto flex flex-col">
      <div class="px-6 py-4 flex gap-1 items-center text-xl font-bold">
        <component :is="$route.meta.icon" />
        {{ $route.meta.title }}</div>
      <div class="grow p-6 bg-gray-50 border-l-1 border-l-gray-100 border-t-1 border-t-gray-100 overflow-auto">
        <RouterView class="min-h-full"/>
      </div>
    </div>
    <button
        class="z-3 md:hidden fixed right-5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white border-1 border-gray-100 cursor-pointer flex items-center justify-center"
        @click="menuShow = !menuShow">
      <component :is="menuShow ? RiCloseFill : RiMenuFill" class="size-4"/>
    </button>
  </div>
</template>