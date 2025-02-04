import {useToast} from "vue-toastification";

const toast = useToast();

const getResult = async (response: Response) => {
  if (response.ok)
    return await response.json();

  const json = await response.json();
  if ("undefined" != typeof json["error"]) {
    toast.error(json["error"]);
    return json["error"];
  } else {
    toast.error(await response.text());
    return await response.text();
  }
}

class request {
  // GET请求
  static async get(url: string): Promise<any> {
    try {
      const response = await fetch(url, {
        method: 'GET',
      });
      return getResult(response);
    } catch (error: any) {
      toast.error(error.message);
      throw error;
    }
  }

  // POST请求
  static async post(url: string, data: any): Promise<any> {
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
      toast.error(error.message);
      throw error;
    }
  }
}

export const get: Function = request.get
export const post: Function = request.post