<!-- BarChart.vue -->
<template>
  <div class="w-full">
    <div class="text-sm text-gray-700 mb-4 flex items-center gap-0.5">
      <RiBookShelfFill class="size-3.5"/>
      {{ title }}
    </div>
    <div ref="chart" class="w-full min-h-70 flex items-center justify-center"></div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted, useTemplateRef} from 'vue'
import * as echarts from 'echarts'
import {RiBookShelfFill} from "@remixicon/vue";

interface StatItem {
  name: string
  value: number
}

const props = defineProps<{
  title: string
  stats: StatItem[]
}>()

const chart = useTemplateRef("chart")

let chartInstance: echarts.ECharts | null = null

onMounted(() => {
  if (chart.value) {
    chartInstance = echarts.init(chart.value)

    // 获取容器宽度
    const containerWidth = chart.value.offsetWidth
    const isNarrow = containerWidth < 600 // 阈值 600px，可调整

    const option = {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: isNarrow ? '{b}: {c}' : '{b}: {c}' // Tooltip 保持一致
      },
      grid: {
        left: '2%', // 减少左侧留白
        right: '2%', // 减少右侧留白
        top: '10%',
        bottom: '10%',
        containLabel: true // 确保标签在 grid 内
      },
      // 根据宽度动态切换轴类型
      xAxis: {
        type: isNarrow ? 'value' : 'category', // 窄时 X 轴为数值
        data: isNarrow ? undefined : props.stats.map(item => item.name), // 宽时绑定类别
        name: isNarrow ? '数量' : undefined, // 窄时 X 轴显示“数量”
        axisLabel: {
          rotate: 0, // 标签保持横向
          interval: 0,
          fontSize: 12
        }
      },
      yAxis: {
        type: isNarrow ? 'category' : 'value', // 窄时 Y 轴为类别
        data: isNarrow ? props.stats.map(item => item.name) : undefined, // 窄时绑定类别
        name: isNarrow ? undefined : '数量', // 宽时 Y 轴显示“数量”
        axisLabel: {
          rotate: 0, // 标签保持横向
          interval: 0,
          fontSize: 12
        }
      },
      series: [
        {
          name: props.title,
          type: 'bar',
          data: props.stats.map(item => item.value),
          barWidth: '80%', // 宽度铺满
          itemStyle: {
            color: '#3B82F6'
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          label: {
            show: true,
            position: isNarrow ? 'right' : 'top', // 窄时标签在右侧，宽时在上方
            formatter: '{c}'
          }
        }
      ],
      color: ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6']
    }
    chartInstance.setOption(option)
  }

  window.addEventListener('resize', resizeChart)
})
const resizeChart = () => {
  if (chartInstance) {
    chartInstance.resize()
    // 动态调整图表方向
    const containerWidth = chart.value?.offsetWidth || 0
    const isNarrow = containerWidth < 600
    chartInstance.setOption({
      xAxis: {
        type: isNarrow ? 'value' : 'category',
        data: isNarrow ? undefined : props.stats.map(item => item.name),
        name: isNarrow ? '数量' : undefined
      },
      yAxis: {
        type: isNarrow ? 'category' : 'value',
        data: isNarrow ? props.stats.map(item => item.name) : undefined,
        name: isNarrow ? undefined : '数量'
      },
      series: [
        {
          label: {
            position: isNarrow ? 'right' : 'top' // 动态调整标签位置
          }
        }
      ]
    })
  }
}
onUnmounted(() => {
  chartInstance?.dispose()
  window.removeEventListener('resize', resizeChart)
})
</script>