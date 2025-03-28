/**
 * 根据 AQI 数值获取空气质量等级和 Tailwind CSS 颜色类
 * @param aqi 空气质量指数
 * @returns { level: string, colorClass: string }
 */
export function getAQILevel(aqi: number): { level: string; colorClass: string } {
  if (!aqi) {
    return {
      level: "未知",
      colorClass: "gray",
    }
  }

  if (aqi >= 0 && aqi <= 50) {
    return { level: "优", colorClass: "green" };
  } else if (aqi <= 100) {
    return { level: "良", colorClass: "orange" };
  } else if (aqi <= 150) {
    return { level: "轻度污染", colorClass: "brown" };
  } else if (aqi <= 200) {
    return { level: "中度污染", colorClass: "red" };
  } else if (aqi <= 300) {
    return { level: "重度污染", colorClass: "purple" };
  } else {
    return { level: "严重污染", colorClass: "rose" };
  }
}