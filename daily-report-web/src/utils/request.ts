import { API_BASE_URL, TOKEN_KEY } from '../config/api';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number>;
}

interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg: string;
}

class RequestError extends Error {
  code: number;

  constructor(code: number, message: string) {
    super(message);
    this.code = code;
    this.name = 'RequestError';
  }
}

export async function request<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...restOptions } = options;

  // 构建 URL
  let url = `${API_BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams.toString()}`;
  }

  // 获取 token
  const token = localStorage.getItem(TOKEN_KEY);

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers as Record<string, string>),
  };

  // 如果有 token，添加到请求头
  if (token) {
    requestHeaders['token'] = token;
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    const data: ApiResponse<T> = await response.json();

    // 检查业务状态码
    if (data.code !== 200) {
      throw new RequestError(data.code, data.msg || '请求失败');
    }

    return data;
  } catch (error) {
    if (error instanceof RequestError) {
      throw error;
    }

    // 网络错误或其他错误
    throw new RequestError(9999, error instanceof Error ? error.message : '网络请求失败');
  }
}
