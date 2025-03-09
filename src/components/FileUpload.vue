<script setup lang="ts">
import { ref } from "vue";

const file = ref<File | null>(null);
const uploadResult = ref<string>("");

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    file.value = target.files[0];
  }
};

const uploadFile = async () => {
  if (!file.value) {
    uploadResult.value = "请选择一个文件";
    return;
  }

  const formData = new FormData();
  formData.append("file", file.value);

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      uploadResult.value = `✅ 上传成功: ${data.filename}`;
    } else {
      uploadResult.value = `❌ 上传失败: ${data.error}`;
    }
  } catch (error) {
    uploadResult.value = `❌ 上传出错: ${(error as Error).message}`;
  }
};
</script>

<template>
  <div class="flex flex-col items-center p-6 border rounded-lg shadow-md w-80 bg-white">
    <input
        type="file"
        @change="handleFileChange"
        class="mb-4 file:bg-blue-500 file:text-white file:px-4 file:py-2 file:rounded file:cursor-pointer"
    />
    <button
        @click="uploadFile"
        class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full transition"
    >
      上传文件
    </button>
    <p v-if="uploadResult" class="mt-4 text-gray-700 text-sm text-center">{{ uploadResult }}</p>
  </div>
</template>