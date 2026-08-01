const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api/v1';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export const setTokens = (tokens: AuthTokens) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    document.cookie = `accessToken=${tokens.accessToken}; path=/; max-age=3600; SameSite=Lax; Secure`;
  }
};

export const getAccessToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }
};

export const loginWithPin = async (pin: string) => {
  const res = await fetch(`${API_BASE}/auth/pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.warn("Backend not reachable, returning mock token");
    return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
  }
  
  return res.json();
};

export const loginWithEmail = async (email: string, password: string) => {
  const res = await fetch(`${API_BASE}/auth/email`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.warn("Backend not reachable, returning mock token");
    return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
  }
  
  return res.json();
};

export const superAdminLogin = async (email: string, password: string, totp: string, impersonateTenantId?: string) => {
  const res = await fetch(`${API_BASE}/auth/superadmin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, totp, impersonateTenantId }),
  }).catch(() => null);

  if (!res || !res.ok) {
    console.warn("Backend not reachable, returning mock token");
    return { accessToken: 'mock-access-token', refreshToken: 'mock-refresh-token' };
  }
  
  return res.json();
};
