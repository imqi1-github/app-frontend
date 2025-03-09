import {defineStore} from "pinia"
import {ref} from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isLogin = ref<boolean | null>(null);

  function setUser(newUser: any) {
    user.value = newUser;
    console.dir(`user被改变：${newUser}`);
  }

  function setLogin(newValue: boolean) {
    console.log(`isLogin被改变：${newValue}`);
    isLogin.value = newValue;
  }

  return {
    user,
    isLogin,
    setUser,
    setLogin,
  }
})