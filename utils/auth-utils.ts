// utils/auth-utils.ts

/**
 * Enhanced auth utilities for secure token management
 */
export const authUtils = {
  /**
   * Set tokens securely using both localStorage and httpOnly cookies
   */
  setTokens: async (accessToken: string, refreshToken: string) => {
    // Store in localStorage for client-side access
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
    
    // Set httpOnly cookie via API call for enhanced security
    try {
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken })
      });
    } catch (error) {
      console.error('Failed to set auth cookie:', error);
    }
  },

  /**
   * Get access token from localStorage
   */
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  /**
   * Get refresh token from localStorage
   */
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

  /**
   * Clear all tokens and cookies
   */
  clearTokens: async () => {
    // Clear localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    // Clear httpOnly cookie via API call
    try {
      await fetch('/api/auth/clear-cookie', {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to clear auth cookie:', error);
    }
  },

  /**
   * Check if a JWT token is expired
   */
  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch (error) {
      return true; // Consider invalid tokens as expired
    }
  },

  /**
   * Get user data from JWT token
   */
  getUserFromToken: (token: string): { id: string; email: string } | null => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub || payload.user_id,
        email: payload.email
      };
    } catch (error) {
      return null;
    }
  },

  /**
   * Check authentication status via API
   */
  checkAuthStatus: async (): Promise<{
    authenticated: boolean;
    user?: { id: string; email: string };
    expired?: boolean;
  }> => {
    try {
      const response = await fetch('/api/auth/check');
      return await response.json();
    } catch (error) {
      console.error('Failed to check auth status:', error);
      return { authenticated: false };
    }
  }
};

// Legacy functions for backward compatibility
export const setAuthCookie = async (token: string) => {
  try {
    await fetch('/api/auth/set-cookie', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ accessToken: token })
    });
  } catch (error) {
    console.error('Failed to set auth cookie:', error);
  }
};

export const removeAuthCookie = async () => {
  try {
    await fetch('/api/auth/clear-cookie', {
      method: 'POST'
    });
  } catch (error) {
    console.error('Failed to clear auth cookie:', error);
  }
};

export const getAuthToken = (): string | null => {
  return authUtils.getAccessToken();
};