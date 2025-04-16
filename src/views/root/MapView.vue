<script setup>
import {onMounted, onUnmounted, ref, useTemplateRef} from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {RiCloseLine, RiFullscreenExitFill, RiFullscreenLine} from "@remixicon/vue";
import {getSpots} from "@api/map.js";
import {useRoute, useRouter} from "vue-router";

const props = defineProps({
  exit: {
    type: Boolean,
    default: false,
  },
  clickEventObj: {
    type: [Object, String],
    default: "NoNeed",
  },
});
const emit = defineEmits(["exitHandle", "clickHandle"]);

const mainMap = useTemplateRef("mainMap");
const container = useTemplateRef("container");
const showOtherPins = ref(true);
const route = useRoute();

if (props.exit || route.query?.p === "1") {
  showOtherPins.value = false;
}

function parseQuery() {
  const url = new URL(window.location.href);
  return new URLSearchParams(url.search);
}

let map = null;
const isFullScreen = ref(false);
const query = parseQuery();
let location;
let zoom;

const points = ref()
let mapLoaded = false;

const thisClickHandler = (e) => {
  e = e.lnglat.getLng() + ',' + e.lnglat.getLat()
  emit("clickHandle", e)
  console.log("点击了地图", e);
};

const loadMap = () => {
  window._AMapSecurityConfig = {
    securityJsCode: "98a9fac5ea2056c6af5f1b2c027b9e9f",
  };
  if (query.has("location")) {
    location = query.get("location").split(",");
  }
  if (query.has("zoom")) {
    zoom = Number(query.get("zoom"));
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
          center: location,
        });
        AMap.plugin("AMap.ToolBar", function () {
          var scale = new AMap.Scale();
          map.addControl(scale);
        });
        AMap.plugin("AMap.Geolocation", function () {
          var geolocation = new AMap.Geolocation({
            enableHighAccuracy: true,
            timeout: 10000,
            offset: [8, 50],
            zoomToAccuracy: true,
            position: "RB",
          });

          geolocation.getCurrentPosition(function (status, result) {
            if (status === "complete") {
              onComplete(result);
            } else {
              onError(result);
            }
          });

          function onComplete(data) {

          }

          function onError(data) {

          }

          map.addControl(geolocation);
          if (showOtherPins.value) {
            loadPoints();
            mapLoaded = true;
          }
          if (location) {
            const marker = new AMap.Marker({
              position: new AMap.LngLat(...location),
            });
            map.add(marker);
          }
          if (props.clickEventObj !== "NoNeed") {
            console.log("为地图组件添加点击事件")
            map.on("click", thisClickHandler);
          }
        });
      })
      .catch((e) => {
        console.error(e);
      });
}

const router = useRouter();

const loadPoints = () => {
  if (!points.value) return;
  for (let point of points.value) {
    const marker = new AMap.Marker({
      position: new AMap.LngLat(...point.coordinates.split(",")), //经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
      title: point.title,
    });
    marker.on("click", () => {
      router.push({name: 'spot-detail', params: {id: point.id}})
    })
    map.add(marker);
  }
}

onMounted(() => {
  if (showOtherPins.value) {
    getSpots().then(res => {
      console.log("获取到景点列表：", res);
      points.value = res;
      if (mapLoaded) {
        loadPoints();
      }
    });
  }
  loadMap();
});

onUnmounted(() => {
  map.off("click", thisClickHandler);
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
    <div ref="mainMap" class="size-full bg-white"></div>
    <div v-if="exit">
      <button
          class="bg-white rounded-full flex p-2 absolute bottom-2 right-2 cursor-pointer"
          @click="$emit('exitHandle')"
      >
        <RiCloseLine class="size-4 fill-gray-500"/>
      </button>
    </div>
    <div
        v-else
        class="bg-white rounded-full flex p-2 absolute bottom-2 right-2 cursor-pointer"
        @click="toggleFullScreen"
    >
      <RiFullscreenLine v-if="!isFullScreen" class="size-4 fill-gray-500"/>
      <RiFullscreenExitFill v-else class="size-4 fill-gray-500"/>
    </div>
  </div>
</template>