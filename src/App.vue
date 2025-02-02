<script lang="ts" setup>
import {onMounted, ref} from "vue";
import Button from "@/components/Button.vue";
import {getNumber, setNumber as _setNumber, plusNumber as _plusNumber} from "@/api/number";

let number = ref<string | number>("获取中");

const setNumber = async () => {
  let response = await _setNumber();
  number.value = response.number;
}

const plusNumber = async () => {
  let response = await _plusNumber();
  number.value = response.number;
}

onMounted(async () => {
  console.log(`项目渲染完成，后端地址为 ${import.meta.env.VITE_API_URL}`);

  let response = await getNumber();
  number.value = response.number;
})
</script>

<template>
  <div class="flex items-center justify-center w-screen h-screen">
    <div class="text-center">
      <header>
        <img src="./assets/logo.png" alt="logo" class="max-w-[200px]"/>
      </header>
      <main class="my-4">
        <p>本项目实现是一个计数器</p>
        <p>当前数字：{{ number }}</p>
      </main>
      <footer class="flex items-center justify-center gap-4">
        <Button :on-click="plusNumber" text="数字加一"/>
        <Button :on-click="setNumber" text="重置数字"/>
      </footer>
    </div>
  </div>
</template>