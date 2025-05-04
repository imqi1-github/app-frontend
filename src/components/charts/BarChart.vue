<template>
  <div class="w-full">
    <div class="text-sm text-gray-700 mb-4 flex items-center gap-0.5">
      <RiBookShelfFill class="size-3.5"/>
      {{ title }}
    </div>
    <div ref="chart" class="w-full h-64"></div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, useTemplateRef} from "vue";
import {RiBookShelfFill} from "@remixicon/vue";

// 按需导入 ECharts 模块
import {type ECharts, init, use} from "echarts/core";
import {BarChart} from "echarts/charts";
import {GridComponent, TooltipComponent} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";

// 注册必要的 ECharts 模块
use([BarChart, GridComponent, TooltipComponent, CanvasRenderer]);

interface StatItem {
  name: string;
  value: number;
}

const props = defineProps<{
  title: string;
  stats: StatItem[];
}>();

const chart = useTemplateRef("chart");
let chartInstance: ECharts | null = null;

onMounted(async () => {
  if (chart.value) {
    chartInstance = init(chart.value);

    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {type: "shadow"},
        formatter: "{b}: {c}",
      },
      grid: {
        left: "3%",
        right: "3%",
        top: "10%",
        bottom: "10%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: props.stats.map((item) => item.name),
        axisLabel: {
          fontSize: 12,
        },
      },
      yAxis: {
        type: "value",
        name: "数量",
        axisLabel: {
          fontSize: 12,
        },
      },
      series: [
        {
          type: "bar",
          data: props.stats.map((item) => item.value),
          barWidth: "60%",
          itemStyle: {
            color: "#3B82F6",
          },
          label: {
            show: true,
            position: "top",
            formatter: "{c}",
          },
        },
      ],
    };

    chartInstance.setOption(option);
  }

  window.addEventListener("resize", resizeChart);
});

const resizeChart = () => {
  chartInstance?.resize();
};

onUnmounted(() => {
  chartInstance?.dispose();
  window.removeEventListener("resize", resizeChart);
});
</script>