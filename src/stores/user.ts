import {defineStore} from "pinia";
import {ref, toRaw} from "vue";
import {testLogin} from "@api/user.ts";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isLogin = ref<boolean | null>(null);
  const role = ref<"admin" | "user" | null>(null)
  user.value = JSON.parse(localStorage.getItem("user") || "null");
  console.log("从localStorage内获取用户信息", toRaw(user.value));


  function setUser(newUser: any) {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
      isLogin.value = true;
    } else {
      localStorage.removeItem("user");
      isLogin.value = false;
    }
    user.value = newUser;
    role.value = newUser?.role;
    console.log("user被改变：", newUser);
  }

  function setLogin(newValue: boolean) {
    console.log(`isLogin被改变：${newValue}`);
    isLogin.value = newValue;
  }

  function initializeLoginStatus() {
    if (user.value && isLogin.value === null) {
      setLogin(true);
    } else if (!user.value && isLogin.value === null) {
      setLogin(false);
    }
    if (user.value?.role) {
      role.value = user.value.role;
    }
  }

  async function checkLoginStatus() {
    initializeLoginStatus();
    if (isLogin.value !== null) {
      return;
    }
    const role = await testLogin();
    if (role?.user.role === "admin" || role?.user.role === "user") {
      setLogin(true);
    } else {
      setLogin(false);
      localStorage.removeItem("user");
    }
  }

  initializeLoginStatus();

  return {
    user,
    isLogin,
    setUser,
    setLogin,
    checkLoginStatus,
    role
  };
});