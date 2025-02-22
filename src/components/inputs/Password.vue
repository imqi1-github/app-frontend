<script lang="ts" setup>
import {ref} from 'vue';
import {EyeIcon} from "@heroicons/vue/16/solid";
import {EyeSlashIcon} from "@heroicons/vue/16/solid";


defineProps({
  placeholder: {
    type: String,
    default: '密码',
  }
});

const password = ref<boolean>(true);

const emit = defineEmits<{
  (event: 'updateValue', value: string): void;
}>();

const isInputing = ref<boolean>(false);
const inputElement = ref<HTMLInputElement | null>(null);

// 处理输入事件
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const newValue = input.value;

  emit('updateValue', newValue);
};

// 处理焦点事件
const handleFocus = () => {
  isInputing.value = true;
};

// 处理失去焦点事件
const handleBlur = () => {
  // 空值检查，确保 inputElement 不为 null
  if (inputElement.value) {
    isInputing.value = inputElement.value.value.length > 0;
  }
};
</script>

<template>
  <div class="relative bg-inherit w-full">
    <input
        :type="password ? 'password' : 'text'"
        class="w-full outline outline-gray-400 px-4 pt-4 pb-0.75 text-lg leading-2 focus:outline-blue-500 rounded-2xl"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="inputElement"
    />
    <div class="absolute inset-0 px-4 py-2 text-gray-500 pointer-events-none select-none duration-300 transition-all"
         :class="{'pt-0.5 text-[0.6rem]': isInputing}">
      {{ placeholder }}
    </div>
    <div class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
         @click="()=>password=!password">
      <EyeIcon class="w-4 h-4" v-if="password"/>
      <EyeSlashIcon class="w-4 h-4" v-else/>
    </div>
  </div>
</template>
