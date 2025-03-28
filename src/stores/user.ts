import { defineStore } from "pinia";
import { ref, toRaw } from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isLogin = ref<boolean | null>(null);

  // 从 localStorage 初始化用户数据（保持原有逻辑）
  user.value = JSON.parse(localStorage.getItem("user") || "null");
  console.log("从localStorage内获取用户信息", toRaw(user.value));

  // 原有 setUser 方法保持不变
  function setUser(newUser: any) {
    if (newUser) {
      localStorage.setItem("user", JSON.stringify(newUser));
    } else {
      localStorage.removeItem("user");
    }
    user.value = newUser;
    console.log("user被改变");
    console.log(newUser);
  }

  // 原有 setLogin 方法保持不变
  function setLogin(newValue: boolean) {
    console.log(`isLogin被改变：${newValue}`);
    isLogin.value = newValue;
  }

  // 新增：初始化登录状态的逻辑
  function initializeLoginStatus() {
    // 如果 user 有值且 isLogin 未被明确设置，则认为已登录
    if (user.value && isLogin.value === null) {
      setLogin(true);
    } else if (!user.value && isLogin.value === null) {
      setLogin(false);
    }
    // 如果 isLogin 已明确设置为 true 或 false，则保持不变
  }

  // 新增：异步检查登录状态（可扩展）
  async function checkLoginStatus() {
    // 初始化登录状态
    initializeLoginStatus();
    // 这里可以添加异步验证逻辑（可选），当前仅基于本地存储
    // 例如：如果需要从服务器验证 token，可以在这里实现
  }

  // 在定义时立即初始化登录状态
  initializeLoginStatus();

  return {
    user,
    isLogin,
    setUser,
    setLogin,
    checkLoginStatus,
  };
});