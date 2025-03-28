<template>
  <div class="comment-tree">
    <div v-for="comment in topLevelComments" :key="comment.id" class="comment-item">
      <div class="p-3">
        <RouterLink :to="{name: 'post-me', params: {id: comment.user.id}}"
                    class="comment-header flex items-center space-x-3">
          <img
              :src="comment.user.information.avatar_path"
              alt="头像"
              class="w-10 h-10 rounded-full object-cover"
          />
          <span class="nickname font-semibold text-gray-800">{{ comment.user.information.nickname }}</span>
          <span class="create-time text-sm text-gray-500">{{ formatTime(comment.create_time) }}</span>
        </RouterLink>
        <div class="comment-content mt-2 text-gray-700">{{ comment.content }}</div>
        <button v-if="user.isLogin"
                class="flex gap-1 items-center w-fit h-5 mt-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                @click="$emit('update-parent-id', comment.id, comment.user.information.nickname)"
        >
          <ChatBubbleOvalLeftEllipsisIcon class="size-5"/>
          回复
        </button>
        <div v-if="comment.children.length" class="comment-children ml-3 mt-4">
          <div v-for="child in comment.children" :key="child.id" class="p-3">
            <RouterLink :to="{name: 'post-me', params: {id: child.user.id}}"
                        class="comment-header flex items-center space-x-3">
              <img
                  :src="child.user.information.avatar_path"
                  alt="头像"
                  class="w-10 h-10 rounded-full object-cover"
              />
              <span class="nickname font-semibold text-gray-800">{{ child.user.information.nickname }}</span>
              <span class="create-time text-sm text-gray-500">{{ formatTime(child.create_time) }}</span>
            </RouterLink>
            <div class="comment-content mt-2 text-gray-700">{{ child.content }}</div>
            <button v-if="user.isLogin"
                    class="flex gap-1 items-center w-fit h-5 mt-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                    @click="$emit('update-parent-id', child.id, child.user.information.nickname)"
            >
              <ChatBubbleOvalLeftEllipsisIcon class="size-5"/>
              回复
            </button>
            <div v-if="child.children.length" class="comment-children ml-3">
              <div v-for="grandchild in child.children" :key="grandchild.id" class="p-3">
                <RouterLink :to="{name: 'post-me', params: {id: grandchild.user.id}}"
                            class="comment-header flex items-center space-x-3">
                  <img
                      :src="grandchild.user.information.avatar_path"
                      alt="头像"
                      class="w-10 h-10 rounded-full object-cover"
                  />
                  <span class="nickname font-semibold text-gray-800">
                    {{ grandchild.user.information.nickname }}
                  </span>
                  <span class="create-time text-sm text-gray-500">{{ formatTime(grandchild.create_time) }}</span>
                </RouterLink>
                <div class="comment-content mt-2 text-gray-700">{{ grandchild.content }}</div>
                <button v-if="user.isLogin"
                        class="flex gap-1 items-center w-fit h-5 mt-1 text-gray-600 hover:text-gray-900 cursor-pointer"
                        @click="$emit('update-parent-id', grandchild.id, grandchild.user.information.nickname)"
                >
                  <ChatBubbleOvalLeftEllipsisIcon class="size-5"/>
                  回复
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue';
import {ChatBubbleOvalLeftEllipsisIcon} from "@heroicons/vue/24/outline"
import {useUserStore} from "@/stores/user.ts";

interface UserInfo {
  avatar_path: string;
  email: string;
  id: number;
  nickname: string;
  position_city: string;
  position_province: string;
  user_id: number;
}

interface User {
  id: number;
  information: UserInfo;
  password: string;
  role: string;
  uploads: any[];
  username: string;
}

interface Comment {
  children: Comment[];
  content: string;
  create_time: number;
  id: number;
  parent_id: number | null;
  post_id: number;
  user: User;
  user_id: number;
}

const props = defineProps<{
  comments: Comment[];
}>();

const topLevelComments = computed(() =>
    props.comments.filter(comment => comment.parent_id === null)
);

const formatTime = (timestamp: number): string =>
    new Date(timestamp * 1000).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

defineEmits<{
  (e: 'update-parent-id', id: number | null, nickname?: string): void
}>();

const user = useUserStore();
</script>