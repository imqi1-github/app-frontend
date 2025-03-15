<script lang="ts" setup>
import {onMounted, ref, toRaw} from "vue";
import {getIndicesDaily} from "@api/weather.ts";
import {useUserStore} from "@/stores/user.ts";
import Cloth from "@assets/icons/cloth.svg";
import Uv from "@assets/icons/uv.svg";
import Travel from "@assets/icons/travel.svg";
import Emotion from "@assets/icons/emotion.svg";
import Sick from "@assets/icons/sick.svg";
import Pollution from "@assets/icons/pollution.svg";
import Sunglasses from "@assets/icons/sunglasses.svg";
import Makeup from "@assets/icons/makeup.svg";
import Traffic from "@assets/icons/traffic.svg";
import Sun from "@assets/icons/sun.svg";
import {getDayAfter} from "@/utils/time.ts";

const indicesIcon: Record<number, string> = {
  3: Cloth,
  5: Uv,
  6: Travel,
  8: Emotion,
  9: Sick,
  10: Pollution,
  12: Sunglasses,
  13: Makeup,
  15: Traffic,
  16: Sun,
}

const userStore = useUserStore();
const indices = [
  {
    name: "穿衣",
    type: 3,
  },
  {
    name: "紫外线",
    type: 5,
  },
  {
    name: "旅游",
    type: 6,
  },
  {
    name: "舒适度",
    type: 8,
  },
  {
    name: "感冒",
    type: 9,
  },
  {
    name: "空气污染",
    type: 10,
  },
  {
    name: "太阳镜",
    type: 12,
  },
  {
    name: "化妆",
    type: 13,
  },
  {
    name: "交通",
    type: 15,
  },
  {
    name: "防晒",
    type: 16,
  }
];
const indicesDaily = ref<any>(null);
const city = userStore.user?.information[0].position_city || "秦皇岛";
const selectedIndex = ref(0);

onMounted(() => {
  getIndicesDaily(city)
      .then(result => {
        indicesDaily.value = result;
        console.log("每日天气指数：", toRaw(indicesDaily.value));
      })
      .catch(error => console.error("每日天气指数：", error))
})

function bgColor(level: number) {
  if (level < 3) {
    return "green"
  } else if (level < 6) {
    return "orange"
  } else {
    return "red"
  }
}

</script>
<template>
  <div class="bg-white p-8 rounded-2xl mt-8 space-y-8">
    <div class="grid grid-cols-5 justify-around gap-6 justify-items-center">
      <button v-for="(daily, index) of indices || []" :key="index"
              :class="{'grayscale': selectedIndex !== index}"
              class="cursor-pointer w-fit h-fit flex flex-col gap-1 items-center" @click="selectedIndex = index">
        <img :alt="daily.name" :src="indicesIcon[daily.type as number]" class="size-16 rounded-full"/>
        <span class="text-center">{{ daily.name }}</span>
      </button>
    </div>
    <div class="p-4">
      {{
        {
          3: "气温的变化会影响我们的着装选择，合理的穿衣搭配不仅可以提升舒适度，还能有效预防感冒。根据当前温度、风力和湿度，我们为你提供最佳穿衣建议，无论是炎炎夏日还是寒冷冬天，都能让你应对自如，既舒适又得体。",
          5: "紫外线的强弱直接影响皮肤健康，过强的紫外线可能会导致晒伤、色斑甚至皮肤老化。出门前了解紫外线指数，可以帮助你采取适当的防护措施，如涂抹防晒霜、佩戴遮阳帽或太阳镜，避免长时间暴露在烈日下。",
          6: "外出旅行时，天气状况对出行体验至关重要。通过分析气温、降水、风速等因素，我们提供适合出游的建议，让你可以选择最佳时间、最佳地点，避开恶劣天气，确保旅途安全舒适，享受美好时光。",
          8: "影响人体舒适度的因素有很多，包括温度、湿度、风力等。合适的气候条件可以提升人的幸福感，而极端天气则可能导致不适甚至健康问题。参考舒适度指数，你可以调整出行计划，选择最适合的时间和地点进行活动。",
          9: "温差变化、空气湿度和风寒效应等都会影响人体免疫力，导致感冒风险增加。感冒指数能帮助你提前预警，提醒你适当增添衣物，避免受凉，同时提高免疫力，减少患病的可能性，尤其是儿童和老年人要特别注意。",
          10: "空气质量直接影响人体健康，尤其是雾霾、粉尘和有害气体会对呼吸系统造成威胁。空气污染指数可以帮助你判断当前空气状况，提醒你是否需要佩戴口罩、减少户外活动，特别是过敏人群和呼吸系统疾病患者需注意防护。",
          12: "强烈的阳光可能会对眼睛造成刺激，长时间暴露在强光下甚至会影响视力健康。太阳镜指数可以帮助你判断是否需要佩戴太阳镜，尤其在晴朗天气和高反射环境（如海边、雪地）下，保护眼睛免受紫外线伤害。",
          13: "温度、湿度和空气质量都会影响化妆效果，高温容易导致脱妆，湿度过低会让皮肤干燥，空气污染则可能引发肌肤问题。化妆指数为你提供针对性的化妆建议，帮助你选择合适的护肤品和妆容，让妆容更持久自然。",
          15: "恶劣天气如雨雪、大雾、台风等会对交通出行造成影响，增加事故风险。交通指数能帮助你了解天气对道路状况的影响，合理规划出行方式，避免高峰期和危险路段，提高出行安全性，确保旅途顺利。",
          16: "长时间暴露在阳光下会对皮肤造成伤害，紫外线过强甚至会增加皮肤癌的风险。防晒指数可以帮助你判断需要采取的防晒措施，比如穿长袖衣物、涂抹防晒霜或减少户外活动，以防止皮肤晒伤和老化。"
        }[indices[selectedIndex].type]
      }}
    </div>
    <div v-for="(index, _index) of [selectedIndex, selectedIndex + 10, selectedIndex + 20]" v-if="indicesDaily"
         :key="_index" class="grid gap-x-10 items-center grid-cols-[min-content_1fr] px-10">
      <div class="w-20">
        <div class="text-lg">{{ getDayAfter(_index) }}</div>
        <div class="text-sm text-gray-600">{{
            String(indicesDaily.daily[index].date).split("-")[1]
          }}月{{ String(indicesDaily.daily[index].date).split("-")[2] }}日
        </div>
      </div>
      <div class="px-4 py-3 bg-gray-50 rounded-xl space-y-2">
        <div :style="`background-color:${bgColor(indicesDaily.daily[index].level)}`"
             class="text-white py-1 px-2 rounded-md">
          {{ indicesDaily.daily[index].category }}
        </div>
        <div class="text-gray-600 text-sm">{{ indicesDaily.daily[index].text }}</div>
      </div>
    </div>
    <div v-else class="flex flex-col gap-5 items-end">
      <div class="bg-gray-100 max-w-150 w-full h-20 rounded-2xl animate-pulse"></div>
      <div class="bg-gray-100 max-w-150 w-full h-20 rounded-2xl animate-pulse"></div>
      <div class="bg-gray-100 max-w-150 w-full h-20 rounded-2xl animate-pulse"></div>
    </div>
  </div>
</template>
