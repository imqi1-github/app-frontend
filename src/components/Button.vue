<template>
  <button @click="onClick" class="bg-teal-500 text-white p-2.5 px-3 rounded cursor-pointer min-h-[1.25rem] min-w-[1.5rem]">
    {{ text }}
  </button>
</template>

<script lang="ts" setup>
import {type PropType} from "vue";

defineProps({
  onClick: {
    type: Function as PropType<() => void>,
  },
  text: String,
})
</script>
