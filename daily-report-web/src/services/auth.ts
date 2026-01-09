import { request } from '../utils/request';
import { TOKEN_KEY } from '../config/api';

export interface AuthTokenResponse {
  code: number;
  data: string;
  msg: string;
}

export async function getToken(code: string): Promise<string> {
  const response = await request<string>('/auth/getToken', {
    params: { code },
  });

  // 保存 token 到 localStorage
  if (response.data) {
    localStorage.setItem(TOKEN_KEY, response.data);
  }

  return response.data;
}

export function getStoredToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}
