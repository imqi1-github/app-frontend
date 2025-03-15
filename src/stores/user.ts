import {defineStore} from "pinia"
import {ref} from "vue";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const isLogin = ref<boolean | null>(null);

  user.value = JSON.parse(localStorage.getItem("user") || null);

  function setUser(newUser: any) {
    if (newUser)
      localStorage.setItem("user", JSON.stringify(newUser));
    else localStorage.removeItem("user");
    user.value = newUser;
    console.log('user被改变');
    console.log(newUser);
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