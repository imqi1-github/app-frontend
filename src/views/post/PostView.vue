<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, toRaw, watch} from "vue";
import {useRoute} from "vue-router";
import {comment, comments, getPost, likePost, subscribe} from "@api/post.ts";
import Swiper from "swiper";
import {Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {RiCloseLine, RiHeartFill, RiHeartLine, RiMapPinLine} from "@remixicon/vue";
import MarkdownIt from "markdown-it";
import {formatRelativeTime} from "@/utils/time.ts";
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/user.ts";
import CommentNode from "@components/items/CommentNode.vue";
import {getWeatherNow} from "@api/weather.ts";
import {Fancybox} from '@fancyapps/ui';
import '@fancyapps/ui/dist/fancybox/fancybox.css';

const route = useRoute();
const post = ref<any>({});
let swiperInstance: Swiper | null = null;
const md = new MarkdownIt({html: true});
const user = useUserStore();
const toast = useToast();
const loaded = ref(false);

const renderMarkdown = (content: string) => {
  return md.render(content);
};


const initSwiper = () => {
  if (swiperInstance) {
    swiperInstance.destroy();
  }
  swiperInstance = new Swiper(".swiper", {
    modules: [Navigation, Pagination],
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      type: 'custom',
      renderCustom: (swiper, current, total) => {
        return `${current}/${total}`;
      },
    },
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });
};


const updateSwiper = () => {
  if (swiperInstance) {
    swiperInstance.update();
  }
};


const initFancybox = () => {
  // @ts-ignore
  Fancybox.bind('[data-fancybox="gallery"]', {
    loop: true,
    buttons: ['close'],
    animationEffect: 'zoom-in-out',
  });
};


const checkAndInitSwiper = async () => {
  if (post.value?.attachments) {
    await nextTick();
    initSwiper();
    initFancybox();
  }
};

const likedPosts = ref(JSON.parse(localStorage.getItem("liked") || "[]"));
const getLike = computed(() => likedPosts.value.includes(Number(post.value.id)));

const like = async () => {
  if (getLike.value) {
    toast.info("你已经喜欢过该帖子了");
    return;
  }
  const result = await likePost(post?.value.id);
  if (result) {
    likedPosts.value.push(post.value.id);
    localStorage.setItem("liked", JSON.stringify(likedPosts.value));
    post.value.likes += 1;
  }
};

onMounted(() => {
  getPost(route.params.id).then((res) => {
    console.log("帖子详情：", res);
    post.value = res;
    checkAndInitSwiper();
    loaded.value = true;
  });
});

onUnmounted(() => {
  if (swiperInstance) {
    swiperInstance.destroy();
  }
  Fancybox.unbind('[data-fancybox="gallery"]');
  Fancybox.close();
});

watch(
    () => post.value.attachments,
    async (newAttachments, oldAttachments) => {
      if (newAttachments !== oldAttachments) {
        await nextTick();
        initSwiper();
        initFancybox();
      }
    }
);

const weather = ref()

watch(() => post.value?.coordinates,
    () => {
      getWeatherNow(post.value.coordinates).then((res) => {
        console.log("天气信息：", toRaw(res))
        weather.value = res;
      });
    })

const thisSubscribe = async () => {
  const result = await subscribe(user.user.id, post.value.user_id);
  if (result.msg == "关注成功") {
    post.value.subscribed = true;
    toast.success("关注成功");
  } else {
    post.value.subscribed = false;
    toast.success("取消关注成功");
  }
};

const commentContent = ref();

const thisComment = async () => {
  if (!commentContent.value) {
    toast.error("评论内容不能为空");
    return;
  }
  const result = await comment({
    post_id: post.value.id,
    user_id: user.user.id,
    content: commentContent.value,
    parent_id: parentId.value,
  });
  if (result.msg) {
    toast.success("评论成功");
    commentContent.value = "";
    parentId.value = null;
    replyToNickname.value = null;
    const res = await comments(post.value.id);
    post.value.comments = res.comments;
  }
};
const replyToNickname = ref<string | null>(null);
const parentId = ref(null);
const updateCommentParentId = (newValue: number | null, nickname?: string): void => {
  parentId.value = newValue;
  replyToNickname.value = newValue === null ? null : nickname;
};


const cancelReply = () => {
  parentId.value = null;
  replyToNickname.value = null;
};
</script>

<template>
  <div v-if="loaded">
    <div v-if="post.published==1" class="size-full flex items-center justify-center max-lg:flex-col max-lg:justify-between">
      <div class="flex gap-2 p-5 items-center text-gray-700 flex-initial lg:hidden max-lg:w-full">
        <div
            class="p-1 rounded-full flex items-center justify-center cursor-pointer z-3 hover:bg-gray-100"
            title="返回" @click="$router.back()">
          <RiCloseLine class="size-6 text-gray-500"/>
        </div>
        <RouterLink :to="({'name': 'post-me', 'params': {'id': post.user_id}})" class="flex gap-2 items-center">
          <img v-if="post?.user" :src="post?.user.information.avatar_path" alt="头像"
               class="size-10 rounded-full border-gray-100">
          <img v-else alt="头像" class="size-10 rounded-full border-gray-100" src="/img/default_avatar.png">
          <div v-if="post.user" class="">{{ post?.user.information.nickname }}</div>
        </RouterLink>
        <template v-if="user.isLogin">
          <button v-if="!post?.subscribed"
                  class="cursor-pointer bg-blue-600 py-2 px-6 ml-auto font-bold rounded-full text-white"
                  @click="thisSubscribe">关注
          </button>
          <button v-else class="cursor-pointer bg-gray-200 py-2 px-6 ml-auto font-bold rounded-full text-gray-600"
                  @click="thisSubscribe">已关注
          </button>
        </template>
        <template v-else>
          <div class="cursor-pointer bg-gray-200 py-2 px-6 ml-auto font-bold rounded-full text-gray-500">登录后可关注
          </div>
        </template>
      </div>
      <div
          class="size-full relative lg:max-h-200 lg:rounded-2xl bg-white grid lg:grid-cols-[5fr_4fr] lg:grid-rows-[100%] overflow-hidden border-gray-100 border-1 max-lg:static max-lg:space-y-4">
        <template v-if="post?.attachments">
          <div class="swiper max-lg:max-h-150 size-full">
            <div class="swiper-wrapper size-full">
              <div v-for="attachment of post.attachments" class="swiper-slide size-full">
                <div class="size-full">
                  <a :href="attachment.file_path" data-fancybox="gallery">
                    <img
                        :alt="attachment.file_name"
                        :src="attachment.file_path"
                        class="size-full object-cover"
                        @load="updateSwiper"
                    />
                  </a>
                </div>
              </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </template>
        <template v-else>
          <div class="flex flex-col items-center justify-center h-full">
            <div class="text-gray-500">暂无图片</div>
          </div>
        </template>
        <div class="h-full flex flex-col flex-initial border-l-1 border-l-gray-200">
          <div class="flex gap-2 p-5 items-center text-gray-700 flex-initial max-lg:hidden">
            <RouterLink :to="({'name': 'post-me', 'params': {'id': post.user_id}})" class="flex gap-2 items-center">
              <img v-if="post?.user" :src="post?.user.information.avatar_path" alt="头像"
                   class="size-10 rounded-full border-gray-100">
              <img v-else alt="头像" class="size-10 rounded-full border-gray-100" src="/img/default_avatar.png">
              <div v-if="post.user" class="">{{ post?.user.information.nickname }}</div>
            </RouterLink>
            <template v-if="user.isLogin">
              <button v-if="!post?.subscribed"
                      class="cursor-pointer bg-blue-600 py-2 px-6 ml-auto font-bold rounded-full text-white"
                      @click="thisSubscribe">关注
              </button>
              <button v-else class="cursor-pointer bg-gray-200 py-2 px-6 ml-auto font-bold rounded-full text-gray-600"
                      @click="thisSubscribe">已关注
              </button>
            </template>
            <template v-else>
              <div class="cursor-pointer bg-gray-200 py-2 px-6 ml-auto font-bold rounded-full text-gray-500">登录后可关注
              </div>
            </template>
          </div>
          <div class="px-5 pb-5 space-y-2 flex-auto overflow-y-auto">
            <div class="">
              <div class="font-[550] text-lg">{{ post?.title }}</div>
              <div v-if="post.content" class="markdown-content" v-html="renderMarkdown(post.content)"/>
              <div v-for="category of post.categories" v-if="post.categories" class="flex flex-wrap gap-1 px-1">
                <RouterLink :to="{'name': 'post-category', 'params': {'id': category.id}}" class="text-blue-500">#
                  {{ category.name }}
                </RouterLink>
              </div>
              <div v-if="post?.coordinates" class="my-2 flex gap-2">
                <RouterLink :to="`/map?location=${post.coordinates}&zoom=16`"
                            class="flex gap-0.5 hover:text-blue-500 items-center cursor-pointer">
                  <RiMapPinLine class="size-4"/>
                  {{ post.position_name }}
                </RouterLink>
                <RouterLink v-if="weather" :to="{'name': 'weather-home', 'query': {'location': post.position_name}}"
                            class="flex gap-0.5 hover:text-blue-500 items-center cursor-pointer">
                  <i :class="`qi-${weather.now.icon}-fill`" class="text-base"/>
                  {{ weather.now.text }}
                </RouterLink>
              </div>
              <div v-else-if="post?.position_name" class="my-2 flex gap-2">
                <div class="flex gap-0.5 items-center cursor-pointer">
                  <RiMapPinLine class="size-4"/>
                  {{ post.position_name }}
                </div>
              </div>
              <div class="flex items-center justify-between pb-3 border-b-1 border-b-gray-200">
                <div class="text-gray-500 flex gap-2">
                  <div class="">{{ formatRelativeTime(post.update_time) }}</div>
                  <RouterLink v-if="user.isLogin && post?.user_id && post.user_id == user.user.id"
                              :to="{'name': 'post-edit', 'params': {'id': post.id}}"
                              class="text-blue-500 hover:text-blue-600">编辑
                  </RouterLink>
                </div>
                <div v-if="post" class="flex gap-1 cursor-pointer" @click="like">
                  <RiHeartFill v-if="getLike" class="size-5 fill-red-500"/>
                  <RiHeartLine v-else class="size-5"/>
                  <div class="text-sm text-gray-600">{{ post?.likes }}</div>
                </div>
              </div>
              <CommentNode
                  :comments="post?.comments || []"
                  @update-parent-id="updateCommentParentId"
              />
            </div>
          </div>
          <div v-if="user.isLogin" class="p-3 border-t-1 border-t-gray-200 flex gap-2">
            <div class="rounded-full bg-gray-100 h-9 has-[:focus]:outline-2 has-[:focus]:outline-blue-600 px-3 flex-auto">
              <input
                  v-model="commentContent"
                  :placeholder="replyToNickname ? `回复 ${replyToNickname}` : '评论'"
                  class="w-full h-full outline-none"
              />
            </div>
            <button
                class="rounded-full bg-blue-500 text-white flex items-center px-4 h-full cursor-pointer"
                @click="thisComment()"
            >
              发送
            </button>
            <button
                v-if="parentId != null"
                class="rounded-full bg-gray-500 text-white flex items-center px-4 h-full cursor-pointer"
                @click="cancelReply"
            >
              取消回复
            </button>
          </div>
          <div v-else class="rounded-full h-9 has-[:focus]:outline-2 has-[:focus]:outline-blue-600 p-2 flex-auto">
            <div class="text-gray-500 text-center">登录后可评论</div>
          </div>
        </div>
        <div
            class="absolute left-3 top-3 size-7 bg-gray-500/30 rounded-full flex items-center justify-center cursor-pointer z-3 max-lg:hidden"
            title="返回" @click="$router.back()">
          <RiCloseLine class="size-5 text-white"/>
        </div>
      </div>
    </div>
    <div v-else class="flex items-center justify-center size-full text-red-600 text-2xl">
      该帖子被管理员标记为“不合规”
    </div>
  </div>
  <div v-else class="flex items-center justify-center">
    加载中...
  </div>
</template>

<style scoped>
@import "@/assets/css/markdown.css";

.swiper-button-prev, .swiper-button-next {
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff;
  width: 30px;
  height: 30px;
  --swiper-navigation-size: 14px;
}

.swiper-pagination {
  position: absolute;
  top: 10px;
  left: unset;
  right: 10px;
  width: fit-content;
  height: fit-content;
  padding: 5px 10px;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.2);
  color: white;
}
</style>