"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { Database } from '@/types/supabase';

type UserProfile = Database['public']['Tables']['users']['Row'];

type AuthContextType = {
  user: User | null;
  session: Session | null;
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
  updateProfile: (profile: Partial<Omit<UserProfile, 'name'>> & { name?: string | null }) => Promise<{
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Fetch user profile from the database
  const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      return null;
    }
  };

  useEffect(() => {
    const setupUser = async (session: Session | null) => {
      setLoading(true);
      
      if (session?.user) {
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
        setUser(session.user);
      } else {
        setProfile(null);
        setUser(null);
      }
      
      setSession(session);
      setLoading(false);
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setupUser(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        await setupUser(session);
        
        // Force router refresh on auth changes to sync with middleware
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [router, supabase.auth]);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('Attempting sign in for:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email: email.trim(), 
        password 
      });

      console.log('Sign in result:', { data: !!data, error });

      if (error) {
        console.error('Sign in error:', error);
        return { error, data: null };
      }

      if (data.session?.user) {
        console.log('Sign in successful, fetching profile...');
        const userProfile = await fetchProfile(data.session.user.id);
        setProfile(userProfile);
        setUser(data.session.user);
        setSession(data.session);
      }

      return { error: null, data };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { error, data: null };
    }
  };

  const signUp = async (formData: SignUpData) => {
    try {
      // Register user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            name: formData.name,
            user_type: formData.userType,
          },
        },
      });

      if (authError) {
        return { error: authError, data: null };
      }

      // Wait briefly for the database trigger to complete
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (authData.user) {
        const userId = authData.user.id;

        // Prepare profile data based on user type
        const profileData: any = {
          id: userId,
          email: formData.email,
          user_type: formData.userType,
          name: formData.name,
        };

        if (formData.userType === 'student') {
          profileData.institution = formData.university || null;
          profileData.field_of_study = formData.fieldOfStudy || null;
          profileData.year_semester = formData.yearSemester || null;
        } else if (formData.userType === 'professional') {
          profileData.industry = formData.industry || null;
          profileData.role_position = formData.role || null;
          profileData.use_case = formData.useCase || null;
        } else {
          profileData.use_case = formData.useCase || null;
        }

        // Use upsert operation
        const { error: upsertError } = await supabase
          .from('users')
          .upsert(profileData, { 
            onConflict: 'id',
            ignoreDuplicates: false 
          });

        if (upsertError) {
          console.error('Error upserting profile:', upsertError);
          return { error: upsertError, data: authData };
        }

        // Add a delay before fetching the profile
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Fetch the updated profile
        const newProfile = await fetchProfile(userId);
        if (newProfile) {
          setProfile(newProfile);
        }
      }

      return { error: null, data: authData };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { error, data: null };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setProfile(null);
      setUser(null);
      setSession(null);
      router.push('/');
      router.refresh(); // Force refresh to sync with middleware
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const result = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return result;
    } catch (error) {
      console.error('Error in resetPassword:', error);
      return { error, data: null };
    }
  };

  const updateProfile = async (profileData: Partial<Omit<UserProfile, 'name'>> & { name?: string | null }) => {
    if (!user) {
      return { error: 'No user logged in', data: null };
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .update(profileData)
        .eq('id', user.id)
        .select()
        .single();

      if (error) {
        return { error, data: null };
      }

      setProfile(data);
      return { error: null, data };
    } catch (error) {
      console.error('Error updating profile:', error);
      return { error, data: null };
    }
  };

  const value = {
    user,
    session,
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