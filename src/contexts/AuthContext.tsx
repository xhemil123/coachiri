import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { AuthContextType, User } from '../types';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const clearAuthState = () => {
    setUser(null);
    setIsAdmin(false);
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Error checking session:', sessionError.message);
          clearAuthState();
          return;
        }
        
        if (session?.user && mounted) {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('user_id', session.user.id)
            .maybeSingle();
            
          if (userError) {
            console.error('Error fetching user data:', userError.message);
            clearAuthState();
            return;
          }

          if (userData && mounted) {
            setUser({
              user_id: userData.user_id,
              email: userData.email,
            });
          }
        } else {
          clearAuthState();
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        clearAuthState();
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (userError) {
          console.error('Error fetching user data:', userError.message);
          clearAuthState();
          return;
        }

        if (userData) {
          setUser({
            user_id: session.user.id,
            email: session.user.email || '',
          });
        }
      } else if (event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED_ERROR') {
        clearAuthState();
      }
    });

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      if (!data.session) {
        return { error: 'No session created' };
      }
      
      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const adminLogin = async (email: string, password: string) => {
    try {
      if (email !== 'avdulajirakli@gmail.com' || password !== 'Irakli123@') {
        return { error: 'Invalid admin credentials' };
      }

      setIsAdmin(true);
      // Don't set user state for admin login
      setUser(null);

      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string) => {
    try {
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        return { error: signUpError.message };
      }

      if (authData.user) {
        const { error: insertError } = await supabase.from('users').insert({
          user_id: authData.user.id,
          email,
          password: 'hashed_password',
          registration_date: new Date().toISOString(),
        });

        if (insertError) {
          // If user insert fails, clean up the auth user
          await supabase.auth.signOut();
          return { error: insertError.message };
        }

        setUser({
          user_id: authData.user.id,
          email,
        });
      }

      return { error: null };
    } catch (err) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error during sign out:', error.message);
      }
      clearAuthState();
    } catch (err) {
      console.error('Unexpected error during logout:', err);
      clearAuthState();
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    login,
    adminLogin,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};