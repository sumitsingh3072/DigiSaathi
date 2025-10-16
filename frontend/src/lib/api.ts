export const BASE_URL = "https://digisaathi-hjk0.onrender.com";

export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, options);
  if (!res.ok) {
    let errorMsg = 'API error';
    try {
      const data = await res.json();
      errorMsg = data.detail || JSON.stringify(data);
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

export function authHeaders(token?: string, contentType?: string) {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}
