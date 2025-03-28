<script setup>
import {onMounted, onUnmounted, ref} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

const mainMap = ref(null);
let map = null;

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "98a9fac5ea2056c6af5f1b2c027b9e9f",
  };
  AMapLoader.load({
    key: "93a59a4ed2ee6381eda359b67e2bfe76", // 申请好的Web端开发者Key，首次调用 load 时必填
    version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
    plugins: ["AMap.Scale"], //需要使用的的插件列表，如比例尺'AMap.Scale'，支持添加多个如：['...','...']
  })
      .then((AMap) => {
        map = new AMap.Map(mainMap.value, {
          // 设置地图容器id
          viewMode: "3D", // 是否为3D地图模式
          zoom: 11, // 初始化地图级别
          center: [116.397428, 39.90923], // 初始化地图中心点位置
        });
      })
      .catch((e) => {
        console.error(e);
      });
});

onUnmounted(() => {
  map?.destroy();
});
</script>

<template>
  <div class="w-full max-w-200">
    <div ref="mainMap" class="w-full h-150 bg-white rounded-2xl"></div>
  </div>
</template>