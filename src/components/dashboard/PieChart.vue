<!-- PieChart.vue -->
<template>
  <div class="max-w-4xl mx-auto">
    <div class="text-sm text-gray-700 mb-4 flex items-center gap-0.5">
      <component class="size-3.5" :is="props.icon"/>
      {{ title }}
    </div>
    <div ref="chart" class="w-full min-h-56 flex items-center justify-center"></div>
  </div>
</template>

<script lang="ts" setup>
import {type Component, onMounted, onUnmounted, useTemplateRef} from 'vue'
import * as echarts from 'echarts'

interface StatItem {
  name: string
  value: number
}

const props = defineProps<{
  title: string
  stats: StatItem[],
  icon: Component
}>()

const chart = useTemplateRef("chart")

let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  if (chart.value) {
    chartInstance = echarts.init(chart.value)
    const colors = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6'] // 定义颜色数组
    const option = {
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ({d}%)' // 显示名称、值和百分比
      },
      // 添加图例配置
      legend: {
        show: true,
        bottom: 0, // 图例显示在底部
        orient: 'horizontal', // 水平排列
        data: props.stats.map(item => item.name), // 图例数据来源于 stats 的 name
      },
      series: [
        {
          name: props.title,
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: props.stats, // 数据保持不变
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            formatter: '{d}%' // 扇区标签显示名称和百分比
          }
        }
      ],
      color: colors // 全局颜色配置
    }
    chartInstance.setOption(option)
  }
  window.addEventListener('resize', resizeChart)
})

const resizeChart = () => {
  chartInstance?.resize()
}
onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', resizeChart)
})
</script>