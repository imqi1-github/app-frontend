<script lang="ts" setup>

defineProps({
  placeholder: {
    type: String,
    default: '请输入',
  }
});

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
  <div class="relative w-full bg-white">
    <label :for="`form-${placeholder}`"
           class="box-content relative block rounded-md border border-gray-200 shadow-xs focus-within:border-blue-600 focus-within:ring-1 focus-within:ring-blue-600">
      <input type="text"
             :id="`form-${placeholder}`"
             @input="handleInput"
             class="w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden py-1.5 px-3"
             :placeholder="placeholder"/>

      <span
          class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 bg-white p-0.5 text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          {{ placeholder }}
      </span>
    </label>
  </div>
</template>
