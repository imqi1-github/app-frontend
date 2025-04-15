<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-sm text-gray-700 mb-4 flex items-center gap-0.5">
      <component :is="props.icon" class="size-3.5"/>
      {{ title }}
    </div>
    <div ref="chart" class="w-full h-64"></div>
  </div>
</template>

<script lang="ts" setup>
import {type Component, onMounted, onUnmounted, useTemplateRef} from "vue";

// 按需导入 ECharts 模块
import {type ECharts, init, use} from "echarts/core";
import {PieChart} from "echarts/charts";
import {LegendComponent, TooltipComponent} from "echarts/components";
import {CanvasRenderer} from "echarts/renderers";

// 注册必要的 ECharts 模块
use([PieChart, TooltipComponent, LegendComponent, CanvasRenderer]);

interface StatItem {
  name: string;
  value: number;
}

const props = defineProps<{
  title: string;
  stats: StatItem[];
  icon: Component;
}>();

const chart = useTemplateRef("chart");
let chartInstance: ECharts | null = null;

onMounted(() => {
  if (chart.value) {
    chartInstance = init(chart.value);

    const option = {
      tooltip: {
        trigger: "item",
        formatter: "{b}: {c} ({d}%)",
      },
      legend: {
        bottom: 0,
        orient: "horizontal",
        data: props.stats.map((item) => item.name),
      },
      series: [
        {
          name: props.title,
          type: "pie",
          radius: "60%",
          data: props.stats,
          label: {
            show: true,
            formatter: "{d}%",
          },
          itemStyle: {
            color: (params: any) => {
              const colors = ["#3B82F6", "#EF4444", "#10B981", "#F59E0B"];
              return colors[params.dataIndex % colors.length];
            },
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