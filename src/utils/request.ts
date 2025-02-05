import {useToast} from "vue-toastification";

const toast = useToast();

const getResult = async (response: Response) => {
  let json = await response.json();

  if (!json) {
    let text = await response.text();
    if (text) {
      toast.error(`访问 ${response.url} 时遇到错误：${text}`);
    } else {
      toast.error(`访问 ${response.url} 时遇到错误：${response.status} ${response.statusText}`);
    }
    return
  }

  if (json.error) {
    toast.error(json.error);
    return;
  }

  return json;
}

export const get = async (url: string): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'GET',
    });
    return getResult(response);
  } catch (error: any) {
    toast.error(`访问${url}时遇到错误：${error.message}`);
  }
}

export const post = async (url: string, data: any): Promise<any> => {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return getResult(response);
  } catch (error: any) {
    toast.error(`访问${url}时遇到错误：${error.message}`);
  }
}