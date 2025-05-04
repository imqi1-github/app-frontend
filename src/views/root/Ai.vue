<template>
  <div class="flex items-center justify-center size-full">
    <div class="max-w-200 size-full grow flex flex-col">
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        <div v-if="isLoading && messages.length === 0" class="flex justify-center items-center h-full text-gray-500">
          <RiLoaderLine class="size-5 animate-spin mr-1"/>
          正在加载，请稍候……
        </div>
        <div v-else>
          <div v-for="(message, index) in messages" :key="index" :class="[
              'flex',
              message.role === 'user' ? 'justify-end' : 'justify-start'
            ]">
            <div :class="[
                'px-6 py-3 rounded-lg rounded-tr-2xl rounded-bl-2xl',
                message.role === 'user' ? 'bg-white text-gray-800' : ''
              ]" class="markdown-content" v-html="renderMarkdown(message.content)">
            </div>
          </div>
        </div>
      </div>
      <div class="p-2 pl-4 bg-white shadow-md shadow-gray-100 mb-2 rounded-xl sticky bottom-4">
        <div class="flex space-x-2">
          <input
              v-model="userInput"
              class="flex-1 rounded-lg focus-within:outline-none border-none"
              placeholder="询问有关于秦皇岛的旅游问题"
              type="text"
              @keyup.enter="sendMessage"
          />
          <button :disabled="isLoading"
                  class="hover:bg-gray-100 cursor-pointer size-9 flex items-center justify-center rounded-full border-1 border-gray-300"
                  @click="clearMessages">
            <RiRefreshLine class="size-5 fill-gray-600"/>
          </button>
          <button :disabled="isLoading"
                  class="hover:bg-gray-700 bg-gray-800 cursor-pointer size-9 flex items-center justify-center rounded-full border-1 border-gray-100"
                  @click="sendMessage">
            <RiLoaderLine v-if="isLoading" class="animate-spin size-5 fill-white"/>
            <RiArrowUpLine v-else class="size-5 fill-white"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref, watch} from 'vue'
import {useToast} from "vue-toastification";
import MarkdownIt from "markdown-it";
import PushButton from "@components/inputs/PushButton.vue";
import {RiArrowUpLine, RiLoaderLine, RiRefreshLine} from "@remixicon/vue";

const md = new MarkdownIt()

interface Message {
  role: 'user' | 'assistant'
  content: string
}

const messages = ref<Message[]>([])
watch(messages, (newMessages) => {
  localStorage.setItem('chat_messages', JSON.stringify(newMessages))
}, {deep: true})

const renderMarkdown = (content: string) => {
  return md.render(content);
};
const userInput = ref('')
const isLoading = ref(false)
const toast = useToast()
let controller = new AbortController()

const initialPrompt = `
你是一个知识丰富、语气自然、有亲和力但不啰嗦的导游，专注于介绍秦皇岛的旅游相关内容。请避免重复使用“嘿”、“对了”、“你想了解什么”等过于口语化的表达。每次回答时请提供丰富的内容，字数控制在300字以上，确保信息量充实、结构清晰。请你主动介绍秦皇岛有哪些适合出行的景点。
`

function clearMessages() {
  messages.value = []
  localStorage.removeItem('chat_messages')
  fetchAIResponse(initialPrompt) // 清空后立刻触发初始请求
}


async function fetchAIResponse(prompt: string) {
  controller.abort()
  controller = new AbortController()

  isLoading.value = true
  const currentMessageIndex = messages.value.length

  try {
    const response = await fetch('https://localhost:5000/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        messages: messages.value,
        location: '秦皇岛'
      }),
      headers: {'Content-Type': 'application/json'},
      signal: controller.signal
    })


    if (!response.ok) {
      toast.error("请求时发生错误")
    }

    const reader = response.body!.getReader()
    const decoder = new TextDecoder('utf-8')
    let result = ''

    messages.value.push({role: 'assistant', content: ''})

    while (true) {
      const {value, done} = await reader.read()
      if (done) break
      result += decoder.decode(value, {stream: true})
      messages.value[currentMessageIndex].content = result
    }
  } catch (error) {
    if (error instanceof Error && error.name !== 'AbortError') {
      messages.value.push({
        role: 'assistant',
        content: '很抱歉，处理您的请求时出错。'
      })
    }
  } finally {
    isLoading.value = false
  }
}

async function sendMessage() {
  if (!userInput.value.trim() || isLoading.value) return
  const userMessage = userInput.value.trim()
  messages.value.push({role: 'user', content: userMessage})
  userInput.value = ''
  await fetchAIResponse('')
}


onMounted(() => {
  const saved = localStorage.getItem('chat_messages')
  if (saved) {
    messages.value = JSON.parse(saved)
  } else {
    fetchAIResponse(initialPrompt)
  }
})
</script>
<style scoped>
@import "@/assets/css/markdown.css";
</style>