<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { HeartIcon as OutlineHeartIcon } from "@heroicons/vue/24/outline";
import { HeartIcon as SolidHeartIcon } from "@heroicons/vue/24/solid";
import { likePost } from "@api/post.ts";
import { useToast } from "vue-toastification";

const router = useRouter();
const toast = useToast();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
});

const likedPosts = ref<number[]>(JSON.parse(localStorage.getItem("liked") || "[]"));

const isLiked = computed(() => likedPosts.value.includes(props.post.id));

const toggleLike = async () => {
  if (isLiked.value) {
    toast.info("你已经喜欢过该帖子了");
    return;
  }
  const result = await likePost(props.post.id);
  if (result) {
    likedPosts.value = [...likedPosts.value, props.post.id];
    localStorage.setItem("liked", JSON.stringify(likedPosts.value));
    props.post.likes += 1;
  }
};

onMounted(() => {
  likedPosts.value = JSON.parse(localStorage.getItem("liked") || "[]");
});
</script>

<template>
  <div class="cursor-pointer">
    <img
        :alt="post?.attachments?.[0]?.file_name"
        :src="post?.attachments?.[0]?.file_path"
        class="min-h-100 rounded-2xl bg-gray-100 border-gray-200 overflow-hidden flex-auto hover:brightness-80 duration-300"
        @click="router.push({ name: 'post-content', params: { id: post.id } })"
    />
    <div class="py-3 px-2 space-y-1.5">
      <div>{{ post.title }}</div>
      <div class="flex justify-between items-center">
        <div class="flex w-fit gap-2 items-center">
          <img
              :src="post?.user?.information?.avatar_path"
              alt=""
              class="size-6 font-[550] rounded-full"
          />
          <div class="text-gray-700 text-sm">{{ post?.user?.information?.nickname }}</div>
        </div>
        <div class="flex gap-1 items-center cursor-pointer" @click.stop="toggleLike">
          <component
              :is="isLiked ? SolidHeartIcon : OutlineHeartIcon"
              class="size-5 duration-200"
              :class="isLiked ? 'text-red-500' : 'text-gray-500'"
          />
          <div class="text-sm" :class="isLiked ? 'text-red-500' : 'text-gray-600'">
            {{ post?.likes }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
