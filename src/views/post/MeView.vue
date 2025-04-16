<script lang="ts" setup>
import {onMounted, onUnmounted, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {getInformation} from "@api/user.ts";
import {useUserStore} from "@/stores/user.ts";
import PostHomeItem from "@components/post/PostHomeItem.vue";
import {getSubscribed, subscribe} from "@api/post.ts";
import {useToast} from "vue-toastification";
import {debounce} from "@/utils/func.ts";
import {RiAddLine} from "@remixicon/vue";

const route = useRoute();
const user = ref(null);
const userStore = useUserStore();
const toast = useToast();


const columnCount = ref(4);
const LOAD_THRESHOLD = 200;
const columns = ref<Array<any[]>>([]);
const columnHeights = ref<number[]>([]);
const loading = ref(false);
const page = ref(1);
const hasMore = ref(true);

const initializeColumns = () => {
  columns.value = Array.from({length: columnCount.value}, (): any => []);
  columnHeights.value = Array(columnCount.value).fill(0);
};

watch(() => route.params.id, () => {
  getUser();
  page.value = 1;
  hasMore.value = true;
  initializeColumns();
  loadUserPosts();
});

const getUser = () => {
  if (route.params.id) {
    getInformation(route.params.id).then(res => {
      console.log("用户信息：", res);
      user.value = res;
      loadUserPosts();
    });
  } else if (userStore?.user?.id) {
    getInformation(userStore.user.id).then(res => {
      console.log("用户信息：", res);
      user.value = res;
      loadUserPosts();
    });
  } else {
    user.value = false;
  }
};

const loadUserPosts = () => {
  if (!user.value?.posts || loading.value || !hasMore.value) return;
  loading.value = true;

  const postsPerPage = 20;
  const startIndex = (page.value - 1) * postsPerPage;
  const newPosts = user.value.posts.slice(startIndex, startIndex + postsPerPage);

  if (newPosts.length === 0) {
    hasMore.value = false;
    loading.value = false;
    return;
  }

  newPosts.forEach((post: any) => {
    const shortestColumnIdx = columnHeights.value.indexOf(Math.min(...columnHeights.value));
    columns.value[shortestColumnIdx].push(post);
    columnHeights.value[shortestColumnIdx] += post.height || 300;
  });

  page.value++;
  loading.value = false;
};

const handleScroll = debounce(() => {
  const scrollBottom =
      document.documentElement.scrollHeight -
      window.innerHeight -
      document.documentElement.scrollTop;
  if (scrollBottom < LOAD_THRESHOLD && !loading.value) {
    loadUserPosts();
  }
}, 50);

const updateColumnCount = () => {
  const width = window.innerWidth;
  let newColumnCount;

  if (width < 640) newColumnCount = 1;
  else if (width < 1024) newColumnCount = 2;
  else if (width < 1280) newColumnCount = 3;
  else newColumnCount = 4;

  if (newColumnCount !== columnCount.value) {
    columnCount.value = newColumnCount;
    const allPosts = columns.value.flat();
    initializeColumns();

    allPosts.forEach(post => {
      const shortestColumnIdx = columnHeights.value.indexOf(Math.min(...columnHeights.value));
      columns.value[shortestColumnIdx].push(post);
      columnHeights.value[shortestColumnIdx] += post.height || 300;
    });
  }
};

const handleResize = debounce(() => {
  updateColumnCount();
}, 100);

const subscribed = ref(false);

const thisSubscribe = async () => {
  const res = await subscribe(userStore.user.id, user.value.user.id);
  toast.success(res.msg);
  subscribed.value = res.msg === "关注成功";
};

onMounted(async () => {
  updateColumnCount();
  initializeColumns();
  window.addEventListener('scroll', handleScroll);
  window.addEventListener('resize', handleResize);
  getUser();
  if (userStore.isLogin) {
    subscribed.value = (await getSubscribed(userStore.user.id, Number(route.params.id))).subscribed;
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
});
</script>

<template>
  <div class="size-full flex flex-col items-center">
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
          <div class="text-base">
            <span class="font-bold text-gray-800">{{ user.subscribe_count }}</span>
            <span class="text-gray-600">关注</span>
            <span class="ml-2 font-bold text-gray-800">{{ user.fans_count }}</span>
            <span class="text-gray-600">粉丝</span>
          </div>
          <template v-if="userStore.isLogin && userStore.user?.id == $route.params.id"></template>
          <template v-else-if="userStore.isLogin">
            <button v-if="!subscribed" class="bg-blue-600 px-4 py-1 rounded-xl w-fit text-white mt-4"
                    @click="thisSubscribe">关注
            </button>
            <button v-else class="bg-gray-600 px-4 py-1 rounded-xl w-fit text-white mt-4"
                    @click="thisSubscribe">已关注
            </button>
          </template>
          <template v-else>
            <div class="bg-gray-500 px-4 py-1 rounded-xl w-fit text-white mt-4">登录后可关注</div>
          </template>
        </div>
      </div>
      <div :style="{ gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))` }"
           class="w-full gap-5 grid p-4">
        <div v-for="(col, colIndex) in columns" :key="colIndex" class="space-y-5">
          <PostHomeItem
              v-for="(item, index) in col"
              :key="`${colIndex}-${index}`"
              :post="item"
          />
        </div>
        <div v-if="loading" class="col-span-full text-center p-4">
          加载中...
        </div>
      </div>
    </template>
    <template v-else>
      <div class="text-center text-gray-600 text-lg">
        <div>用户不存在</div>
      </div>
    </template>
    <RouterLink v-if="useUserStore().isLogin" :to="{'name': 'post-write'}"
                class="bg-white !fixed bottom-10 right-10 size-12 rounded-full border-1 border-gray-200 hover:outline-2 hover:outline-blue-700 flex items-center justify-center"
                data-text="写一篇">
      <RiAddLine class="size-6"/>
    </RouterLink>
  </div>
</template>