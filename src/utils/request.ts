import axios from 'axios';
import { useToast } from 'vue-toastification';

const toast = useToast();


const getResult = (response: any, error: boolean) => {
  const json = response.data;

  if (!json) {
    const text = response.statusText;
    if (text) {
      error && toast.error(`访问 ${response.config.url} 时遇到错误：${text}`);
    } else {
      error && toast.error(`访问 ${response.config.url} 时遇到错误：${response.status} ${response.statusText}`);
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
    const response = await axios.get(url, {
      withCredentials: true,
    });
    return getResult(response, error);
  } catch (error: any) {
    toast.error(`访问${url}时遇到错误：${error.message}`);
  }
};


export const post = async (url: string, data: any, error: boolean = true): Promise<any> => {
  try {
    const response = await axios.post(url, data, {
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    return getResult(response, error);
  } catch (error: any) {
    toast.error(`访问${url}时遇到错误：${error.message}`);
  }
};
