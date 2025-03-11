import {BiMap} from "@/utils/map.ts";
import provinceData from "@assets/city/province.json"
import cityData from "@assets/city/city.json"


const provinceBiMap = new BiMap<string, string>();
const provinceCityMap = new Map<string, { cityNames: string[], cityCodes: string[] }>();
const cityBiMap = new BiMap<string, string>();
const cityToProvinceMap = new Map<string, { provinceCode: string, provinceName: string }>();

for (const [provinceCode, provinceName] of Object.entries(provinceData)) {
  provinceBiMap.set(provinceCode, provinceName);
  provinceCityMap.set(provinceCode, {cityNames: [], cityCodes: []});
}

for (const [provinceCode, cities] of Object.entries(cityData)) {
  const provinceName = provinceBiMap.forwardGet(provinceCode);
  if (!provinceName) continue;

  for (const [cityCode, cityName] of Object.entries(cities)) {
    cityBiMap.set(cityCode, cityName);
    cityToProvinceMap.set(cityCode, {provinceCode, provinceName});

    const provinceEntry = provinceCityMap.get(provinceCode);
    if (provinceEntry) {
      provinceEntry.cityNames.push(cityName);
      provinceEntry.cityCodes.push(cityCode);
    }
  }
}

export function getByProvinceCode(provinceCode: string) {
  const provinceName = provinceBiMap.forwardGet(provinceCode);
  if (!provinceName) return undefined;
  return {
    provinceName,
    cityNames: provinceCityMap.get(provinceCode)?.cityNames || [],
    cityCodes: provinceCityMap.get(provinceCode)?.cityCodes || []
  };
}

export function getByProvinceName(provinceName: string) {
  const provinceCode = provinceBiMap.reverseGet(provinceName);
  if (!provinceCode) return undefined;
  return {
    provinceCode,
    cityNames: provinceCityMap.get(provinceCode)?.cityNames || [],
    cityCodes: provinceCityMap.get(provinceCode)?.cityCodes || []
  };
}

export function getByCityCode(cityCode: string) {
  const cityName = cityBiMap.forwardGet(cityCode);
  if (!cityName) return undefined;
  const provinceInfo = cityToProvinceMap.get(cityCode);
  return {
    cityName,
    provinceCode: provinceInfo?.provinceCode,
    provinceName: provinceInfo?.provinceName
  };
}

export function getByCityName(cityName: string) {
  const cityCode = cityBiMap.reverseGet(cityName);
  if (!cityCode) return undefined;
  const provinceInfo = cityToProvinceMap.get(cityCode);
  return {
    cityCode,
    provinceCode: provinceInfo?.provinceCode,
    provinceName: provinceInfo?.provinceName
  };
}

export function formatCoordinates(latitude: number, longitude: number): string {
  const latDirection = latitude >= 0 ? 'N' : 'S';
  const lonDirection = longitude >= 0 ? 'E' : 'W';

  return `${Math.abs(latitude).toFixed(2)}°${latDirection} ${Math.abs(longitude).toFixed(2)}°${lonDirection}`;
}