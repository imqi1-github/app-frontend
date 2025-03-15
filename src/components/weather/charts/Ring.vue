<template>
  <div>
    <div ref="chartContainer" class="size-40"></div>
    <div class="text-lg text-center font-semibold">{{ category }}</div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref, watch } from "vue";
// 按需引入 ECharts 核心模块和仪表盘相关功能
import { init, dispose, use } from "echarts/core";
import { GaugeChart } from "echarts/charts";
import { CanvasRenderer } from "echarts/renderers";

const props = defineProps({
  value: {
    type: Number,
    default: 0,
    required: true,
  },
  color: {
    type: String,
    default: "gray",
  },
  category: {
    type: String,
    default: "",
  },
});

// 注册 ECharts 所需组件
use([GaugeChart, CanvasRenderer]);

// 初始化图表
const chartContainer = ref<HTMLDivElement | null>(null);
const chartInstance = ref(null);

const initChart = () => {
  if (!chartContainer.value) return;

  chartInstance.value = init(chartContainer.value);

  const option = {
    series: [
      {
        type: "gauge",
        startAngle: 225,
        endAngle: -45,
        radius: "90%",
        animation: true,
        pointer: { show: false },
        progress: {
          show: true,
          roundCap: true,
          width: 14,
          itemStyle: { color: props.color },
        },
        min: 0,
        max: 300,
        axisLine: {
          lineStyle: {
            width: 14,
            color: [[1, "rgba(200,200,200,0.3)"]],
          },
        },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        anchor: { show: false },
        data: [{ value: props.value }],
        detail: {
          valueAnimation: true,
          formatter: "{value}",
          fontSize: 40,
          fontWeight: "bold",
          color: "#000",
          offsetCenter: [0, 0],
        },
      },
    ],
  };

  chartInstance.value.setOption(option);
};

// 监听 value 和 color 变化
watch(
    [() => props.value, () => props.color],
    ([newValue, newColor]) => {
      if (chartInstance.value) {
        chartInstance.value.setOption({
          series: [{ data: [{ value: newValue }], progress: { itemStyle: { color: newColor } } }],
        });
      }
    }
);

onMounted(initChart);

onUnmounted(() => {
  if (chartInstance.value) {
    dispose(chartInstance.value);
    chartInstance.value = null;
  }
});
</script>