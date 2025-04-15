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
  let lastTime: number = 0;
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    const now = Date.now();


    if (now - lastTime >= delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      fn(...args);
      lastTime = now;
    }

    else if (!timeout) {
      const remainingTime = delay - (now - lastTime);
      timeout = setTimeout(() => {
        fn(...args);
        lastTime = Date.now();
        timeout = null;
      }, remainingTime);
    }
  };
}
/**
 * 创建一个防抖函数，限制目标函数在指定时间间隔内只执行一次
 * @param fn 需要防抖的函数
 * @param delay 防抖的时间间隔（毫秒）
 * @returns 防抖后的函数
 */
export const debounce = (fn: Function, delay: number) => {
  let timeout: number;
  return (...args: any[]) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
};