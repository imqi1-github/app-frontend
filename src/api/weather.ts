import {get} from "@/utils/request";

const weather_api = `${import.meta.env.VITE_API_URL}/weather`;

export const getWeatherNow = async (location: string) => {
  return await get(`${weather_api}/now?location=${location}`);
}

export const getCoordinates = async (location: string) => {
  return await get(`${weather_api}/coordinates?location=${location}`);
}

export const getCurrentAirQuality = async (location: string) => {
  return await get(`${weather_api}/air-quality-current?location=${location}`);
}

export const getWeatherHourly = async (location: string) => {
  return await get(`${weather_api}/forecast-hourly?location=${location}`);
}

export const getMinutelyPrecipitation = async (location: string) => {
  return await get(`${weather_api}/minutely-precipitation?location=${location}`);
}

export const getSevenDaysWeather = async (location: string) => {
  return await get(`${weather_api}/forecast-daily?location=${location}`);
}

export const getIndices = async (location: string) => {
  return await get(`${weather_api}/get_indices?location=${location}`);
}