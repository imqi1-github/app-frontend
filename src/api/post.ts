import {get, post} from "@/utils/request.ts";
import {useToast} from "vue-toastification";

const postUrl = import.meta.env.VITE_API_URL + "/post"
const toast = useToast();
export const getPostList = async (page: number = 24, category_id: any = null) => {
  return await get(`${postUrl}/list?page=${page}&category_id=${category_id}`)
}

export const getCategories = async () => {
  return await get(postUrl + "/categories")
}

export const getPost = async (id: any) => {
  return await get(`${postUrl}/${id}`)
}

export const likePost = async (id: any) => {
  const res = await get(`${postUrl}/like/${id}`);
  if (!res.msg) {
    return false
  }
  if (localStorage.getItem("liked") === null) {
    localStorage.setItem("liked", JSON.stringify([]));
  }
  localStorage.setItem("liked", JSON.stringify([...JSON.parse(localStorage.getItem("liked")), id]))
  return true;
}

export const subscribe = async (user_id: number, subscribed_user_id: number) => {
  return await post(`${postUrl}/subscribe`, {
    user_id, subscribed_user_id
  });
}

export const comment = async (data: any) => {
  return await post(`${postUrl}/comment`, data);
}

export const comments = async (post_id: number) => {
  return await get(`${postUrl}/comments/${post_id}`);
}

export const newPost = async (data: any) => {
  return await post(`${postUrl}/new`, data);
}


export const uploadAttachment = async () => {
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


    const response = await fetch(`${postUrl}/upload_attachment`, {
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
    } else {
      toast.warning("上传失败：" + result.error);
    }
    return result;
  } catch (e) {
    toast.error(e);
    throw e;
  }
};

export const deleteAttachment = async (id: number) => {
  return await get(`${postUrl}/attachment/delete?id=${id}`);
}

export const deletePost = async (id: number) => {
  return await get(`${postUrl}/delete?id=${id}`);
}

export const getSubscribed = async (user_id: number, subscribed_user_id: number) => {
  return await get(`${postUrl}/subscribed?user_id=${user_id}&subscribed_user_id=${subscribed_user_id}`)
}

export const editPost = async (data: any) => {
  return await post(`${postUrl}/edit`, data);
}

export const searchPost = async (keywords: string) => {
  return await get(`${postUrl}/search?keywords=${keywords}`);
}