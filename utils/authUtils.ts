export const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;

  // Try localStorage first
  const tokenFromStorage = localStorage.getItem('auth_token');
  if (tokenFromStorage) return tokenFromStorage;

  // Try cookies (assuming your auth sets cookies)
  const cookies = document.cookie.split('; ');
  const tokenCookie = cookies.find(row => row.startsWith('auth_token='));
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }

  // Try sessionStorage
  const tokenFromSession = sessionStorage.getItem('auth_token');
  if (tokenFromSession) return tokenFromSession;

  return null;
};

export const getAuthHeaders = (): HeadersInit => {
  const token = getAuthToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};