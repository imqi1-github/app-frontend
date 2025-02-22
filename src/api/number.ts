import {get} from "@/utils/request"

const number_api: string = import.meta.env.VITE_API_URL + "/number"

export async function getNumber(): Promise<{ number:number }> {
  return await get(`${number_api}/get`)
}

export async function plusNumber(): Promise<{ number:number }> {
  return await get(`${number_api}/add`)
}

export async function setNumber(): Promise<{ number:number }> {
  return await get(`${number_api}/set`)
}