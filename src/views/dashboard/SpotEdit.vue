<template>
  <div class="space-y-6">
    <div
        class="flex flex-col rounded-lg bg-white border-1 border-gray-100 divide-gray-200 divide-y-1 overflow-hidden shadow-md shadow-gray-100"
    >
      <div class="font-bold text-lg px-6 py-3 flex items-center justify-between gap-1">
        <div class="flex items-center gap-1">
          <RiLandscapeLine class="size-5"/>
          图片
        </div>
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="flex flex-wrap gap-2 *:size-24 *:rounded *:border-1 *:border-gray-200">
          <button class="cursor-pointer flex items-center bg-white justify-center" @click="thisUpload">
            <RiAddFill class="text-4xl text-gray-400"/>
          </button>
          <div
              v-for="(attachment, index) of images || []"
              :key="index"
              class="overflow-hidden size-25 rounded bg-gray-50 border-1 border-gray-100 flex flex-col items-center justify-center cursor-pointer"
          >
            <img
                :alt="attachment.filename"
                :src="attachment.filepath"
                class="size-full object-cover cursor-pointer"
                data-fancybox="gallery"
            />
          </div>
        </div>
      </div>
    </div>
    <div
        class="min-h-128 flex flex-col rounded-lg bg-white border-1 border-gray-100 divide-gray-200 divide-y-1 overflow-hidden shadow-md shadow-gray-100"
    >
      <div class="font-bold text-lg px-6 py-3 flex items-center justify-between gap-1">
        <div class="flex items-center gap-1">
          <RiFileFill class="size-5"/>
          内容
        </div>
        <div class="flex gap-2 items-center font-normal text-sm text-gray-700">
          Markdown编辑器
          <label
              class="cursor-pointer relative block h-5 w-9 rounded-full bg-gray-300 transition-colors [-webkit-tap-highlight-color:_transparent] has-checked:bg-blue-500"
              for="AcceptConditions"
          >
            <input
                id="AcceptConditions"
                v-model="showMarkdown"
                class="peer sr-only"
                type="checkbox"
            />
            <span
                class="absolute inset-y-0 start-0 m-1 size-3 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4"
            ></span>
          </label>
          预览内容
        </div>
      </div>
      <textarea
          v-show="!showMarkdown"
          v-model="data.content"
          class="outline-none resize-none grow px-6 py-3"
          placeholder="输入内容..."
      ></textarea>
      <div
          v-show="showMarkdown"
          class="markdown-content grow px-6 py-3"
          v-html="renderMarkdown(data.content)"
      ></div>
    </div>
    <div class="bg-white rounded gap-3 divide-y-1 divide-gray-100 shadow-md shadow-gray-100">
      <div class="font-bold text-lg px-6 py-3 flex items-center gap-1">
        <RiMenuFill class="size-5"/>
        基本信息
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">标题</div>
        <input
            v-model="data.title"
            class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
            type="text"
        />
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">开始时间</div>
        <input
            v-model="data.start_time"
            class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
            type="time"
        />
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">结束时间</div>
        <input
            v-model="data.end_time"
            class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
            type="time"
        />
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">所在省市</div>
        <div class="flex gap-4 flex-wrap max-w-128 w-full *:grow">
          <select
              v-model="data.position_province"
              class="w-40 px-2 py-1 rounded border-1 border-gray-200 focus:outline-blue-700"
          >
            <option v-for="item in provinceList" :key="item" :value="item">{{ item }}</option>
          </select>
          <select
              v-model="data.position_city"
              class="w-40 px-2 py-1 rounded border-1 border-gray-200 focus:outline-blue-700"
          >
            <option v-for="item in cityList" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">详细位置</div>
        <div class="flex gap-2">
          <input
              v-model="data.place"
              class="lg:max-w-128 gap-2 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
              type="text"
              @keyup="locationInfo.replace = false"
          />
          <button
              class="w-8 rounded border-1 border-gray-200 flex items-center justify-center hover:bg-gray-100"
              data-text="从地图上选位置"
              @click="locationInfo.show = true"
          >
            <RiMapPinLine class="size-4"/>
          </button>
          <ChoosePoint
              :data="locationInfo"
              @close="closeMap"
              @update:data="updateLocationInfo"
          />
        </div>
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">完整位置</div>
        <div class="">
          <div class="text-gray-900 text-lg underline" v-html="position"/>
          <div class="text-xs text-gray-600">
            {{ locationInfo.replace ? "此位置是通过点击高德地图点位获取的" : "此位置是手动输入的" }}
          </div>
        </div>
      </div>
    </div>
    <div
        class="bg-white rounded gap-3 divide-y-1 divide-gray-100 shadow-md shadow-gray-100 w-fit px-6 py-2 hover:shadow-gray-200 duration-75 cursor-pointer"
        @click="$route.params.id ? thisEditSpot() : thisSubmit()"
    >
      {{ $route.params.id ? "编辑" : "发布" }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, toRaw, watch} from "vue";
import Province from "@assets/city/province.json";
import {getByProvinceName} from "@/utils/city";
import {addSpot, editSpot, upload} from "@api/dashboard.ts";
import {RiAddFill, RiFileFill, RiLandscapeLine, RiMapPinLine, RiMenuFill,} from "@remixicon/vue";
import {Fancybox} from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import {useRoute, useRouter} from "vue-router";
import {useToast} from "vue-toastification";
import {getSpot} from "@api/spot.ts";
import ChoosePoint from "@components/ChoosePoint.vue";
import MarkdownIt from "markdown-it";


interface LocationInfo {
  show: boolean;
  e: any;
  position?: {
    regeocode?: {
      formatted_address: string,
      addressComponent: { province: string, city: string }
    };
  };
  replace: boolean;
}

interface SpotData {
  title: string;
  start_time: string;
  end_time: string;
  position_province: string;
  position_city: string;
  picture: string;
  content: string;
  place: string;
}

const data = ref<SpotData>({
  title: "",
  start_time: "",
  end_time: "",
  position_province: "河北省",
  position_city: "秦皇岛市",
  picture: "",
  content: "",
  place: "",
});

const locationInfo = ref<LocationInfo>({
  show: false,
  e: {},
  position: {},
  replace: false,
});

watch(() => locationInfo.value.position, (newValue) => {
  if (provinceList.includes(newValue?.regeocode?.addressComponent?.province)) {
    data.value.position_province = newValue?.regeocode?.addressComponent?.province;
  }
  if (cityList.value.includes(newValue?.regeocode?.addressComponent?.city)) {
    data.value.position_city = newValue?.regeocode?.addressComponent?.city;
  }
})

const position = computed(() =>
    locationInfo.value.replace
        ? locationInfo.value.position?.regeocode?.formatted_address ?? ""
        : `${data.value.position_province}${data.value.position_city}${data.value.place}`
);

const updateLocationInfo = (newData: any) => {
  locationInfo.value = {...newData};
};

const closeMap = () => {
  locationInfo.value.show = false;
};

const md = new MarkdownIt({html: true});
const images = ref<any[]>([]);
const showMarkdown = ref(false);
const provinceList = Object.values(Province);
const route = useRoute();
const router = useRouter();
const toast = useToast();

const cityList = computed(() => {
  const cityData = getByProvinceName(data.value.position_province);
  if (!cityData.cityNames.includes(data.value.position_city)) {
    data.value.position_city = cityData.cityNames[0];
  }
  return cityData.cityNames;
});

const renderMarkdown = (content: string) => {
  return md.render(content);
};

const thisUpload = () => {
  upload().then((res: any) => {
    console.log("上传图片返回值", res);
    images.value.push(res.file_info);
    data.value.picture = images.value.map((item: any) => item.filepath).join(",");
  });
};

onMounted(() => {
  //@ts-ignore
  Fancybox.bind('[data-fancybox="gallery"]', {
    loop: true,
    buttons: ["close"],
    animationEffect: "zoom-in-out",
  });
  if (route.params.id) {
    getSpot(route.params.id as any).then((res) => {
      console.log("获取景点", res);
      data.value.title = res.title;
      data.value.content = res.content;
      images.value = res.pictures.map((item: any, index: number) => ({
        filename: "景点图片" + index,
        filepath: item,
      }));
      data.value.picture = res.pictures.join(",");
      data.value.start_time = res.start_time;
      data.value.end_time = res.end_time;
      data.value.position_province = res.province;
      data.value.position_city = res.city;
      data.value.place = res.place;
    });
  }
});

onUnmounted(() => {
  Fancybox.unbind('[data-fancybox="gallery"]');
  Fancybox.close();
});

const thisSubmit = async () => {
  if (!data.value.title) {
    toast.error("请输入标题");
    return;
  }
  if (!data.value.content) {
    toast.error("请输入内容");
    return;
  }
  if (!data.value.picture) {
    toast.error("请上传图片");
    return;
  }
  if (!data.value.start_time) {
    toast.error("请输入开始时间");
    return;
  }
  if (!data.value.end_time) {
    toast.error("请输入结束时间");
    return;
  }
  if (data.value.start_time > data.value.end_time) {
    toast.error("开始时间不能大于结束时间");
    return;
  }
  if (!data.value.position_province) {
    toast.error("请输入省份");
    return;
  }
  if (!data.value.position_city) {
    toast.error("请输入城市");
    return;
  }
  const _data = {
    ...toRaw(data.value),
    position: position.value,
    province: data.value.position_province,
    city: data.value.position_city,
    place: data.value.place,
  };
  console.log("提交数据", _data);
  const res = await addSpot(_data);
  if (res.msg) {
    toast.success(res.msg);
    await router.push({name: "spot-detail", params: {id: res.spot_id}});
  }
};

const thisEditSpot = async () => {
  if (!data.value.title) {
    toast.error("请输入标题");
    return;
  }
  if (!data.value.content) {
    toast.error("请输入内容");
    return;
  }
  if (!data.value.picture) {
    toast.error("请上传图片");
    return;
  }
  if (!data.value.start_time) {
    toast.error("请输入开始时间");
    return;
  }
  if (!data.value.end_time) {
    toast.error("请输入结束时间");
    return;
  }
  if (data.value.start_time > data.value.end_time) {
    toast.error("开始时间不能大于结束时间");
    return;
  }
  if (!data.value.position_province) {
    toast.error("请输入省份");
    return;
  }
  if (!data.value.position_city) {
    toast.error("请输入城市");
    return;
  }
  const _data = {
    ...toRaw(data.value),
    position: position.value,
    province: data.value.position_province,
    city: data.value.position_city,
    place: data.value.place,
    id: route.params.id,
  };
  console.log("提交数据", _data);
  const res = await editSpot(_data);
  if (res.msg) {
    toast.success(res.msg);
    await router.push({name: "spot-detail", params: {id: res.spot_id}});
  }
};
</script>

<style scoped>
@import "@assets/css/markdown.css";
</style>