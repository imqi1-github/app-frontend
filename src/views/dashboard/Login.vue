<script setup lang="ts">
import LineEdit from "@components/inputs/LineEdit.vue";
import Password from "@components/inputs/Password.vue";
import PushButton from "@components/inputs/PushButton.vue";
import {onMounted, ref} from "vue";
import {adminInfo, adminLogin} from "@api/dashboard.ts";
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification";

const toast = useToast();
const router = useRouter();

const [
  username, password
] = [
  ref<string>(""), ref<string>(""),
]

const [
  updateUsername, updatePassword
] = [
  (newValue: string) => {
    username.value = newValue;
  },
  (newValue: string) => {
    password.value = newValue;
  }
]

const dashboardLogin = async () => {
  let result = await adminLogin({
    username: username.value,
    password: password.value,
  })
  if (result) {
    toast.success(result.msg);
    await router.push("/dashboard");
  }
}

onMounted(async () => {
  let result = await adminInfo(false);
  if (result) {
    await router.push("/dashboard");
  }
})
</script>
<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="min-w-xl py-6 px-12 bg-white flex items-center justify-center rounded-2xl flex-col">
      <div class="text-2xl font-bold">登录后台</div>
      <div class="w-full *:my-4">
        <LineEdit @updateValue="updateUsername" placeholder="用户名"/>
        <Password @updateValue="updatePassword" placeholder="密码"/>
        <p class="text-xs text-gray-600 text-center">用户名：admin 密码：123456</p>
        <div class="text-center">
          <PushButton :onClick="dashboardLogin" text="登录"/>
        </div>
      </div>
    </div>
  </div>
</template>