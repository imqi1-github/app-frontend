<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {deleteSpot, getSpotList} from "@api/dashboard.ts";
import {useRoute} from "vue-router";
import PushButton from "@components/inputs/PushButton.vue";
import {
  RiArrowLeftSLine,
  RiArrowRightSLine,
  RiRefreshLine,
  RiThumbDownLine,
  RiThumbUpLine,
  RiTimeLine
} from "@remixicon/vue";
import {useToast} from "vue-toastification";

const data = ref()
const route = useRoute()
const page = Number(route.params.page ?? 1)
const toast = useToast()

const thisGetSpotList = async () => {
  const res = await getSpotList(page)
  console.log("获取到景点列表：", res)
  data.value = res
}

const thisDeleteSpot = async (id: number) => {
  const res = await deleteSpot(id)
  if (res.msg) {
    toast.success(res.msg)
    await thisGetSpotList()
  }
  console.log("删除景点：", res)
}

onMounted(() => {
  thisGetSpotList()
})
</script>
<template>
  <div v-if="data" class="">
    <div class="rounded-xl bg-white flex flex-col divide-y-1 divide-gray-200">
      <div class="p-4 flex justify-between items-center">
        <PushButton :onClick="() => $router.push({name: 'dashboard-add-spot'})" text="新增"/>
        <div class="flex gap-3 items-center">
          <button class="border-gray-200 border-1 hover:bg-gray-50 p-2 items-center flex justify-center rounded-md"
                  text="刷新"
                  @click="thisGetSpotList">
            <RiRefreshLine class="size-4 fill-gray-800"/>
          </button>
          <div class="items-center flex justify-center">
            <div
                class="rounded-md flex border-1 border-gray-200 h-9 divide-x-1 divide-gray-200 *:px-1 *:hover:bg-gray-100">
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === 1}"
                      :disabled="page === 1"
                      text="上一页"
                      @click="$router.push({'name': 'dashboard-spot-page', params: {page: page - 1}})">
                <RiArrowLeftSLine class="size-6 fill-gray-700"/>
              </button>
              <div class="flex-1 flex justify-center items-center">
                <div class="text-gray-500 px-2">{{ page }}/{{ data.pages }}</div>
              </div>
              <button :class="{'cursor-not-allowed *:fill-gray-400': page === data.pages}"
                      :disabled="page === data.pages"
                      text="下一页"
                      @click="$router.push({'name': 'dashboard-spot-page', params: {page: page + 1}})">
                <RiArrowRightSLine class="size-6 fill-gray-700"/>
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="divide-y-1 divide-gray-100">
        <div v-for="spot of data.spots" class="flex gap-2 items-center py-2 px-4 justify-between flex-wrap">
          <div class="flex gap-1 flex-col">
            <div class="font-medium text-gray-800">{{ spot.title }}</div>
            <div class="text-xs text-gray-500">{{ spot.position }}</div>
          </div>
          <div class="flex gap-4 items-center text-sm flex-wrap">
            <div class="flex gap-1 items-center">
              <RiThumbUpLine class="size-4 fill-green-600"/>
              {{ spot.good }}
            </div>
            <div class="flex gap-1 items-center">
              <RiThumbDownLine class="size-4 fill-red-600"/>
              {{ spot.bad }}
            </div>
            <div class="flex gap-1 items-center">
              <RiTimeLine class="size-4 fill-neutral-500"/>
              {{ spot.start_time }} - {{ spot.end_time }}
            </div>
            <PushButton :on-click="() => $router.push({'name': 'spot-detail', params: {id: spot.id}})" text="查看"/>
            <PushButton :on-click="() => $router.push({'name': 'dashboard-edit-spot', params: {id: spot.id}})"
                        text="编辑"/>
            <button
                class="cursor-pointer rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white shadow-xs hover:bg-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                @click="thisDeleteSpot(spot.id)">
              删除
            </button>
          </div>
        </div>
        <div class="py-2 px-4 text-gray-600 text-sm">
          已添加 {{ data.spots_count }} 个景点
        </div>
      </div>
    </div>
  </div>
  <div v-else class="text-center p-4">获取中</div>
</template>