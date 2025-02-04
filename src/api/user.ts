import {post} from "@/utils/request"

const user_api = import.meta.env.VITE_API_URL + "/user";

export async function new_user(): Promise<any> {
  return await post(`${user_api}/new`, {
    username: "测试名称"
  })
}