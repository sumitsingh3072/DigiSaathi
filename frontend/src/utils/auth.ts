// src/utils/auth.ts
export function saveToken(token: string) {
  localStorage.setItem("access_token", token);
  document.cookie = `access_token=${token}; path=/; max-age=86400; SameSite=Lax`;
}

export function getToken(): string | null {
  return localStorage.getItem("access_token");
}

export function clearToken() {
  localStorage.removeItem("access_token");
}

export function isLoggedIn(): boolean {
  return !!getToken();
}
