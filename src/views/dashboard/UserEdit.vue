<template>
  <div class="space-y-6">
    <div
        class="flex flex-col rounded-lg bg-white border-1 border-gray-100 divide-gray-200 divide-y-1 overflow-hidden shadow-md shadow-gray-100">
      <div class="font-bold text-lg px-6 py-3 flex items-center gap-1">
        <RiUserLine class="size-5"/>
        账号数据
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">用户名</div>
        <input
            v-model="data.username"
            class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
            type="text"
        />
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">密码</div>
        <input
            v-model="data.password"
            class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
            type="text"
        />
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">用户组 / 权限</div>
        <select
            v-model="data.role"
            class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
        >
          <option value="admin">管理员</option>
          <option value="user">普通用户</option>
        </select>
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">状态</div>
        <div>
          <label class="items-center inline-flex cursor-pointer" for="active">
            <input
                id="active"
                v-model="data.state"
                class="appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-green-500 checked:border-green-500 relative checked:after:content-['✓'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 focus:ring-2 focus:ring-green-300 transition-colors duration-200 mr-1"
                type="radio"
                value="active"
            />
            正常
          </label>
          <label class="items-center inline-flex ml-3 cursor-pointer" for="banned">
            <input
                id="banned"
                v-model="data.state"
                class="appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-red-500 checked:border-red-500 relative checked:after:content-['×'] checked:after:absolute checked:after:text-white checked:after:text-sm checked:after:font-bold checked:after:top-1/2 checked:after:left-1/2 checked:after:-translate-x-1/2 checked:after:-translate-y-1/2 focus:ring-2 focus:ring-red-300 transition-colors duration-200 mr-1"
                type="radio"
                value="banned"
            />
            封禁
          </label>
        </div>
      </div>
    </div>
    <div
        class="flex flex-col rounded-lg bg-white border-1 border-gray-100 divide-gray-200 divide-y-1 overflow-hidden shadow-md shadow-gray-100">
      <div class="font-bold text-lg px-6 py-3 flex items-center gap-1">
        <RiUserLine class="size-5"/>
        个人信息
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">昵称</div>
        <input
            v-model="information.nickname"
            class="lg:max-w-128 w-full px-2 py-1 rounded focus:outline-blue-700 border-1 border-gray-200"
            type="text"
        />
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">所在地</div>
        <div class="grid grid-cols-2 gap-4 max-md:grid-cols-1 max-md:grid-rows-2">
          <div class="">
            <label class="block text-sm/6 font-medium text-gray-900" for="province">省</label>
            <div class="mt-2 grid grid-cols-1">
              <select id="province" v-model="information.position_province"
                      class="col-start-1 row-start-1 text-sm w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                      name="province">
                <option v-for="city of Object.entries(Province)" :key="city[0]" :value="city[1]">{{
                    city[1]
                  }}
                </option>
              </select>
              <RiArrowDownDoubleLine
                  aria-hidden="true"
                  class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 md:size-4"/>
            </div>
          </div>
          <div class="">
            <label class="block text-sm/6 font-medium text-gray-900" for="city">市</label>
            <div class="mt-2 grid grid-cols-1">
              <select id="city" v-model="information.position_city"
                      class="col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pr-8 pl-3 text-sm text-gray-900 outline-1 -outline-offset-1 outline-gray-300 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
                      name="city">
                <option v-for="city of Object.entries(cityData.cityNames)" :key="city[0]" :value="city[1]">{{
                    city[1]
                  }}
                </option>
              </select>
              <RiArrowDownDoubleLine
                  aria-hidden="true"
                  class="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 md:size-4"/>
            </div>
          </div>
        </div>
      </div>
      <div class="px-6 py-4 space-y-3">
        <div class="font-bold text-base">头像</div>
        <div class="items-center gap-6 flex">
          <img :src="information.avatar_path" alt="头像" class="size-16 rounded-full"/>
          <PushButton :class="{'hidden': !$route.params.id}"
                      :onClick="() => information.avatar_path = '/img/default_avatar.png'"
                      text="恢复默认头像"></PushButton>
        </div>
      </div>
    </div>
    <div
        class="bg-white rounded gap-3 divide-y-1 divide-gray-100 shadow-md shadow-gray-100 w-fit px-6 py-2 hover:shadow-gray-200 duration-75 cursor-pointer"
        @click="$route.params.id ? thisEditUser() : thisAddUser()"
    >
      {{ $route.params.id ? "编辑" : "添加" }}
    </div>
  </div>
</template>
<script lang="ts" setup>
import {RiArrowDownDoubleLine, RiUserLine} from "@remixicon/vue";
import {computed, onMounted, ref} from "vue";
import Province from "@assets/city/province.json";
import {getByProvinceName} from "@/utils/city.ts";
import PushButton from "@components/inputs/PushButton.vue";
import {addUser, getUser, setUser} from "@api/dashboard.ts";
import {useToast} from "vue-toastification";
import {useRoute} from "vue-router";

const UserRole = {
  Admin: "admin",
  User: "user"
}

const UserState = {
  Active: "active",
  Banned: "banned"
}

const information = ref({
  information_id: null,
  nickname: "",
  position_province: "河北省",
  position_city: "秦皇岛市",
  avatar_path: "/img/default_avatar.png"
})

const route = useRoute()

const data = ref({
  id: route.params.id ?? null,
  username: "",
  password: "",
  role: UserRole.User,
  state: UserState.Active
})

const cityData = computed(() => {
  const cityData = getByProvinceName(information.value.position_province);
  if (information.value.position_province != "河北省") {
    information.value.position_city = cityData.cityNames[0];
  } else {
    information.value.position_city = "秦皇岛市";
  }
  return cityData;
})

const toast = useToast()

const thisEditUser = async () => {
  if (!data.value.username) {
    toast.error("用户名不能为空");
    return;
  }
  if (!data.value.password) {
    toast.error("密码不能为空");
    return;
  }
  const res = await setUser({
    ...information.value,
    ...data.value
  })
  if (res) {
    toast.success("修改成功");
    thisGetUser()
  }
}

const thisAddUser = async () => {
  if (!data.value.username) {
    toast.error("用户名不能为空");
    return;
  }
  if (!data.value.password) {
    toast.error("密码不能为空");
    return;
  }
  if (!information.value.nickname) {
    toast.error("昵称不能为空");
    return;
  }
  const res = await addUser({
    ...information.value,
    ...data.value
  })
  if (res) {
    toast.success("添加成功");
    thisGetUser(res.user.id)
  }
}

const thisGetUser = (id?: number) => {
  getUser(id ?? route.params.id as any).then(res => {
    console.log("获取用户信息：", res)
    data.value.username = res.username;
    data.value.password = res.password;
    data.value.role = res.role;
    data.value.state = res.state;
    information.value.information_id = res.information.id;
    information.value.nickname = res.information.nickname;
    information.value.avatar_path = res.information.avatar_path;
    information.value.position_province = res.information.position_province;
    information.value.position_city = res.information.position_city;
  })
}

onMounted(() => {
  if (route.params.id) {
    thisGetUser()
  }
})
</script>