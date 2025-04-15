<template>
  <button @click="onClick"
          class="cursor-pointer rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white shadow-xs hover:bg-blue-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
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
