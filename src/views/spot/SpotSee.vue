<template>
  <div v-if="!data" class="flex items-center justify-center">
    加载中
  </div>
  <div v-else class="p-4 max-w-225 w-full space-y-6">
    <div class="flex w-fit items-center gap-1 cursor-pointer hover:fill-blue-700 hover:text-blue-700">
      <RiArrowGoBackLine class="w-4 h-4"/>
      <div @click="$router.back">返回</div>
    </div>
    <div class="flex gap-2 items-end flex-wrap">
      <div class="text-4xl font-bold" v-html="data.title"></div>
      <div class="flex items-center gap-1 text-xl cursor-pointer" @click="thisGood">
        <RiThumbUpFill v-if="gooded" class="fill-emerald-400 w-6 h-6"/>
        <RiThumbUpLine v-else class="fill-emerald-400 w-6 h-6"/>
        {{ data.good }}
      </div>
      <div class="flex items-center gap-1 text-xl cursor-pointer" @click="thisBad">
        <RiThumbDownFill v-if="baded" class="fill-red-500 w-6 h-6"/>
        <RiThumbDownLine v-else class="fill-red-500 w-6 h-6"/>
        {{ data.bad }}
      </div>
    </div>
    <div class="flex gap-2 items-center flex-wrap">
      <div v-if="isNowInRange(data.start_time, data.end_time)" class="text-green-500 font-bold text-nowrap">当前可游玩
      </div>
      <div v-else class="text-red-500 font-bold text-nowrap">当前已关闭</div>
      <div class="text-gray-600 flex items-center">
        <RiTimeLine class="fill-gray-400 w-4 h-4"/>
        <div class="text-nowrap">
          {{ data.start_time }} - {{ data.end_time }}
        </div>
      </div>
      <RouterLink :to="{name: 'map', query: {'location': data.coordinates, zoom: 12}}"
                  class="flex items-center text-blue-400 hover:text-blue-600 hover:*:fill-blue-600 text-nowrap">
        <RiMapPinLine class="size-4 fill-blue-400"/>
        {{ data.position }}
      </RouterLink>
      <RouterLink :to="{name: 'weather-home', query: {'location': data.position}}"
                  class="flex items-center text-blue-400 hover:text-blue-600 hover:*:fill-blue-600 text-nowrap">
        <RiSunLine class="size-4 fill-blue-400"/>
        晴
      </RouterLink>
      <div class="text-gray-600 flex items-center gap-1">
        <RiEyeLine class="fill-gray-700 w-4 h-4"/>
        <div class="text-nowrap">
          {{ data.views }}人看过
        </div>
      </div>
    </div>
    <div class="rounded-xl overflow-hidden flex flex-col gap-2 max-w-[calc(100vw-45px)]">
      <div class="main-swiper swiper w-full h-100">
        <div class="swiper-wrapper">
          <div v-for="(item, index) in images" :key="index" class="swiper-slide">
            <img :src="item" alt="" class="w-full h-full object-cover" data-fancybox="gallery"/>
          </div>
        </div>
      </div>
      <div v-show="images.length >= 2" class="flex gap-2 thumbs-swiper swiper w-full mt-2 h-25">
        <div class="swiper-wrapper max-w-full">
          <div v-for="(item, index) in images" :key="index"
               class="swiper-slide size-25 cursor-pointer opacity-60 overflow-hidden first-of-type:rounded-bl-xl last-of-type:rounded-br-xl">
            <img :src="item" alt=""
                 class="w-full h-full object-cover"/>
          </div>
        </div>
      </div>
    </div>
    <div class="">
      <div class="markdown-content" v-html="renderMarkdown(data.content)"/>
    </div>
    <div v-if="nearbySpots.length > 0">
      <div class="text-3xl font-bold">附近的景点</div>
      <div class="grid md:grid-cols-3 sm:max-lg:grid-cols-2 gap-4 mt-6">
        <RouterLink v-for="spot of nearbySpots" :to="{name: 'spot-detail', params: {id: spot.spot.id}}"
                    class="max-w-90 w-full flex items-center gap-4 group">
          <img :alt="spot.spot.title" :src="spot.spot.pictures[0]" class="max-w-20 size-full aspect-square rounded-lg group-hover:brightness-90 duration-150"/>
          <div class="grow">
            <div class="text-lg mb-1">{{ spot.spot.title }}</div>
            <div class="text-gray-500 text-sm">{{ spot.spot.place }}</div>
            <div class="text-gray-600">{{ spot.distance }}m</div>
          </div>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  RiArrowGoBackLine,
  RiEyeLine,
  RiMapPinLine,
  RiSunLine,
  RiThumbDownFill,
  RiThumbDownLine,
  RiThumbUpFill,
  RiThumbUpLine,
  RiTimeLine
} from "@remixicon/vue";
import {nextTick, onMounted, onUnmounted, ref} from "vue";
import Swiper from "swiper";
import {Thumbs} from "swiper/modules";
import "swiper/css";
import MarkdownIt from "markdown-it";
import {useRoute} from "vue-router";
import {bad, getNearbySpots, getSpot, good} from "@api/spot.ts";
import {isNowInRange} from "@/utils/time"
import {useToast} from "vue-toastification";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css"

const images = ref([]);

let mainSwiper: Swiper | null = null;
let thumbsSwiper: Swiper | null = null;

const initSwiper = () => {
  thumbsSwiper = new Swiper(".thumbs-swiper", {
    spaceBetween: 10,
    slidesPerView: Math.min(images.value.length, 10),
    watchSlidesProgress: true,
  });

  mainSwiper = new Swiper(".main-swiper", {
    modules: [Thumbs],
    spaceBetween: 10,
    thumbs: {
      swiper: thumbsSwiper,
    },
  });
};

const data = ref();
const route = useRoute();
const toast = useToast();
const gooded = ref(false);
const baded = ref(false);

onMounted(() => {
  // @ts-ignore
  Fancybox.bind('[data-fancybox="gallery"]', {
    loop: true,
    buttons: ['close'],
    animationEffect: 'zoom-in-out',
  });
});
onUnmounted(() => {
  Fancybox.unbind('[data-fancybox="gallery"]');
  Fancybox.close();
});

if (localStorage.getItem(`good-${route.params.id}`)) {
  gooded.value = true;
}

if (localStorage.getItem(`bad-${route.params.id}`)) {
  baded.value = true;
}

const thisGood = async () => {
  if (gooded.value) {
    toast.info("你已经喜欢过该景点了");
    return;
  }
  const res = await good(route.params.id as any);
  if (res.msg) {
    toast.success(res.msg)
    data.value.good += 1;
    localStorage.setItem(`good-${route.params.id}`, "true");
    gooded.value = true;
  }
}

const thisBad = async () => {
  if (baded.value) {
    toast.info("你已经踩过该景点了");
    return;
  }
  const res = await bad(route.params.id as any);
  if (res.msg) {
    toast.success(res.msg)
    data.value.bad += 1;
    localStorage.setItem(`bad-${route.params.id}`, "true");
    baded.value = true;
  }
}

const nearbySpots = ref([])

onMounted(async () => {
  getSpot(route.params.id as any).then(result => {
    console.log("获取到景点详情：", result);
    images.value = result.pictures || [];
    data.value = result;

    nextTick(() => {
      initSwiper();
    });
  })
  getNearbySpots(route.params.id as any).then(res => {
    console.log("获取到附近的景点：", res);
    nearbySpots.value = res;
  })
});

onUnmounted(() => {
  if (mainSwiper) mainSwiper.destroy();
  if (thumbsSwiper) thumbsSwiper.destroy();
});

const md = new MarkdownIt({html: true});
const renderMarkdown = (content: string) => {
  return md.render(content);
};

</script>
<style scoped>
@import "@/assets/css/markdown.css";
</style>