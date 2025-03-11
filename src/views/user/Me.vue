<script lang="ts" setup>
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/user";
import {setNickname as _setNickname, uploadAvatar, setPosition as _setPosition} from "@api/user"
import {computed, onMounted, ref, watch} from "vue";
import {ChevronDownIcon} from "@heroicons/vue/16/solid";
import Province from "@assets/city/province.json"
import {getByProvinceName} from "@/utils/city"
import {useRouter} from "vue-router";

const toast = useToast();
const userStore = useUserStore();
const router = useRouter();

const userInput = ref(null)
const provinceSelect = ref<string>(userStore.user?.information[0].position_province ?? "河北省")
const citySelect = ref(userStore.user?.information[0].position_city ?? "秦皇岛市")

const cityData = computed(() => {
  const data = getByProvinceName(provinceSelect.value);
  if (provinceSelect.value != userStore.user?.information[0].position_province) {
    citySelect.value = data.cityNames[0]
  }
  return data
})

watch(
    () => userStore.user,
    (newUser) => {
      if (newUser?.information?.[0]) {
        provinceSelect.value = newUser.information[0].position_province || "河北省";
        citySelect.value = newUser.information[0].position_city || "秦皇岛市";
      }
    },
    {deep: true} // 如果user是个深层对象需要deep监听
);

onMounted(() => {
  if (userStore.user) {
    citySelect.value = userStore.user?.information[0].position_city;
  }
})

const setPosition = async () => {
  const response = await _setPosition({
    'province': provinceSelect.value,
    'city': citySelect.value
  });
  userStore.setUser(response.user);
  toast.success("位置修改成功");
}

const setNickname = async () => {
  const response = await _setNickname({nickname: userInput.value.value});
  userStore.setUser(response.user);
  toast.success('昵称修改成功');
}

watch(() => userStore.isLogin, (newValue) => {
  if (!newValue) {
    router.push(router.resolve({'name': 'login'}).href);
    toast.error("用户未登录")
  }
})

</script>
<template>
  <div class="w-full flex flex-col items-center">
    <div class="text-4xl font-bold text-gray-800 border-b-1 border-b-gray-200 w-full flex justify-center max-md:border-b-0">
      <div class="max-w-5xl w-full p-12 pt-24 max-md:text-center max-md:p-4">账户设置</div>
    </div>
    <div class="p-12 w-full max-w-5xl h-full flex flex-col gap-12 items-center justify-center max-md:p-3 max-md:gap-3">
      <div class="w-full h-full border-1 border-gray-200 rounded-lg overflow-hidden">
        <div class="p-6 bg-white">
          <p class="text-xl font-bold text-gray-800">昵称</p>
          <p class="text-gray-600 text-sm my-3">请输入你的全名或你喜欢的显示名称。</p>
          <input id="userInput"
                 ref="userInput"
                 type="text"
                 class="block max-w-60 w-full border-1 border-gray-200 rounded px-3 py-1 focus:outline-blue-700"
                 :value="userStore.user?.information[0].nickname">
        </div>
        <div class="flex justify-between gap-3 items-center w-full px-6 py-4 border-t-1 border-t-gray-200 max-md:flex-col max-md:p-6">
          <div class="text-sm text-gray-500">昵称长度不可超过64字符。</div>
          <button class="block px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded cursor-pointer"
                  @click="setNickname()">提交
          </button>
        </div>
      </div>
      <div class="w-full h-full border-1 border-gray-200 rounded-lg overflow-hidden">
        <div class="p-6 bg-white">
          <span class="relative float-end hover:brightness-95 duration-125">
            <button @click="uploadAvatar" class="absolute inset-0 bg-transparent cursor-pointer"></button>
            <img :src="userStore.user?.information[0].avatar_path ?? '/img/default_avatar.png'" alt="头像"
                 class="rounded-full border-1 border-gray-100 size-16"/>
          </span>
          <p class="text-xl font-bold text-gray-800">头像</p>
          <p class="text-gray-600 text-sm mt-3">这是你的头像。<br/>点击头像以从文件上传你的自定义头像。</p>
        </div>
        <div class="w-full px-6 py-4 border-t-1 border-t-gray-200 text-sm text-gray-500 max-md:text-center">
          头像可选但强烈建议上传一个。
        </div>
      </div>
      <div class="w-full h-full border-1 border-gray-200 rounded-lg overflow-hidden">
        <div class="p-6 bg-white">
          <p class="text-xl font-bold text-gray-800">地区</p>
          <p class="text-gray-600 text-sm my-3">请输入你所在的省市名称。</p>
          <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:grid-rows-2">
            <div class="">
              <label for="province" class="block text-sm/6 font-medium text-gray-900">省</label>
              <div class="mt-2 grid grid-cols-1">
                <select id="province" name="province" v-model="provinceSelect"
                        class="col-start-1 row-start-1 text-sm w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600">
                  <option v-for="city of Object.entries(Province)" :value="city[1]" :key="city[0]">{{
                      city[1]
                    }}
                  </option>
                </select>
                <ChevronDownIcon
                    class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 md:size-4"
                    aria-hidden="true"/>
              </div>
            </div>
            <div class="">
              <label for="city" class="block text-sm/6 font-medium text-gray-900">市</label>
              <div class="mt-2 grid grid-cols-1">
                <select id="city" name="city" v-model="citySelect"
                        class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600">
                  <option v-for="city of Object.entries(cityData.cityNames)" :key="city[0]" :value="city[1]">{{
                      city[1]
                    }}
                  </option>
                </select>
                <ChevronDownIcon
                    class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 md:size-4"
                    aria-hidden="true"/>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-between gap-3 items-center w-full px-6 py-4 border-t-1 border-t-gray-200 max-md:flex-col max-md:p-6">
          <div class="text-sm text-gray-500">天气功能依赖它。</div>
          <button class="block px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white text-sm rounded cursor-pointer"
                  @click="setPosition">
            提交
          </button>
        </div>
      </div>
    </div>
  </div>
</template>