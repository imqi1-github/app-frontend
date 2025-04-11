import {get} from "@/utils/request";

const spotApi = `${import.meta.env.VITE_API_URL}/spot`

export const getSpot = async (id: number) => {
  return await get(`${spotApi}/${id}`);
};

export const good = async (id: number) => {
  return await get(`${spotApi}/${id}/good`);
};

export const bad = async (id: number) => {
  return await get(`${spotApi}/${id}/bad`);
};

export const getSpotsRandom = async () => {
  return await get(`${spotApi}/random`);
};