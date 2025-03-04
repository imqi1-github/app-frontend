import { useToast } from 'vue-toastification';

const toast = useToast();

const getResult = async (response: Response, error: boolean) => {
  let json = await response.json();

  if (!json) {
    let text = await response.text();
    if (text) {
      error && toast.error(`访问 ${response.url} 时遇到错误：${text}`);
    } else {
      error &&
        toast.error(
          `访问 ${response.url} 时遇到错误：${response.status} ${response.statusText}`
        );
    }
    return;
  }

  if (json.error) {
    error && toast.error(json.error);
    return;
  }

  return json;
};

export const get = async (url: string, error: boolean = true): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include', // 确保携带 Cookie
    });
    return getResult(response, error);
  } catch (error: any) {
    toast.error(`访问${url}时遇到错误：${error.message}`);
  }
};

export const post = async (
  url: string,
  data: any,
  error = true
): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include', // 确保携带 Cookie
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return getResult(response, error);
  } catch (error: any) {
    toast.error(`访问${url}时遇到错误：${error.message}`);
  }
};
