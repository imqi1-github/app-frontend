<script lang="ts" setup>
import {computed, nextTick, onMounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {comment, comments, getPost, likePost, subscribe} from "@api/post.ts";
import Swiper from "swiper";
import {Navigation, Pagination} from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import {HeartIcon, XMarkIcon} from "@heroicons/vue/24/outline";
import {HeartIcon as HeartIconSolid} from "@heroicons/vue/24/solid";
import MarkdownIt from "markdown-it";
import {formatRelativeTime} from "@/utils/time.ts";
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/user.ts";
import CommentNode from "@components/post/CommentNode.vue";

const route = useRoute();
const post = ref<any>({});
let swiperInstance: Swiper | null = null
const md = new MarkdownIt({html: true}); // 初始化 markdown-it
const user = useUserStore()

const renderMarkdown = (content: string) => {
  return md.render(content);
};

// 初始化 Swiper
const initSwiper = () => {
  if (swiperInstance) {
    swiperInstance.destroy(); // 如果已有实例，先销毁
  }
  swiperInstance = new Swiper(".swiper", {
    modules: [Navigation, Pagination],
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      type: 'custom', // 使用自定义分页
      renderCustom: (swiper, current, total) => {
        return `${current}/${total}`; // 显示 "1/5"、"2/5" 等格式
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

// 检查是否需要初始化 Swiper
const checkAndInitSwiper = async () => {
  if (post.value?.attachments) {
    await nextTick();
    initSwiper();
  }
};

const toast = useToast()

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
  });
});

watch(
    () => post.value.attachments,
    async (newAttachments, oldAttachments) => {
      if (newAttachments !== oldAttachments) {
        await nextTick();
        initSwiper();
      }
    }
);

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
    parent_id: parentId.value, // 使用当前的parentId
  });
  if (result.msg) {
    toast.success("评论成功");
    commentContent.value = "";
    parentId.value = null; // 重置parentId
    replyToNickname.value = null; // 重置回复目标
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

// 处理取消回复
const cancelReply = () => {
  parentId.value = null;
  replyToNickname.value = null;
};
</script>

<template>
  <div class="size-full flex items-center justify-center">
    <div class="flex gap-2 p-5 items-center text-gray-700 flex-initial lg:hidden size-full">
      <div
          class="p-1 rounded-full flex items-center justify-center cursor-pointer z-3 hover:bg-gray-100"
          title="返回" @click="$router.back()">
        <XMarkIcon class="size-6 text-gray-500"/>
      </div>
      <RouterLink class="flex gap-2 items-center" :to="({'name': 'post-me', 'params': {'id': post.user_id}})">
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
        class="relative lg:max-h-200 lg:rounded-2xl bg-white grid lg:grid-cols-[5fr_4fr] lg:grid-rows-[100%] overflow-hidden border-gray-100 border-1 max-lg:static max-lg:space-y-4">
      <template v-if="post?.attachments">
        <keep-alive>
          <div class="swiper max-lg:max-h-150 size-full">
            <div class="swiper-wrapper size-full">
              <div v-for="attachment of post.attachments" class="swiper-slide size-full">
                <img
                    :alt="attachment.file_name"
                    :src="attachment.file_path"
                    class="size-full object-cover"
                    @load="updateSwiper"
                />
              </div>
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-prev"></div>
            <div class="swiper-button-next"></div>
          </div>
        </keep-alive>
      </template>
      <template v-else>
        <div class="flex flex-col items-center justify-center h-full">
          <div class="text-gray-500">暂无图片</div>
        </div>
      </template>
      <div class="h-full flex flex-col flex-initial border-l-1 border-l-gray-200">
        <div class="flex gap-2 p-5 items-center text-gray-700 flex-initial max-lg:hidden">
          <RouterLink class="flex gap-2 items-center" :to="({'name': 'post-me', 'params': {'id': post.user_id}})">
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
            <div class="flex flex-wrap gap-1" v-if="post.categories" v-for="category of post.categories">
              <RouterLink :to="{'name': 'post-category', 'params': {'id': category.id}}" class="text-blue-500"># {{ category.name }}</RouterLink>
            </div>
            <div class="flex items-center justify-between pb-3 border-b-1 border-b-gray-200">
              <div class="text-gray-500">{{ formatRelativeTime(post.update_time) }}</div>
              <div v-if="post" class="flex gap-1 cursor-pointer" @click="like">
                <HeartIconSolid v-if="getLike" class="size-5 fill-red-500"/>
                <HeartIcon v-else class="size-5"/>
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
                class="w-full h-full outline-none"
                :placeholder="replyToNickname ? `回复 ${replyToNickname}` : '评论'"
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
        <XMarkIcon class="size-5 text-white"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
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

.markdown-content :deep(h1),
.markdown-content :deep(h2),
.markdown-content :deep(h3),
.markdown-content :deep(h4),
.markdown-content :deep(h5),
.markdown-content :deep(h6) {
  margin: 1rem 0 0.5rem;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-content :deep(h1) {
  font-size: 1.75rem;
}

.markdown-content :deep(h2) {
  font-size: 1.5rem;
}

.markdown-content :deep(h3) {
  font-size: 1.25rem;
}

.markdown-content :deep(h4) {
  font-size: 1.1rem;
}

.markdown-content :deep(h5) {
  font-size: 1rem;
}

.markdown-content :deep(h6) {
  font-size: 0.9rem;
  color: #666;
}

/* 段落和文本 */
.markdown-content :deep(p) {
  margin: 0 0 1rem;
}

/* 强调 */
.markdown-content :deep(strong) {
  font-weight: 700;
}

.markdown-content :deep(em) {
  font-style: italic;
}

/* 链接 */
.markdown-content :deep(a) {
  color: #0366d6;
  text-decoration: none;
}

.markdown-content :deep(a:hover) {
  text-decoration: underline;
}

/* 列表 */
.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 0 0 1rem;
  padding-left: 2rem;
}

.markdown-content :deep(ul) {
  list-style-type: disc;
}

.markdown-content :deep(ol) {
  list-style-type: decimal;
}

.markdown-content :deep(li) {
  margin: 0.25rem 0;
}

/* 代码 */
.markdown-content :deep(code) {
  padding: 0.2em 0.4em;
  background: #f5f5f5;
  border-radius: 4px;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 0.9em;
}

.markdown-content :deep(pre) {
  padding: 1rem;
  background: #f5f5f5;
  border-radius: 6px;
  overflow-x: auto;
  margin: 0 0 1rem;
}

.markdown-content :deep(pre code) {
  padding: 0;
  background: none;
}

/* 引用 */
.markdown-content :deep(blockquote) {
  margin: 0 0 1rem;
  padding: 0.5rem 1rem;
  border-left: 4px solid #ddd;
  color: #666;
  background: #fafafa;
}

/* 分隔线 */
.markdown-content :deep(hr) {
  margin: 1.5rem 0;
  border: none;
  border-top: 1px solid #ddd;
}

/* 图片 */
.markdown-content :deep(img) {
  max-width: 100%;
  height: auto;
  margin: 0.5rem 0;
  border-radius: 4px;
}
</style>