<script lang="ts" setup>
import { ref } from 'vue';

defineProps({
  placeholder: {
    type: String,
    default: '请输入',
  }
});

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
        type="text"
        class="w-full outline outline-gray-400 px-4 pt-4 pb-0.75 text-lg leading-2 focus:outline-blue-500 rounded-2xl"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        ref="inputElement"
    />
    <div
        class="absolute inset-0 px-4 py-2.5 text-gray-500 pointer-events-none select-none duration-300 transition-all"
        :class="{'pt-1 text-[0.6rem]': isInputing}"
    >
      {{ placeholder }}
    </div>
  </div>
</template>
