<script lang="ts" setup>
import {
  ArrowLeftIcon,
  ChatBubbleLeftEllipsisIcon,
  PencilIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon
} from "@heroicons/vue/24/outline";
import {deleteAttachment, getCategories, newPost, uploadAttachment} from "@api/post.ts";
import {onMounted, ref, toRaw} from "vue";
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/user.ts";
import {useRouter} from "vue-router";

const attachments = ref([])
const toast = useToast();
const categories = ref()
const selectedCategories = ref([])

const thisUploadAttachment = async () => {
  const res = await uploadAttachment()
  if (res.msg) {
    attachments.value.push({
      filepath: res.filepath, filename: res.filename, id: res.id
    })
  }
}

const thisDeleteAttachment = async (id: number, index: number) => {
  const res = await deleteAttachment(id)
  if (res.msg) {
    toast.success(res.msg)
  }
  attachments.value.splice(index, 1)
}


const user = useUserStore()
const titleInput = ref();
const contentInput = ref();
const router = useRouter()

const thisNewPost = async () => {
  try {
    const data = {
      user_id: user.user.id,
      title: titleInput.value,
      content: contentInput.value,
      attachments: toRaw(attachments.value),
      categories: toRaw(selectedCategories.value)
    }
    if (!data.title) {
      toast.error("标题不能为空")
      return;
    } else if (!data.content) {
      toast.error("内容不能为空")
      return;
    } else if (data.categories.length === 0) {
      toast.error("至少选择一个分类")
      return;
    } else if (data.attachments.length === 0) {
      toast.error("至少上传一张图片")
      return;
    }
    console.log("尝试发布帖子，数据", data)
    const res = await newPost(data)
    if (res.msg) {
      toast.success(res.msg)
      await router.push({'name': 'post-content', 'params': {'id': res.id}})
    }
  } catch (e) {
    console.error(e)
  }
}

onMounted(() => {
  getCategories().then(res => {
    console.log("帖子目录：", res.data);
    categories.value = res.data;
  });
})
</script>
<template>
  <div class="p-6 rounded-2xl min-w-full max-w-full bg-white space-y-4">
    <div class="flex gap-1 items-center hover:text-blue-500 cursor-pointer" @click="$router.back()">
      <ArrowLeftIcon class="size-5"/>
      返回
    </div>
    <div class="flex gap-1 items-center">
      <PhotoIcon class="size-5"/>
      <span class="font-bold text-lg">附件</span>
    </div>
    <div class="flex gap-2">
      <div
          class="size-25 rounded bg-gray-50 border-1 border-gray-100 flex flex-col items-center justify-center hover:text-blue-600 cursor-pointer"
          @click="thisUploadAttachment">
        <PlusIcon class="size-7"/>
        添加
      </div>
      <div v-for="(attachment, index) of attachments || []" :key="index"
           class="overflow-hidden relative group size-25 rounded bg-gray-50 border-1 border-gray-100 flex flex-col items-center justify-center cursor-pointer"
           @click="thisDeleteAttachment(attachment.id, index)">
        <img :alt="attachment.filename" :src="attachment.filepath" class="size-full object-cover">
        <div class="absolute top-0 right-0 p-1">
          <XMarkIcon class="size-3 hidden group-hover:block"/>
        </div>
      </div>
    </div>
    <div class="flex gap-1 items-center">
      <PencilIcon class="size-5"/>
      <span class="font-bold text-lg">正文内容</span>
    </div>
    <div class="focus-within:outline-1 focus-within:outline-blue-600 border-1 border-gray-200 rounded-lg w-100">
      <input v-model="titleInput" class="w-full px-2 py-1 rounded-lg outline-none" maxlength="50" placeholder="标题"
             type="text">
    </div>
    <div class="focus-within:outline-1 focus-within:outline-blue-600 border-1 border-gray-200 rounded-lg">
      <textarea v-model="contentInput" class="w-full h-36 px-2 py-1 rounded-lg outline-none"
                placeholder="正文内容，支持Markdown"></textarea>
    </div>
    <div class="flex gap-1 items-center">
      <ChatBubbleLeftEllipsisIcon class="size-5"/>
      <span class="font-bold text-lg">话题</span>
    </div>
    <div class="flex flex-wrap gap-2">
      <div
          v-for="(category, index) of categories || []"
          :key="index"
          class="flex gap-1 items-center justify-center   cursor-pointer"
      >
        <input :id="`category-${category.id}`" v-model="selectedCategories" :value="category.id" class="size-3"
               type="checkbox"/>
        <label :for="`category-${category.id}`">{{ category.name }}</label>
      </div>
    </div>
    <span
        class="inline-flex divide-x divide-gray-300 overflow-hidden rounded border border-gray-300 bg-white"
    >
  <button
      class="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative cursor-pointer"
      type="button"
      @click="thisNewPost"
  >
    发布
  </button>

  <button
      class="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative cursor-pointer"
      type="button"
  >
    暂存
  </button>

  <button
      class="px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 focus:relative cursor-pointer"
      type="button" @click=""
  >
    删除
  </button>
</span>
  </div>
</template>