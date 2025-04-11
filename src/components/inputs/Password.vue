<script lang="ts" setup>
import {ref} from 'vue';
import {RiEyeLine, RiEyeCloseLine} from "@remixicon/vue";


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
      <input :type="password ? 'password' : 'text'"
             :id="`form-${placeholder}`"
             @input="handleInput"
             class="w-full peer border-none bg-transparent placeholder-transparent focus:border-transparent focus:ring-0 focus:outline-hidden py-1.5 px-3"
             :placeholder="placeholder"/>

      <span
          class="pointer-events-none absolute start-2.5 top-0 -translate-y-1/2 p-0.5 bg-white text-xs text-gray-700 transition-all peer-placeholder-shown:top-1/2 peer-placeholder-shown:text-sm peer-focus:top-0 peer-focus:text-xs">
          {{ placeholder }}
      </span>
    </label>
    <div class="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
         @click="()=>password=!password">
      <RiEyeCloseLine class="w-4 h-4" v-if="password"/>
      <RiEyeLine class="w-4 h-4" v-else/>
    </div>
  </div>
</template>
