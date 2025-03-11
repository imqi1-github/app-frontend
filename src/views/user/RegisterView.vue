<script setup lang="ts">
import {onMounted, ref, watch} from 'vue';
import LineEdit from '@components/inputs/LineEdit.vue';
import Password from "@components/inputs/Password.vue";
import PushButton from "@components/inputs/PushButton.vue";
import {register} from "@api/user";
import {useToast} from "vue-toastification";
import {useRouter} from "vue-router";
import {useUserStore} from "@/stores/user.ts";

const router = useRouter();
const toast = useToast();
const userStore = useUserStore();

const username = ref("");
const password = ref("");
const confirmPasswordValue = ref("");
const email = ref("");

const updateUsername = (newValue: string): void => {
  username.value = newValue;
}

const updatePassword = (newValue: string): void => {
  password.value = newValue;
}

const confirmPassword = (newValue: string): void => {
  confirmPasswordValue.value = newValue;
}

const submit = async () => {
  let data = {
    username: username.value,
    password: password.value,
    confirmPassword: confirmPasswordValue.value,
    email: email.value,
  };
  if (username.value === "") {
    toast.error("用户名不能为空")
    return;
  }
  if (password.value !== confirmPasswordValue.value) {
    toast.error("两次密码不一致")
    return
  }
  if (password.value === "") {
    toast.error("密码不能为空")
    return;
  }
  if (confirmPasswordValue.value === "") {
    toast.error("确认密码不能为空")
    return;
  }
  let result = await register(data);
  if (result) {
    toast.success(`注册成功, 三秒后跳转至登录界面。\nuser_id: ${result.user_id}`);
    setTimeout(() => {
      router.push(router.resolve({'name': 'login'}).href);
    }, 3000)
  }
}

watch(() => userStore.isLogin, () => {
  router.push(router.resolve({'name': 'me'}).href);
})

onMounted(() => {
  if (userStore.isLogin) {
    router.push(router.resolve({'name': 'me'}).href);
  }
})
</script>

<template>
  <div class="max-w-[400px] w-full [&>*]:my-3 p-4">
    <div class="font-bold text-3xl text-gray-600 text-center">注册</div>
    <LineEdit @updateValue="updateUsername" placeholder="用户名 *"/>
    <Password @updateValue="updatePassword" placeholder="密码 *"/>
    <Password @updateValue="confirmPassword" placeholder="确认密码 *"/>
    <div class="flex items-center justify-center w-full">
      <PushButton :onClick="submit" text="注册"/>
    </div>
    <div class="text-center text-gray-500 text-sm">已有账号？前去
      <RouterLink class="text-blue-600 hover:underline" :to="$router.resolve({'name': 'login'}).href">登录</RouterLink>
    </div>
  </div>
</template>