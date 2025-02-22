<script setup lang="ts">
import logo from "@assets/logo.jpg"
import {onMounted} from "vue";
import {adminInfo, adminLogout} from "@api/dashboard.ts";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {HomeIcon, ChartBarIcon, Bars3CenterLeftIcon, Cog6ToothIcon, ArrowRightEndOnRectangleIcon} from "@heroicons/vue/16/solid";

const router = useRouter();
const toast = useToast()

const items = [
  {
    name: "总览",
    icon: HomeIcon,
    to: 'dashboard-home',
  },
  {
    name: "统计",
    icon: ChartBarIcon,
    to: 'dashboard-statistics',
  },
  {
    name: "管理",
    icon: Bars3CenterLeftIcon,
    to: 'dashboard-manage',
  },
  {
    name: "设置",
    icon: Cog6ToothIcon,
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
    toast.success(`欢迎，${result.nickname}`);
  } else {
    await router.push('/dashboard/login')
  }
})
</script>
<template>
  <div class="flex min-h-screen bg-gray-50 flex-row">
    <div class="min-w-48 min-h-full border-r border-r-gray-200 flex flex-col">
      <div class="p-4 text-center font-bold text-xl flex items-center justify-center">
        <img class="size-8 rounded-full mr-2" :src="logo" alt="logo"/>
        管理后台
      </div>
      <div class="mt-8 flex flex-col grow">
        <RouterLink v-for="item of items" :to="$router.resolve({'name': item.to}).href"
                    class="py-2 box-content border-r-2 border-r-gray-50"
                    exact-active-class="border-r-gray-300 bg-gray-100">
          <div class="flex items-center justify-center">
            <component :is="item.icon" class="mr-2 size-4"/> {{ item.name }}
          </div>
        </RouterLink>
      </div>
      <button @click="dashboardLogout"
              class="w-full cursor-pointer hover:bg-gray-200 duration-200 mt-auto p-4 border-t border-gray-200 text-center">
        <div class="flex items-center justify-center gap-2"><ArrowRightEndOnRectangleIcon class="size-4" /> 退出登录</div>
      </button>
    </div>
    <div class="flex-auto p-4 min-h-full">
      <RouterView/>
    </div>
  </div>
</template>