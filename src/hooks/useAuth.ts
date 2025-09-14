import { useState, useEffect } from 'react';
import { AuthService } from '../lib/auth';
import type { User } from '@supabase/supabase-js';
import type { Profile } from '../lib/supabase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        setUser(currentUser);
        
        if (currentUser) {
          const userProfile = await AuthService.getCurrentProfile();
          setProfile(userProfile);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = AuthService.onAuthStateChange(async (user) => {
      setUser(user);
      
      if (user) {
        try {
          const userProfile = await AuthService.getCurrentProfile();
          setProfile(userProfile);
        } catch (error) {
          console.error('Error getting profile:', error);
          setProfile(null);
        }
      } else {
        setProfile(null);
      }
      
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, password: string, username: string, displayName: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signUp(email, password, username, displayName);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await AuthService.signIn(email, password);
      return result;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      const result = await AuthService.signOut();
      setUser(null);
      setProfile(null);
      return result;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    isAuthenticated: !!user
  };
}