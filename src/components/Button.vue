<template>
  <button @click="onClick"
          class="bg-blue-500 hover:bg-blue-400 text-white px-2 py-1 rounded-md cursor-pointer min-h-[1.25rem] min-w-[1.5rem]">
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
