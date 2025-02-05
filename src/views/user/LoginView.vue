<script setup lang="ts">
import {ref} from 'vue';
import LineEdit from '@components/inputs/LineEdit.vue';
import Password from "@components/inputs/Password.vue";
import PushButton from "@components/inputs/PushButton.vue";
import {login} from "@api/user";
import {useToast} from "vue-toastification";

const toast = useToast();

const username = ref("");
const password = ref("");

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
    toast.success(`登录成功, user_id: ${result.user_id}`);
  }
}
</script>

<template>
  <div class="max-w-[400px] w-full [&>*]:my-2">
    <div class="font-bold text-3xl text-gray-600 text-center">登录</div>
    <LineEdit @updateValue="updateUsername" placeholder="用户名"/>
    <Password @updateValue="updatePassword"/>
    <div class="flex items-center justify-center w-full">
      <PushButton :onClick="submit" text="登录"/>
    </div>
    <div class="text-center text-gray-500 text-sm">用户名：admin 密码：123456</div>
  </div>
</template>