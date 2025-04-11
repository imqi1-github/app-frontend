<script setup>
import {onMounted, onUnmounted, ref, useTemplateRef} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {RiFullscreenLine, RiFullscreenExitFill} from "@remixicon/vue";

const mainMap = useTemplateRef("mainMap");
const container = useTemplateRef("container");

function parseQuery() {
  const url = new URL(window.location.href);
  return new URLSearchParams(url.search);
}

let map = null;
const isFullScreen = ref(false);
const query = parseQuery();
let location;
let zoom;

onMounted(() => {
  window._AMapSecurityConfig = {
    securityJsCode: "98a9fac5ea2056c6af5f1b2c027b9e9f",
  };
  if (query.has("location")) {
    location = query.get("location").split(",");
  }
  if (query.has("zoom")) {
    zoom = Number(query.get("zoom"))
  }
  AMapLoader.load({
    key: import.meta.env.VITE_MAP_KEY,
    version: "2.0",
    plugins: ["AMap.Scale", "AMap.Geolocation"],
  })
      .then((AMap) => {
        map = new AMap.Map(mainMap.value, {
          viewMode: "3D",
          zoom: zoom || 10,
          center: location
        });
        AMap.plugin('AMap.ToolBar', function () {
          var scale = new AMap.Scale(); //缩放工具条实例化
          map.addControl(scale); //添加控件
        });
        AMap.plugin('AMap.Geolocation', function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认：true
            timeout: 10000, // 设置定位超时时间，默认：无穷大
            offset: [8, 50],  // 定位按钮的停靠位置的偏移量
            zoomToAccuracy: true,  //  定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            position: 'RB' //  定位按钮的排放位置,  RB表示右下
          })

          geolocation.getCurrentPosition(function (status, result) {
            if (status === 'complete') {
              onComplete(result)
            } else {
              onError(result)
            }
          });

          function onComplete(data) {
            // data是具体的定位信息
          }

          function onError(data) {
            // 定位出错
          }

          map.addControl(geolocation); //添加控件
        })
      })
      .catch((e) => {
        console.error(e);
      });
});

onUnmounted(() => {
  map?.destroy();
});

const toggleFullScreen = () => {
  if (!isFullScreen.value) {
    container.value.requestFullscreen()
        .then(() => {
          isFullScreen.value = true;
        })
        .catch((err) => {
          console.error("进入全屏失败:", err);
        });
  } else {
    document.exitFullscreen()
        .then(() => {
          isFullScreen.value = false;
        })
        .catch((err) => {
          console.error("退出全屏失败:", err);
        });
  }
};
</script>

<template>
  <div ref="container" class="size-full relative">
    <div
        ref="mainMap"
        class="size-full bg-white"
    ></div>
    <div
        class="bg-white rounded-full flex p-2 absolute bottom-2 right-2 cursor-pointer"
        @click="toggleFullScreen"
    >
      <RiFullscreenLine v-if="!isFullScreen" class="size-4 fill-gray-500"/>
      <RiFullscreenExitFill v-else class="size-4 fill-gray-500"/>
    </div>
  </div>
</template>