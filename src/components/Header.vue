<script setup lang="ts">
import Logo from "@assets/logo.webp";
import {Bars3Icon, XMarkIcon, InformationCircleIcon} from "@heroicons/vue/16/solid";
import {onMounted, onUnmounted, ref} from "vue";
import {logout as logoutApi} from "@api/user.ts";
import {useUserStore} from "@/stores/user.ts";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router"

const routes = [
  {
    "name": "首页",
    "path": "/",
  },
  {
    "name": "数字",
    "path": "/number",
  },
  {
    "name": "天气",
    "path": "/weather",
  }
]

const userStore = useUserStore();
const router = useRouter();
const menuShow = ref<boolean>(false);
const userMenuShow = ref<boolean>(false);
const toast = useToast()
const userMenu = ref()
const userAvatar = ref()

const logout = async () => {
  await logoutApi();
  await router.push(router.resolve({'name': 'login'}).href);
  userMenuShow.value = false
  userStore.setLogin(false);
  userStore.setUser(null);
  toast.success("成功退出登录")
}

const closeUserMenu = (event: MouseEvent) => {
  if (
      userMenu.value && !userMenu.value.contains(event.target as Node) &&
      userAvatar.value && !userAvatar.value.contains(event.target as Node)
  ) {
    userMenuShow.value = false;
  }
};


onMounted(() => {
  document.addEventListener("click", closeUserMenu);
});

onUnmounted(() => {
  document.removeEventListener("click", closeUserMenu);
});
</script>

<template>
  <div class="flex items-center justify-between w-full text-sm max-w-6xl mx-auto">
    <RouterLink class="flex items-center justify-center" :to="$router.resolve({ name: 'home' }).href">
      <img class="rounded-full overflow-hidden" width="24" height="24" :src="Logo" alt="logo"/>
      <span class="font-bold text-gray-800 ml-2">秦皇岛本地宝</span>
    </RouterLink>
    <div
        class="flex items-center justify-between gap-6 max-md:fixed max-md:inset-0 max-md:flex-col max-md:items-start max-md:p-12 max-md:gap-y-4 max-md:justify-start max-md:bg-gray-50 max-md:text-xl max-md:font-bold"
        :class="{'max-md:hidden': !menuShow, 'max-md:flex': menuShow}">
      <span v-for="route of routes">
        <RouterLink class="hover:text-blue-600" :to="route.path" exact-active-class="text-blue-600"
                    v-html="route.name" v-if="route.path.startsWith('/')" @click="menuShow = false">
        </RouterLink>
      </span>
      <div class="w-full border-1 border-gray-200 md:hidden">
      </div>
      <span v-if="userStore.user" class="md:hidden">用户已登录</span>
      <RouterLink v-if="userStore.user" class="hover:text-blue-600 md:hidden" to="/me" @click="menuShow=false">修改个人信息</RouterLink>
      <button v-if="userStore.user" class="hover:text-blue-600 cursor-pointer md:hidden" @click="logout();menuShow=false">退出登录</button>
      <RouterLink v-else class="hover:text-blue-600 md:hidden" to="/login" @click="menuShow=false">登录</RouterLink>
      <div class="md:block max-md:hidden">
        <RouterLink class="hover:text-blue-600" to="/login" exact-active-class="text-blue-600"
                    v-if="null == userStore.user" @click="menuShow = false">
          登录
        </RouterLink>
        <div v-if="null != userStore.user" class="relative flex max-md:hidden">
          <button class="cursor-pointer hover:text-blue-600"
                  @click="userMenuShow = true" ref="userAvatar">
            <img :src="userStore.user?.information[0].avatar_path ?? '/img/default_avatar.png'"
                 :alt="userStore.user?.information[0].nickname" class="size-6 rounded-full"/>
          </button>
          <div v-if="userMenuShow" ref="userMenu"
               class="absolute p-2 top-full mt-2 bg-white right-0 border-1 border-gray-200 rounded-md overflow-x-hidden overflow-y-auto w-50">
            <div class="font-bold text-base p-3">{{ userStore.user?.information[0].nickname }}</div>
            <RouterLink class="flex items-center justify-between hover:bg-gray-100 rounded-md px-3 py-2 text-gray-700"
                        @click="userMenuShow = false" to="/me">
              <span>修改个人信息</span>
              <InformationCircleIcon class="size-4 fill-gray-700"/>
            </RouterLink>
            <button
                class="cursor-pointer w-full flex items-center justify-between hover:bg-gray-100 rounded-md px-3 py-2 text-gray-700"
                @click="logout">
              <span>退出登录</span>
              <InformationCircleIcon class="size-4 fill-gray-700"/>
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="hidden cursor-pointer items-center justify-center"
       :class="{'max-md:flex': !menuShow, 'max-md:hidden': menuShow}" @click="()=>menuShow=true">
    <Bars3Icon class="size-4"/>
  </div>
  <div class="hidden fixed top-4 right-4 cursor-pointer" :class="{'max-md:block': menuShow, 'max-md:hidden': !menuShow}"
       @click="()=>menuShow=false">
    <XMarkIcon class="size-6"/>
  </div>
</template>