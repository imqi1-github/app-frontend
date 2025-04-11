<script setup lang="ts">
import {ref, watch} from 'vue';
import {useRouter} from "vue-router"
import LineEdit from '@components/inputs/LineEdit.vue';
import Password from "@components/inputs/Password.vue";
import PushButton from "@components/inputs/PushButton.vue";
import {login} from "@api/user";
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/user.ts";

const toast = useToast();

const username = ref("");
const password = ref("");

const userStore = useUserStore();
const router = useRouter();

const updateUsername = (newValue: string): void => {
  username.value = newValue;
}

const updatePassword = (newValue: string): void => {
  password.value = newValue;
}

const submit = async () => {
  let data = {
    username: username.value,
    password: password.value,
  };
  let result = await login(data);
  if (result) {
    userStore.setUser(result.user);
    userStore.setLogin(true);
    console.log("用户登录成功", result.user)
    toast.success(`登录成功`);
    await router.push(router.resolve({name: 'me'}).href)
  }
}

watch(() => userStore.isLogin, (newValue) => {
  if (newValue) {
    router.push(router.resolve({'name': 'me'}).href);
  }
})

</script>

<template>
  <div class="max-w-100 w-full p-4 bg-white rounded-xl">
    <div class="font-bold text-3xl text-gray-600 text-center mb-4">登录</div>
    <LineEdit @updateValue="updateUsername" class="mb-4" placeholder="用户名"/>
    <Password @updateValue="updatePassword" class="mb-4"/>
    <div class="flex items-center justify-center w-full mb-4">
      <PushButton :onClick="submit" text="登录"/>
    </div>
    <div class="text-center text-gray-500 text-sm">用户名：admin 密码：123456</div>
    <div class="text-center text-gray-500 text-sm">还没有账号？前去
      <RouterLink class="text-blue-600 hover:underline" :to="$router.resolve({'name': 'register'}).href">注册
      </RouterLink>
    </div>
  </div>
</template>