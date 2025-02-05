import {post} from "@/utils/request"

const user_api = import.meta.env.VITE_API_URL + "/user";

export const login = async (data: any): Promise<any> => {
  return await post(`${user_api}/login`, data);
}