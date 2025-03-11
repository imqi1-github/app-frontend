/**
 * 格式化 ISO 8601 形式的时间，如 2025-03-09T16:01+08:00
 * @param isoString
 */
export function formatTimeFromQWeather(isoString: string): string {
  if (!isoString) {
    return undefined;
  }
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以要 +1
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${year}年${month}月${day}日 ${hours}:${minutes}`;
}

/**
 * 格式化 ISO 8601 形式的时间，包含日期和星期，如 2025年03月09日 星期日
 * @param isoString
 */
export function formatDateFromQWeather(isoString: string): string {
  if (!isoString) {
    return undefined;
  }

  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以要 +1
  const day = String(date.getDate()).padStart(2, '0');

  // 获取星期
  const weekdays = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  const weekday = weekdays[date.getDay()];

  return `${year}年${month}月${day}日 ${weekday}`;
}

export function getDayAfter(interval: number): string {
  if (interval == 0) {
    return "今天";
  } else if (interval == 1) {
    return "明天";
  } else if (interval == 2) {
    return "后天";
  } else {
    return interval + "天后";
  }
}

export function formatDateToChinese(dateStr: string): string {
  // 验证输入格式是否正确
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    return "日期格式错误，请使用 YYYY-MM-DD 格式";
  }

  try {
    // 分割年月日
    const [year, month, day] = dateStr.split('-').map(Number);

    // 验证月份和日期的有效性
    if (month < 1 || month > 12) {
      return "月份无效";
    }
    if (day < 1 || day > 31) {
      return "日期无效";
    }

    // 返回格式化后的字符串
    return `${month}月${day}日`;
  } catch (error) {
    return "日期处理错误";
  }
}