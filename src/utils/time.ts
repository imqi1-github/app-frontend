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

/**
 * 格式化 ISO 8601 形式的时间，包含日期和星期，如 2025年03月09日 星期日
 * @param isoString
 */
export function formatOnlyDateFromQWeather(isoString: string): string {
  if (!isoString) {
    return undefined;
  }

  const date = new Date(isoString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从 0 开始，所以要 +1
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}月${day}日`;
}

/**
 * 格式化 ISO 8601 形式的时间，如 2025-03-09T16:01+08:00
 * 如果日期超过一天，则在时间前加上对应的天数描述
 * @param isoString ISO 8601 格式的时间字符串
 * @returns 格式化后的时间字符串，例如 "今天 16:01" 或 "3天后 16:01"
 */
export function formatTime2FromQWeather(isoString: string): string {
  if (!isoString) {
    return undefined;
  }

  // 解析输入时间
  const date = new Date(isoString);
  const now = new Date(); // 当前时间

  // 计算日期差（忽略时间部分，只比较日期）
  const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const timeDiff = inputDate.getTime() - currentDate.getTime();
  const dayDiff = Math.round(timeDiff / (1000 * 60 * 60 * 24)); // 天数差，四舍五入处理毫秒级误差

  // 格式化小时和分钟
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const timeStr = `${hours}:${minutes}`;

  // 根据天数差调用 getDayAfter 获取描述
  const dayDescription = dayDiff > 0 ? `+${dayDiff}` : "";

  // 返回带天数描述的时间字符串
  return `${timeStr}${dayDescription}`;
}

/**
 * 根据天数间隔返回描述
 * @param interval 天数间隔
 * @returns 天数描述，例如 "今天"、"明天" 或 "N天后"
 */
export function getDayAfter(interval: number): string {
  if (interval === 0) {
    return "今天";
  } else if (interval === 1) {
    return "明天";
  } else if (interval === 2) {
    return "后天";
  } else if (interval < 0) {
    return `${Math.abs(interval)}天前`; // 处理过去的时间
  } else {
    return `${interval}天后`;
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

/**
 * 格式化相对时间
 * @param timestamp 时间戳（毫秒）
 */
export const formatRelativeTime = (timestamp: number): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const timeStr = `${hours}:${minutes}`;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const dayDiff = Math.floor((today.getTime() - targetDay.getTime()) / (1000 * 60 * 60 * 24));

  if (diffYears > 0) return `${diffYears} 年前`;
  if (diffMonths > 0) return `${diffMonths} 月前`;
  if (diffDays > 2) return `${diffDays} 天前`;
  if (dayDiff === 2) return `前天 ${timeStr}`;
  if (dayDiff === 1) return `昨天 ${timeStr}`;
  if (dayDiff === 0) return `今天 ${timeStr}`;
  return date.toLocaleString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
};