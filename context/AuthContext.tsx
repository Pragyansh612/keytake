"use client"

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';

type UserProfile = {
  id: string;
  email: string;
  name?: string | null;
  user_type?: string | null;
  institution?: string | null;
  field_of_study?: string | null;
  year_semester?: string | null;
  industry?: string | null;
  role_position?: string | null;
  use_case?: string | null;
  subscription_tier?: string;
  notes_generated?: number;
  current_learning_streak?: number;
  longest_learning_streak?: number;
  last_activity_date?: string | null;
};

type AuthContextType = {
  user: { id: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signUp: (formData: SignUpData) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<{
    error: any | null;
    data: any | null;
  }>;
  refreshToken: () => Promise<boolean>;
};

export type SignUpData = {
  email: string;
  password: string;
  name: string;
  userType: string;
  university?: string | null;
  fieldOfStudy?: string | null;
  yearSemester?: string | null;
  industry?: string | null;
  role?: string | null;
  useCase?: string | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://keytake-backend.onrender.com';

// Enhanced auth utilities
export const authUtils = {
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

  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('access_token');
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refresh_token');
  },

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

  isTokenExpired: (token: string): boolean => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      // Add 30 second buffer to avoid edge cases
      return now >= (payload.exp - 30);
    } catch {
      return true;
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const isAuthenticated = Boolean(user);

  // Token refresh function
  const refreshToken = useCallback(async (): Promise<boolean> => {
    if (refreshing) return false;
    
    const refreshTokenValue = authUtils.getRefreshToken();
    if (!refreshTokenValue) return false;

    setRefreshing(true);
    try {
      const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshTokenValue }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      await authUtils.setTokens(data.access_token, data.refresh_token);
      return true;
    } catch (error) {
      console.error('Token refresh failed:', error);
      // Don't call signOut here to avoid recursion
      await authUtils.clearTokens();
      setUser(null);
      setProfile(null);
      return false;
    } finally {
      setRefreshing(false);
    }
  }, [refreshing]);

  // Fixed authenticatedRequest function
  const authenticatedRequest = useCallback(async (url: string, options: RequestInit = {}): Promise<Response> => {
    let accessToken = authUtils.getAccessToken();
    
    if (!accessToken) {
      throw new Error('No access token available');
    }

    // Check if token is expired and refresh if needed
    if (authUtils.isTokenExpired(accessToken)) {
      console.log('Token expired, attempting refresh...');
      const refreshed = await refreshToken();
      if (!refreshed) {
        throw new Error('Authentication required. Please log in again.');
      }
      accessToken = authUtils.getAccessToken();
    }

    const headers = new Headers(options.headers);
    headers.set('Content-Type', 'application/json');
    if (accessToken) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    // If we get 401/403, try to refresh token once more
    if ((response.status === 401 || response.status === 403)) {
      console.log('Got 401/403, trying token refresh...');
      const refreshed = await refreshToken();
      if (refreshed) {
        const newToken = authUtils.getAccessToken();
        if (newToken) {
          const retryHeaders = new Headers(options.headers);
          retryHeaders.set('Content-Type', 'application/json');
          retryHeaders.set('Authorization', `Bearer ${newToken}`);
          
          const retryResponse = await fetch(url, {
            ...options,
            headers: retryHeaders,
            credentials: 'include',
          });
          
          if (retryResponse.status === 401 || retryResponse.status === 403) {
            // Still failing after refresh, user needs to login
            await authUtils.clearTokens();
            setUser(null);
            setProfile(null);
            throw new Error('Authentication required. Please log in again.');
          }
          
          return retryResponse;
        }
      }
      
      // Refresh failed or no new token
      throw new Error('Authentication required. Please log in again.');
    }

    return response;
  }, [refreshToken]);

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = authUtils.getAccessToken();
        const userData = localStorage.getItem('user_data');
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData);
            
            // Check if token is valid by making a simple API call
            if (!authUtils.isTokenExpired(token)) {
              setUser(user);
              
              // Sync cookie with localStorage token
              await fetch('/api/auth/set-cookie', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: token })
              }).catch(console.error);
            } else {
              // Token expired, try to refresh
              const refreshed = await refreshToken();
              if (refreshed) {
                setUser(user);
              } else {
                await authUtils.clearTokens();
              }
            }
          } catch (error) {
            console.error('Error parsing user data:', error);
            await authUtils.clearTokens();
          }
        } else {
          await authUtils.clearTokens();
        }
      } catch (error) {
        console.error('Error checking auth:', error);
        await authUtils.clearTokens();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [refreshToken]);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Login failed' }, data: null };
      }

      // Store tokens securely
      await authUtils.setTokens(data.access_token, data.refresh_token);
      
      // Create user object
      const userData = { id: data.user_id, email };
      localStorage.setItem('user_data', JSON.stringify(userData));
      
      setUser(userData);

      return { error: null, data };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error: { message: 'Network error' }, data: null };
    }
  };

  const signUp = async (formData: SignUpData) => {
    try {
      const requestData = {
        email: formData.email,
        password: formData.password,
        name: formData.name,
        user_type: formData.userType,
      };

      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Registration failed' }, data: null };
      }

      // Auto-login after successful registration
      const loginResult = await signIn(formData.email, formData.password);
      
      return loginResult.error ? { error: loginResult.error, data: null } : { error: null, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: { message: 'Network error' }, data: null };
    }
  };

  const signOut = async () => {
    try {
      const token = authUtils.getAccessToken();
      if (token) {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include',
        }).catch(console.error); // Don't fail signOut on network error
      }
    } catch (error) {
      console.error('Error calling logout endpoint:', error);
    }
    
    // Clear all auth data
    await authUtils.clearTokens();
    setUser(null);
    setProfile(null);
    router.push('/');
    router.refresh();
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Password reset failed' }, data: null };
      }

      return { error: null, data };
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error: { message: 'Network error' }, data: null };
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const response = await authenticatedRequest(`${BACKEND_URL}/users/profile`, {
        method: 'PUT',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Profile update failed' }, data: null };
      }

      setProfile(data);
      return { error: null, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error: { message: 'Network error' }, data: null };
    }
  };

  const value = {
    user,
    profile,
    loading,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
    refreshToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};