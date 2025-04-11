<template>
  <div class="space-y-6">
    <div
        class="flex flex-col rounded-lg bg-white border-1 border-gray-100 divide-gray-200 divide-y-1 overflow-hidden shadow-md shadow-gray-100">
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
          <div v-for="(attachment, index) of images || []" :key="index"
               class="overflow-hidden size-25 rounded bg-gray-50 border-1 border-gray-100 flex flex-col items-center justify-center cursor-pointer">
            <img :alt="attachment.filename" :src="attachment.filepath" class="size-full object-cover cursor-pointer"
                 data-fancybox="gallery">
          </div>
        </div>
      </div>
    </div>
    <div
        class="min-h-128 flex flex-col rounded-lg bg-white border-1 border-gray-100 divide-gray-200 divide-y-1 overflow-hidden shadow-md shadow-gray-100">
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
            <input id="AcceptConditions" v-model="showMarkdown" class="peer sr-only" type="checkbox"/>
            <span
                class="absolute inset-y-0 start-0 m-1 size-3 rounded-full bg-white transition-[inset-inline-start] peer-checked:start-4"
            ></span>
          </label>
          预览内容
        </div>
      </div>
      <textarea v-show="!showMarkdown" v-model="data.content" class="outline-none resize-none grow px-6 py-3"
                placeholder="输入内容..."></textarea>
      <div v-show="showMarkdown" class="markdown-content grow px-6 py-3" v-html="renderMarkdown(data.content)"></div>
    </div>
    <div class="bg-white rounded gap-3 divide-y-1 divide-gray-100 shadow-md shadow-gray-100">
      <div class="font-bold text-lg px-6 py-3 flex items-center gap-1">
        <RiMenuFill class="size-5"/>
        基本信息
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">标题</div>
        <input v-model="data.title"
               class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
               type="text">
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">开始时间</div>
        <input v-model="data.start_time"
               class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
               type="time">
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">结束时间</div>
        <input v-model="data.end_time"
               class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
               type="time">
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">所在省市</div>
        <div class="flex gap-4 flex-wrap max-w-128 w-full *:grow">
          <select v-model="data.position_province"
                  class="w-40 px-2 py-1 rounded border-1 border-gray-200 focus:outline-blue-700">
            <option v-for="item in provinceList" :key="item" :value="item">{{ item }}</option>
          </select>
          <select v-model="data.position_city"
                  class="w-40 px-2 py-1 rounded border-1 border-gray-200 focus:outline-blue-700">
            <option v-for="item in cityList" :key="item" :value="item">{{ item }}</option>
          </select>
        </div>
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">详细位置</div>
        <input v-model="data.place"
               class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
               type="text">
      </div>
    </div>
    <div
        class="bg-white rounded gap-3 divide-y-1 divide-gray-100 shadow-md shadow-gray-100 w-fit px-6 py-2 hover:shadow-gray-200 duration-75 cursor-pointer"
        @click="thisSubmit">
      发布
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, toRaw} from "vue"
import Province from "@assets/city/province.json"
import {getByProvinceName} from "@/utils/city"
import {addSpot, upload} from "@api/dashboard.ts";
import {RiAddFill, RiFileFill, RiLandscapeLine, RiMenuFill} from "@remixicon/vue";
import MarkdownIt from "markdown-it";
import {Fancybox} from "@fancyapps/ui";
import '@fancyapps/ui/dist/fancybox/fancybox.css';
import {useRouter} from "vue-router";
import {useToast} from "vue-toastification"; // 引入默认样式

const data = ref({
  title: "",
  start_time: "",
  end_time: "",
  position_province: "河北省",
  position_city: "秦皇岛市",
  picture: "",
  content: "",
  place: "",
})

const position = computed(() => `${data.value.position_province}${data.value.position_city}${data.value.place}`)

const md = new MarkdownIt({html: true});
const images = ref([])

const renderMarkdown = (content: string) => {
  return md.render(content);
};

const showMarkdown = ref(false)

// 获取省列表
const provinceList = Object.values(Province)

const cityList = computed(() => {
  const cityData = getByProvinceName(data.value.position_province)
  if (!cityData.cityNames.includes(data.value.position_city)) {
    data.value.position_city = cityData.cityNames[0]
  }
  return cityData.cityNames
})

const thisUpload = () => {
  upload().then((res: any) => {
    console.log("上传图片返回值", res)
    images.value.push(res.file_info);
    data.value.picture = images.value.map((item: any) => item.filepath).join(",")
  })
}
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

const router = useRouter()
const toast = useToast()

const thisSubmit = async () => {
  if (!data.value.title) {
    toast.error("请输入标题")
    return
  }
  if (!data.value.content) {
    toast.error("请输入内容")
    return
  }
  if (!data.value.picture) {
    toast.error("请上传图片")
    return
  }
  if (!data.value.start_time) {
    toast.error("请输入开始时间")
    return
  }
  if (!data.value.end_time) {
    toast.error("请输入结束时间")
    return
  }
  if (data.value.start_time > data.value.end_time) {
    toast.error("开始时间不能大于结束时间")
    return
  }
  if (!data.value.position_province) {
    toast.error("请输入省份")
    return
  }
  if (!data.value.position_city) {
    toast.error("请输入城市")
    return
  }
  const _data = {
    ...toRaw(data.value), position: position.value
  }
  console.log("提交数据", _data)
  const res = await addSpot(_data)
  if (res.msg) {
    toast.success(res.msg)
    await router.push({name: 'spot-detail', params: {id: res.spot_id}})
  }
}
</script>
<style scoped>
@import "@assets/css/markdown.css";
</style>