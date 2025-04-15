<script lang="ts" setup>
//@ts-ignore
import MapView from "@views/root/MapView.vue";
import {getLocationByCoordinates} from "@api/map.ts";

// 定义 LocationInfo 接口
interface LocationInfo {
  show: boolean;
  e: { lng?: number; lat?: number };
  position?: {
    regeocode?: { formatted_address: string };
  };
  replace: boolean;
}

const props = defineProps<{
  data: LocationInfo;
}>();

const emit = defineEmits<{
  (e: "update:data", value: LocationInfo): void;
  (e: "close"): void;
}>();

const closeMap = () => {
  if (props.data.show) {
    emit("close");
  }
};

const thisClickHandle = (e: any) => {
  // 更新 e
  emit("update:data", {
    ...props.data,
    e,
  });

  // 获取地址
  getLocationByCoordinates(e).then((res) => {
    console.log("获取坐标", res);
    emit("update:data", {
      ...props.data,
      position: res,
      show: false,
      replace: true,
    });
  });
};
</script>

<template>
  <div
      v-show="data?.show"
      class="z-3 !fixed inset-0 backdrop-blur-lg border-3 border-white rounded-lg overflow-hidden"
  >
    <div class="z-4 absolute inset-4 bg-white">
      <MapView
          :click-event-obj="data.e"
          :exit="true"
          class="z-5"
          @click-handle="thisClickHandle"
          @exit-handle="closeMap"
      />
    </div>
  </div>
</template>