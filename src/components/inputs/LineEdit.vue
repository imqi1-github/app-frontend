<script lang="ts" setup>
import {defineEmits} from 'vue';

defineProps({
  placeholder: {
    type: String,
    default: '请输入',
  }
})

const emit = defineEmits<{
  (event: 'updateValue', value: string): void;
}>();

// 处理输入事件
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const newValue = input.value;

  emit('updateValue', newValue);
};
</script>

<template>
  <input class="w-full border-blue-600 border-[1px] rounded-xl py-1 px-2" type="text" @input="handleInput"
         :placeholder="placeholder"/>
</template>