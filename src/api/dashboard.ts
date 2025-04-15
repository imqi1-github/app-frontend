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
export const editSpot = async (data: any) => {
  return await post(`${adminUrl}/dashboard/spot_edit`, data)
}

export const upload = async () => {
  try {

    const [fileHandle] = await (window as any).showOpenFilePicker({
      types: [{description: "Images", accept: {"image/*": [".png", ".jpg", ".jpeg", ".gif"]}}],
      multiple: false,
    });

    console.log(fileHandle);
    if (!fileHandle) return;


    const file = await fileHandle.getFile();
    if (!file.type.startsWith("image/")) {
      alert("请选择图片文件！");
      return;
    }


    const arrayBuffer = await file.arrayBuffer();


    return (await fetch(`${import.meta.env.VITE_API_URL}/user/upload`, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "X-Filename": encodeURIComponent(file.name),
        "user": userStore.isLogin ? userStore.user.id : null
      },
      credentials: 'include',
      body: arrayBuffer,
    })).json();

  } catch (e) {
  }
};

export const getSpotList = async (page?: number) => {
  return await get(`${adminUrl}/dashboard/spot-list${page ? `?page=${page}` : ""}`)
}

export const deleteSpot = async (id: number) => {
  return await get(`${adminUrl}/dashboard/spot-delete?spot_id=${id}`)
}

export const getPostList = async (page?: number, per_page?: number) => {
  return await get(`${adminUrl}/dashboard/post-list${page ? `?page=${page}` : ""}&per_page=${per_page}`)
}

export const setPublished = async (id: number) => {
  return await get(`${adminUrl}/dashboard/post_set_publish?id=${id}`)
}

export const getUserList = async (page?: number, per_page?: number) => {
  return await get(`${adminUrl}/dashboard/user_list${page ? `?page=${page}` : ""}&per_page=${per_page}`)
}

export const setUserState = async (id: number) => {
  return await get(`${adminUrl}/dashboard/set_user_state?id=${id}`)
}

export const setUser = async (data: any) => {
  return await post(`${adminUrl}/dashboard/set_user`, data)
}

export const addUser = async (data: any) => {
  return await post(`${adminUrl}/dashboard/new_user`, data)
}

export const getUser = async (id: number) => {
  return await get(`${adminUrl}/dashboard/get_user?id=${id}`)
}