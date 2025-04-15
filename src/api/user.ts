import {get, post} from "@/utils/request"
import {useToast} from "vue-toastification";
import {useUserStore} from "@/stores/user.ts";

const user_api = import.meta.env.VITE_API_URL + "/user";
const toast = useToast();
const userStore = useUserStore();

export const login = async (data: any): Promise<any> => {
  return await post(`${user_api}/login`, data);
}

export const register = async (data: any): Promise<any> => {
  return await post(`${user_api}/register`, data);
}

export const testLogin = async (): Promise<any> => {
  return await get(`${user_api}/test-login`);
}

export const setNickname = async (data: any): Promise<any> => {
  return await post(`${user_api}/set-nickname`, data);
}

export const uploadAvatar = async () => {
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


    const response = await fetch(`${import.meta.env.VITE_API_URL}/user/upload_avatar`, {
      method: "POST",
      headers: {
        "Content-Type": file.type,
        "X-Filename": encodeURIComponent(file.name),
      },
      credentials: 'include',
      body: arrayBuffer,
    });

    const result = await response.json();
    if (response.ok) {
      toast.success("上传成功！");
      console.log("上传成功:", result);
      userStore.setUser(result.user);
    } else {
      toast.warning("上传失败：" + result.error);
    }
  } catch (e) {
  }
};

export const setPosition = async (data: any): Promise<any> => {
  return await post(`${user_api}/set-position`, data);
}

export const logout = async () => {
  return await get(`${user_api}/logout`);
}

export const getInformation = async (id: any) => {
  return await get(`${user_api}/information?user_id=${id}`);
}

export const getMyUploads = async (id: any) => {
  return await get(`${user_api}/my-uploads?user_id=${id}`);
}