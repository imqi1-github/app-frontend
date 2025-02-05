<script lang="ts" setup>
import {onMounted, ref} from "vue";
import PushButton from "@components/inputs/PushButton.vue";
import {getNumber, setNumber as _setNumber, plusNumber as _plusNumber} from "@/api/number";
import viteLogo from "@/assets/logo.svg"
import {useToast} from "vue-toastification";

let number = ref<string | number>("获取中");
let toast = useToast();

const setNumber = async () => {
  let response = await _setNumber();
  number.value = response.number;
}

const plusNumber = async () => {
  let response = await _plusNumber();
  number.value = response.number;
}

const notify = () => {
  toast.info("这是弹窗内容");
}

onMounted(async () => {
  console.log(`项目渲染完成，后端地址为 ${import.meta.env.VITE_API_URL}`);

  let response = await getNumber();
  number.value = response.number;
})
</script>

<template>
  <div class="flex items-center justify-center text-center">
    <div>
      <div>
        <img :src="viteLogo" alt="logo" class="max-w-[200px] m-auto"/>
      </div>
      <div class="my-4">
        <p>该页面实现了一个计数器</p>
        <p>当前数字：{{ number }}</p>
      </div>
      <div class="flex items-center justify-center gap-4">
        <PushButton :onClick="plusNumber" text="数字加一"/>
        <PushButton :onClick="setNumber" text="重置数字"/>
        <PushButton :onClick="notify" text="弹窗"/>
      </div>
    </div>
  </div>
</template>