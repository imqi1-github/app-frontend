/**
 * 创建一个节流函数，限制目标函数在指定时间间隔内只执行一次
 * @param fn 需要节流的函数
 * @param delay 节流的时间间隔（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 50
): (...args: Parameters<T>) => void {
  let lastTime: number = 0; // 上次执行时间
  let timeout: ReturnType<typeof setTimeout> | null = null; // 定时器句柄

  return function (...args: Parameters<T>) {
    const now = Date.now();

    // 如果距离上次执行已经超过 delay，则立即执行
    if (now - lastTime >= delay) {
      if (timeout) {
        clearTimeout(timeout); // 清除可能的定时器
        timeout = null;
      }
      fn(...args); // 执行函数
      lastTime = now; // 更新上次执行时间
    }
    // 如果还未到时间，则设置定时器在剩余时间后执行
    else if (!timeout) {
      const remainingTime = delay - (now - lastTime);
      timeout = setTimeout(() => {
        fn(...args); // 在延迟后执行
        lastTime = Date.now(); // 更新时间
        timeout = null; // 重置定时器
      }, remainingTime);
    }
  };
}