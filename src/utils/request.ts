class request {
  // GET请求
  static async get(url: string): Promise<any> {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok)
      throw new Error(`HTTP错误: ${response.status}`);
    else
      return await response.json();
  }

  // POST请求
  static async post(url: string, data: any): Promise<any> {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`HTTP错误: ${response.status}`);
    } else
      return await response.json();
  }
}

export const get: Function = request.get
export const post: Function = request.post