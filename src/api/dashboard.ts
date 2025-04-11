import {get, post} from "@/utils/request.ts";
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore()
const toast = useToast()

const adminUrl = import.meta.env.VITE_API_URL

export const adminLogin = async (data: any) => {
  return await post(`${adminUrl}/dashboard/login`, data);
}

export const adminLogout = async () => {
  return await get(`${adminUrl}/dashboard/logout`)
}

export const adminInfo = async (error = true) => {
  return await get(`${adminUrl}/dashboard/info`, error)
}

export const dashboardOverview = async () => {
  return await get(`${adminUrl}/dashboard/overview`)
}

export const addSpot = async (data: any) => {
  return await post(`${adminUrl}/dashboard/spot_new`, data)
}

export const upload = async () => {
  try {
    // 选择文件
    const [fileHandle] = await (window as any).showOpenFilePicker({
      types: [{description: "Images", accept: {"image/*": [".png", ".jpg", ".jpeg", ".gif"]}}],
      multiple: false,
    });

    console.log(fileHandle);
    if (!fileHandle) return;

    // 获取文件
    const file = await fileHandle.getFile();
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件！");
      return;
    }

    // 读取二进制数据
    const arrayBuffer = await file.arrayBuffer();

    // 发送文件到后端
    return (await fetch(`${import.meta.env.VITE_API_URL}/user/upload`, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "X-Filename": encodeURIComponent(file.name),
        "user": userStore.isLogin ? userStore.user.id : null
      },
      credentials: 'include', // 确保携带 Cookie
      body: arrayBuffer,
    })).json();

  } catch (e) {
  }
};
