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
  if (!props.weatherHourly?.hourly) return {categories: [], values: []};
  const rawData = props.weatherHourly.hourly.map((item: any) => ({
    time: formatTime2FromQWeather(item.fxTime),
    humidity: item.humidity,
  }));

  const daysToShow = window.innerWidth < 768 ? 6 : 12;
  const hoursPerDay = 24;
  const totalHours = daysToShow * hoursPerDay;
  const sampledData = rawData.slice(0, totalHours);
  const step = Math.max(1, Math.floor(sampledData.length / daysToShow));

  return {
    categories: sampledData.filter((_: any, i: number) => i % step === 0).map((item: any) => item.time),
    values: sampledData.filter((_: any, i: number) => i % step === 0).map((item: any) => item.humidity),
  };
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
            data: ["湿度"],
            top: "5%",
            textStyle: {fontSize: 12, color: "#333"},
          },
          xAxis: {
            type: "category",
            data: chartData.value.categories,
            name: "时间",
            axisLine: {show: true},
            axisTick: {show: true},
            axisLabel: {
              show: true,
              interval: 0,
              formatter: (value: string) => {
                return `{a|${value}}`;
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
              name: "湿度 / %",
              axisLine: {show: true},
              axisTick: {show: true},
              axisLabel: {show: true},
              splitLine: {show: true},
              min: 0,
              max: 100,
            },
          ],
          series: [
            {
              name: "湿度",
              data: chartData.value.values,
              type: "line",
              smooth: true,
              label: {show: true, formatter: "{c} %"},
              itemStyle: {color: "orange"},
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
              return `时间: ${time}<br>湿度: ${temp} %`;
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
  </div>
</template>