"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { setAuthCookie, removeAuthCookie, getAuthToken } from '@/utils/auth-utils';

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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = getAuthToken();
      const userData = localStorage.getItem('user_data');
      
      if (token && userData) {
        try {
          const user = JSON.parse(userData);
          setUser(user);
          // Ensure cookie is set for middleware
          setAuthCookie(token);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('access_token');
          localStorage.removeItem('user_data');
          removeAuthCookie();
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Login failed' }, data: null };
      }

      // Store tokens
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('refresh_token', data.refresh_token);
      setAuthCookie(data.access_token);
      
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
      // Map frontend form data to backend expected format
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
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: { message: data.detail || 'Registration failed' }, data: null };
      }

      // After successful registration, log the user in
      const loginResult = await signIn(formData.email, formData.password);
      
      return loginResult.error ? { error: loginResult.error, data: null } : { error: null, data };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error: { message: 'Network error' }, data: null };
    }
  };

  const signOut = async () => {
    try {
      // Optionally call backend logout endpoint
      const token = localStorage.getItem('access_token');
      if (token) {
        await fetch(`${BACKEND_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error calling logout endpoint:', error);
    }
    
    // Clear local storage and cookies
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    removeAuthCookie();
    
    setUser(null);
    setProfile(null);
    router.push('/');
    router.refresh();
  };

  const resetPassword = async (email: string) => {
    try {
      // You'll need to implement this endpoint in your backend
      const response = await fetch(`${BACKEND_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
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
    const token = getAuthToken();
    if (!token) {
      return { error: { message: 'Not authenticated' }, data: null };
    }

    try {
      const response = await fetch(`${BACKEND_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
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
    session: null, // Remove session as we're not using Supabase directly
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updateProfile,
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