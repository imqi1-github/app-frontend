<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref, watch} from "vue";
import {throttle} from "@/utils/func.ts";
import {formatTime2FromQWeather} from "@/utils/time.ts";
import {GridComponent, LegendComponent, TooltipComponent} from "echarts/components";
import {LineChart} from "echarts/charts";
import {CanvasRenderer} from "echarts/renderers";
import {type ECharts, init, use} from "echarts/core";

use([GridComponent, TooltipComponent, LineChart, CanvasRenderer, LegendComponent]);

const props = defineProps({
  weatherHourly: {
    type: [Object, null],
    required: true,
  },
});

const chartRef = ref<HTMLElement | null>(null);
let myChart: ECharts | null = null;

// 计算图表数据
const chartData = computed(() => {
  if (!props.weatherHourly?.hourly) return {categories: [], values: [], texts: [], pops: []};
  const rawData = props.weatherHourly.hourly.map((item: any) => ({
    time: formatTime2FromQWeather(item.fxTime),
    temp: Number(item.temp), // 确保温度是数值类型
    text: item.text,
    pop: Number(item.pop), // 确保降雨概率是数值类型
  }));

  const daysToShow = window.innerWidth < 768 ? 6 : 12;
  const hoursPerDay = 24;
  const totalHours = daysToShow * hoursPerDay;
  const sampledData = rawData.slice(0, totalHours);
  const step = Math.max(1, Math.floor(sampledData.length / daysToShow));

  return {
    categories: sampledData.filter((_: any, i: number) => i % step === 0).map((item: any) => item.time),
    values: sampledData.filter((_: any, i: number) => i % step === 0).map((item: any) => item.temp),
    texts: sampledData.filter((_: any, i: number) => i % step === 0).map((item: any) => item.text),
    pops: sampledData.filter((_: any, i: number) => i % step === 0).map((item: any) => item.pop),
  };
});

const getTravelAdvice = computed(() => {
  if (!props.weatherHourly?.hourly) return "暂无天气数据，无法提供建议。";

  const now = new Date(props.weatherHourly.updateTime); // 当前时间（假设为今天）
  const next24Hours = props.weatherHourly.hourly
      .map((item: any) => ({
        time: new Date(item.fxTime),
        temp: Number(item.temp),
        pop: Number(item.pop),
      }))
      .filter((item: { time: any }) => item.time > now && item.time <= new Date(now.getTime() + 24 * 60 * 60 * 1000)); // 未来24小时

  if (!next24Hours.length) return "未来24小时内暂无数据。";

  // 计算关键指标
  const maxTemp = Math.max(...next24Hours.map((item: any) => item.temp));
  const minTemp = Math.min(...next24Hours.map((item: any) => item.temp));
  const maxPop = Math.max(...next24Hours.map((item: any) => item.pop));
  const rainyHours = next24Hours.filter((item: any) => item.pop >= 20).length;

  let advice = "未来24小时出行建议：\n";

  // 降雨建议
  if (maxPop < 20) {
    advice += "·天气晴朗，无需携带雨具。\n";
  } else if (maxPop < 50) {
    advice += "·有小雨可能，建议携带轻便雨具（如折叠伞）。\n";
  } else if (maxPop < 80) {
    advice += "·有中雨可能，请携带雨伞。\n";
  } else {
    advice += "·有大雨风险，建议尽量减少外出，或准备好防水衣物和雨伞。\n";
  }
  if (rainyHours > 0) {
    advice += `·预计有 ${rainyHours} 小时可能降雨。\n`;
  }

  // 温度建议
  if (minTemp < 5) {
    advice += "·天气寒冷，请穿厚外套和保暖衣物。\n";
  } else if (minTemp < 15) {
    advice += "·天气较凉，建议穿长袖或薄外套。\n";
  } else if (maxTemp < 25) {
    advice += "·温度舒适，穿着轻便即可。\n";
  } else if (maxTemp < 35) {
    advice += "·天气炎热，注意防晒并多喝水。\n";
  } else {
    advice += "·天气酷热，建议减少户外活动，注意防暑降温。\n";
  }
  advice += `·温度范围：${minTemp}℃ 至 ${maxTemp}℃。`;

  return advice;
});

// 初始化图表
const initChart = () => {
  if (chartRef.value) {
    myChart = init(chartRef.value);
  }
  updateChart();
};

// 更新图表
const updateChart = () => {
  if (myChart) {
    myChart.setOption(
        {
          legend: {
            data: ["温度", "降雨概率"],
            top: "5%",
            textStyle: {fontSize: 12, color: "#333"},
          },
          xAxis: {
            type: "category",
            data: chartData.value.categories,
            axisLine: {show: false},
            axisTick: {show: false},
            axisLabel: {
              show: true,
              interval: 0,
              formatter: (value: string, index: number) => {
                return `{a|${value}}\n{b|${chartData.value.texts[index] || ""}}`;
              },
              rich: {
                a: {fontSize: 12, color: "#333"},
                b: {fontSize: 10, color: "#666"},
              },
            },
          },
          yAxis: [
            {
              type: "value",
              axisLine: {show: false},
              axisTick: {show: false},
              axisLabel: {show: false},
              splitLine: {show: false},
              min: (value: { min: number }) => value.min - 4,
              max: (value: { max: number }) => value.max + 2,
            },
            {
              type: "value",
              position: "right",
              axisLine: {show: false},
              axisTick: {show: false},
              axisLabel: {show: false},
              splitLine: {show: false},
              min: 0,
              max: 100,
            },
          ],
          series: [
            {
              name: "温度",
              data: chartData.value.values,
              type: "line",
              smooth: true,
              label: {show: true, position: "bottom", formatter: "{c} ℃"},
              itemStyle: {color: "#ff6f61"},
            },
            {
              name: "降雨概率",
              data: chartData.value.pops,
              type: "line",
              yAxisIndex: 1,
              smooth: true,
              label: {show: true, position: "top", formatter: "{c} %"},
              itemStyle: {color: "#1e90ff"},
            },
          ],
          tooltip: {
            trigger: "axis",
            axisPointer: {type: "cross"},
            formatter: (params: any) => {
              if (!params.length) return "";
              const index = params[0].dataIndex;
              const time = chartData.value.categories[index];
              const temp = chartData.value.values[index];
              const weather = chartData.value.texts[index];
              const pop = chartData.value.pops[index];
              return `时间: ${time}<br>温度: ${temp} ℃<br>天气: ${weather}<br>降雨概率: ${pop || 0} %`;
            },
          },
        },
        true
    );
  }
};

const handleResize = throttle(() => {
  myChart?.resize();
  updateChart();
}, 200);

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

watch(
    () => props.weatherHourly,
    () => {
      if (myChart) {
        updateChart();
      } else {
        initChart();
      }
    },
    {deep: true}
);

onUnmounted(() => {
  myChart?.dispose();
  myChart = null;
  window.removeEventListener("resize", handleResize);
});
</script>

<template>
  <div>
    <div ref="chartRef" class="w-full h-75"></div>
    <div class="m-6 py-4 px-6 bg-gray-50 rounded-2xl">
      <h3 class="text-lg font-semibold">出行建议</h3>
      <pre class="text-sm whitespace-pre-wrap">{{ getTravelAdvice }}</pre>
    </div>
  </div>
</template>