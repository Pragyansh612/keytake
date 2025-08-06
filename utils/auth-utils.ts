// utils/auth-utils.ts
export const setAuthCookie = (token: string) => {
  // Set cookie that expires in 7 days
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `access_token=${token}; expires=${expires}; path=/; secure; samesite=strict`;
};

export const removeAuthCookie = () => {
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // First try to get from localStorage
  const token = localStorage.getItem('access_token');
  if (token) return token;
  
  // Fallback to cookies
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('access_token='));
  return tokenCookie ? tokenCookie.split('=')[1] : null;
};