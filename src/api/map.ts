import {get} from "@/utils/request.ts";

const map_api = import.meta.env.VITE_API_URL + "/map";

export const getLocationByCoordinates = async (location: string) => {
  return await get(`${map_api}/location?coordinates=${location}`);
};

export const getSpots = async () => {
  return await get(`${map_api}/spots`);
}