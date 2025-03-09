import {get, post} from "@/utils/request.ts";

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