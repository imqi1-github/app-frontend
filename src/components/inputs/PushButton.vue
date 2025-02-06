<template>
  <button @click="onClick"
          class="px-4 py-1.5 text-white bg-blue-700 w-fit rounded-xl hover:bg-blue-500 duration-300 text-sm cursor-pointer">
    {{ text }}
  </button>
</template>

<script lang="ts" setup>
import {type PropType} from "vue";

defineProps({
  onClick: {
    type: Function as PropType<() => void>,
    required: true,
  },
  text: {
    type: String,
    required: true,
  }
})
</script>
