<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {useRoute} from "vue-router"
import {getInformation} from "@api/user.ts";
import {useUserStore} from "@/stores/user.ts";
import PostHomeItem from "@components/post/PostHomeItem.vue";
import {getSubscribed, subscribe} from "@api/post.ts";
import {useToast} from "vue-toastification";

const route = useRoute()
const user = ref(null)
const userStore = useUserStore()

onMounted(() => {
  if (route.params.id) {
    getInformation(route.params.id).then(res => {
      console.log("用户信息：", res)
      user.value = res
    })
  } else if (userStore?.user?.id) {
    getInformation(userStore.user.id).then(res => {
      console.log("用户信息：", res)
      user.value = res
    })
  } else {
    user.value = false
  }
})

const subscribed = ref(false)
const toast = useToast();

const thisSubscribe = async () => {
  const res = await subscribe(userStore.user.id, user.value.user.id)
  toast.success(res.msg)
  subscribed.value = res.msg == "关注成功";
}

onMounted(async () => {
  if (userStore.isLogin)
  subscribed.value = (await getSubscribed(userStore.user.id, Number(route.params.id))).subscribed
})

</script>
<template>
  <div class="size-full flex flex-col items-center justify-center">
    <template v-if="user">
      <div v-if="user?.information"
           class="grid grid-cols-[4fr_5fr] p-4 items-center gap-6 w-full pb-4 border-b-1 border-b-gray-200">
        <div class="size-40 justify-self-end">
          <img :src="user.information.avatar_path"
               alt="用户头像" class="size-full object-cover border-1 border-gray-200 rounded-full"/>
        </div>
        <div class="space-y-1">
          <div class="text-2xl font-bold text-gray-700">{{ user.information.nickname }}</div>
          <div class="text-gray-600 text-sm">用户名：{{ user.user.username }}</div>
          <div class="text-base"><span class="font-bold text-gray-800">{{ user.subscribe_count }}</span> <span
              class="text-gray-600">关注</span> <span
              class="ml-2 font-bold text-gray-800">{{ user.fans_count }}</span> <span class="text-gray-600">粉丝</span>
          </div>
          <template v-if="userStore.isLogin">
            <button v-if="!subscribed" class="bg-blue-600 px-4 py-1 rounded-xl w-fit text-white mt-4"
                    @click="thisSubscribe">关注
            </button>
            <button v-else class="bg-gray-600 px-4 py-1 rounded-xl w-fit text-white mt-4"
                    @click="thisSubscribe">已关注
            </button>
          </template>
          <template v-else>
            <div class="bg-gray-500 px-4 py-1 rounded-xl w-fit text-white mt-4">登录后可关注
            </div>
          </template>
        </div>
      </div>
      <div v-if="user"
           class="px-2 mt-8 w-full grid grid-cols-4 gap-4 items-center max-sm:grid-cols-1 sm:max-md:grid-cols-2 md:max-lg:grid-cols-3">
        <PostHomeItem v-for="post of user.posts" :post="post" class=""/>
      </div>
    </template>
    <template v-else>
      <div class="text-center text-gray-600 text-lg">
        <div>用户不存在</div>
      </div>
    </template>
  </div>
</template>