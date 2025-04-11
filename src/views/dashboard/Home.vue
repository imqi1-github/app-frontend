<template>
  <div class="flex items-center justify-center min-h-full">
    <div v-if="!data">获取中</div>
    <div v-else class="space-y-6 w-full">
      <div class="flex flex-wrap gap-6 *:grow *:max-h-20">
        <div class="rounded-xl bg-white col-start-1 col-end-3 px-4 py-2 shadow-md shadow-gray-200">
          <div class="justify-center flex flex-col items-start gap-1 h-full">
            <div class="text-2xl font-bold">{{ data?.user_count || "获取中" }}</div>
            <div class="text-sm text-gray-500 flex items-center gap-0.5">
              <RiUserLine class="size-4"/>
              用户数量
            </div>
          </div>
        </div>
        <div class="rounded-xl bg-white col-start-3 col-end-5 px-4 py-2 shadow-md shadow-gray-200">
          <div class="justify-center flex flex-col items-start gap-1 h-full">
            <div class="text-2xl font-bold">{{ data?.post_count || "获取中" }}</div>
            <div class="text-sm text-gray-500 flex items-center gap-0.5">
              <RiFileLine class="size-4"/>
              帖子数量
            </div>
          </div>
        </div>
        <div class="rounded-xl bg-white col-start-5 col-end-7 px-4 py-2 shadow-md shadow-gray-200">
          <div class="justify-center flex flex-col items-start gap-1 h-full">
            <div class="text-2xl font-bold">{{ data?.comment_count || "获取中" }}</div>
            <div class="text-sm text-gray-500 flex items-center gap-0.5">
              <RiMessageLine class="size-4"/>
              评论数量
            </div>
          </div>
        </div>
        <div class="rounded-xl bg-white col-start-7 col-end-9 px-4 py-2 shadow-md shadow-gray-200">
          <div class="justify-center flex flex-col items-start gap-1 h-full">
            <div class="text-2xl font-bold">{{ data?.attachment_count || "获取中" }}</div>
            <div class="text-sm text-gray-500 flex items-center gap-0.5">
              <RiAttachmentLine class="size-4"/>
              附件数量
            </div>
          </div>
        </div>
        <div class="rounded-xl bg-white col-start-9 col-end-11 px-4 py-2 shadow-md shadow-gray-200">
          <div class="justify-center flex flex-col items-start gap-1 h-full">
            <div class="text-xl font-bold">暂无数据</div>
            <div class="text-sm text-gray-500 flex items-center gap-0.5">
              <RiLandscapeLine class="size-4"/>
              景点数量
            </div>
          </div>
        </div>
      </div>
      <div class="rounded-xl bg-white px-4 py-3 shadow-md shadow-gray-200">
        <div class="grid flex-col items-start h-full grid-cols-[repeat(4,_auto)] gap-x-4 gap-y-2">
          <div class="text-gray-800 text-sm row-span-1 col-span-full flex items-center gap-0.5">
            <RiFileFill class="size-3.5"/>
            最新帖子
          </div>
          <div class="text-base text-gray-950 font-bold col-start-1">作者</div>
          <div class="text-base text-gray-950 font-bold col-start-2">标题</div>
          <div class="text-base text-gray-950 font-bold col-start-3">发布时间</div>
          <div class="text-base text-gray-950 font-bold col-start-4">操作</div>
          <template v-for="post of data.recent_posts" v-if="data">
            <div class="text-base text-gray-900 col-start-1 flex gap-1 items-center">
              <img :src="post.user.information.avatar_path" alt="头像" class="size-6"/>
              {{ post.user.information.nickname }}
            </div>
            <div class="text-base text-gray-900 col-start-2">《{{ post.title }}》</div>
            <div class="text-base text-gray-900 col-start-3">{{ formatRelativeTime(post.create_time) }}</div>
            <div class="text-base text-gray-900 col-start-4">
              <RouterLink :to="{name: 'post-content', params: {id: post.id}}" class="text-blue-600 hover:underline">
                查看
              </RouterLink>
            </div>
          </template>
        </div>
      </div>
      <div class="flex max-lg:flex-col gap-6 *:grow">
        <div class="rounded-xl bg-white col-start-1 col-end-5 px-4 py-3 shadow-md shadow-gray-200">
          <div class="grid flex-col items-start h-full grid-cols-[repeat(4,_auto)] gap-x-4 gap-y-2">
            <div class="text-gray-800 text-sm row-span-1 col-span-full flex items-center gap-0.5">
              <RiUserFill class="size-3.5"/>
              最近注册的用户
            </div>
            <div class="text-base text-gray-950 font-bold col-start-1">id</div>
            <div class="text-base text-gray-950 font-bold col-start-2">昵称</div>
            <div class="text-base text-gray-950 font-bold col-start-3">用户名</div>
            <template v-for="user of data.recent_users" v-if="data">
              <div class="text-base text-gray-900 col-start-1">{{ user.id }}</div>
              <div class="text-base text-gray-900 col-start-2">{{ user.information.nickname }}</div>
              <div class="text-base text-gray-900 col-start-3">{{ user.username }}</div>
            </template>
          </div>
        </div>
        <div class="rounded-xl bg-white col-start-5 col-end-11 px-4 py-3 shadow-md shadow-gray-200">
          <div class="grid flex-col items-start h-full grid-cols-[repeat(4,_auto)] gap-x-4 gap-y-2">
            <div class="text-gray-800 text-sm row-span-1 col-span-full flex items-center gap-0.5">
              <RiAncientGateFill class="size-3.5"/>
              最近注册的用户
            </div>
            <div class="text-base text-gray-950 font-bold col-start-1">id</div>
            <div class="text-base text-gray-950 font-bold col-start-2">昵称</div>
            <div class="text-base text-gray-950 font-bold col-start-3">用户名</div>
            <template v-for="user of data.recent_users" v-if="data">
              <div class="text-base text-gray-900 col-start-1">{{ user.id }}</div>
              <div class="text-base text-gray-900 col-start-2">{{ user.information.nickname }}</div>
              <div class="text-base text-gray-900 col-start-3">{{ user.username }}</div>
            </template>
          </div>
        </div>
      </div>
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="rounded-xl bg-white px-4 py-3 shadow-md shadow-gray-200">
          <PieChart v-if="data" :icon="RiMapFill" :stats="data.province_statistics" title="省份分布"/>
        </div>
        <div class="rounded-xl bg-white px-4 py-3 shadow-md shadow-gray-200">
          <PieChart v-if="data" :icon="RiBuildingFill" :stats="data.city_statistics" title="城市分布"/>
        </div>
        <div class="rounded-xl bg-white px-4 py-3 shadow-md shadow-gray-200">
          <div class="grid flex-col items-start h-full grid-cols-[repeat(4,_auto)] gap-x-4 gap-y-2">
            <div class="text-gray-800 text-sm row-span-1 col-span-full flex items-center gap-0.5">
              <RiHeartFill class="size-3.5"/>
              被订阅者数量排名
            </div>
            <div class="text-base text-gray-950 font-bold col-start-1">用户</div>
            <div class="text-base text-gray-950 font-bold col-start-2">id</div>
            <div class="text-base text-gray-950 font-bold col-start-3">数量</div>
            <div class="text-base text-gray-950 font-bold col-start-4">操作</div>
            <template v-for="user of data.top_users" v-if="data">
              <div class="text-base text-gray-900 col-start-1 flex items-center gap-1">
                <img :src="user.avatar_path" alt="用户头像" class="size-5 rounded-full"/>
                {{ user.nickname }}
              </div>
              <div class="text-base text-gray-900 col-start-2">{{ user.user_id }}</div>
              <div class="text-base text-gray-900 col-start-3">{{ user.fan_count }}</div>
              <div class="text-base text-gray-900 col-start-4">
                <RouterLink :to="{name: 'post-me', params: {id: user.user_id}}" class="text-blue-600 hover:underline">
                  查看
                </RouterLink>
              </div>
            </template>
          </div>
        </div>
        <div class="rounded-xl bg-white px-4 py-3 shadow-md shadow-gray-200">
          <div class="grid flex-col items-start h-full grid-cols-[repeat(4,_auto)] gap-x-4 gap-y-2">
            <div class="text-gray-800 text-sm row-span-1 col-span-full flex items-center gap-0.5">
              <RiRssFill class="size-3.5"/>
              订阅者数量排名
            </div>
            <div class="text-base text-gray-950 font-bold col-start-1">用户</div>
            <div class="text-base text-gray-950 font-bold col-start-2">id</div>
            <div class="text-base text-gray-950 font-bold col-start-3">数量</div>
            <div class="text-base text-gray-950 font-bold col-start-4">操作</div>
            <template v-for="user of data.top_subscriber" v-if="data">
              <div class="text-base text-gray-900 col-start-1 flex items-center gap-1">
                <img :src="user.avatar_path" alt="用户头像" class="size-5 rounded-full"/>
                {{ user.nickname }}
              </div>
              <div class="text-base text-gray-900 col-start-2">{{ user.user_id }}</div>
              <div class="text-base text-gray-900 col-start-3">{{ user.count }}</div>
              <div class="text-base text-gray-900 col-start-4">
                <RouterLink :to="{name: 'post-me', params: {id: user.user_id}}" class="text-blue-600 hover:underline">
                  查看
                </RouterLink>
              </div>
            </template>
          </div>
        </div>
      </div>
      <div class="rounded-xl bg-white px-4 py-3 shadow-md shadow-gray-200">
        <BarChart v-if="data" :stats="data.post_counts" class="w-full" title="分类帖子数量"/>
      </div>
      <div class="text-center flex justify-center">
        <span>&copy; 棋</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {dashboardOverview} from "@api/dashboard.ts";
import {formatRelativeTime} from "@/utils/time.ts";
import {
  RiAncientGateFill,
  RiAttachmentLine,
  RiBuildingFill,
  RiFileFill,
  RiFileLine,
  RiHeartFill,
  RiLandscapeLine,
  RiMapFill,
  RiMessageLine,
  RiRssFill,
  RiUserFill,
  RiUserLine
} from "@remixicon/vue";
import PieChart from "@components/dashboard/PieChart.vue";
import BarChart from "@components/dashboard/BarChart.vue";

const data = ref(null);
onMounted(() => {
  dashboardOverview().then(res => {
    console.log(res)
    data.value = res;
  })
})
</script>