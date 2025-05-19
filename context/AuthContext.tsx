"use client"

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabaseClient';
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
  updateProfile: (profile: Partial<UserProfile>) => Promise<{
    error: any | null;
    data: any | null;
  }>;
};

export type SignUpData = {
  email: string;
  password: string;
  name?: string | null; // Change to allow null
  userType: string;
  university?: string | null; // Change to allow null
  fieldOfStudy?: string | null; // Change to allow null
  yearSemester?: string | null; // Change to allow null
  industry?: string | null; // Change to allow null
  role?: string | null; // Change to allow null
  useCase?: string | null; // Change to allow null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from the database
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle(); // Use maybeSingle instead of single to handle no results

      if (error && error.code !== 'PGRST116') { // Ignore "no rows returned" error
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
      if (session?.user) {
        // Fetch the user profile
        const userProfile = await fetchProfile(session.user.id);
        setProfile(userProfile);
      } else {
        setProfile(null);
      }
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    };

    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setupUser(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        await setupUser(session);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await supabase.auth.signInWithPassword({ email, password });

      if (result.data.session) {
        const userProfile = await fetchProfile(result.data.session.user.id);
        setProfile(userProfile);
      }

      return result;
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
            name: formData.name || null, // Add name here
            user_type: formData.userType,
          },
        },
      });

      if (authError) {
        return { error: authError, data: null };
      }

      // Wait briefly for the database trigger to complete
      await new Promise(resolve => setTimeout(resolve, 2000)); // Increased wait time

      // Update user profile in the database
      // Replace the update section in signUp function with this:
if (authData.user) {
  const userId = authData.user.id;

  // Prepare profile data based on user type
  const profileData: any = {
    id: userId,
    email: formData.email,
    user_type: formData.userType,
    name: formData.name || null,
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

  // Instead of update, use upsert operation
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
      router.push('/');
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

  const updateProfile = async (profileData: Partial<UserProfile>) => {
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