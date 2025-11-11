import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, name: string) => Promise<{ error: AuthError | null; session: Session | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  updateProfile: (data: { full_name?: string }) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      console.log('Signup response:', data);

      if (data.user && data.session) {
        // User is immediately logged in (no email verification required)
        toast.success(`Account created successfully! Welcome, ${name}!`);
        return { error: null, session: data.session };
      } else if (data.user && !data.session) {
        // Email verification is enabled - user created but needs to verify
        toast.success('Account created! Please check your email to verify your account before logging in.', {
          duration: 6000,
        });
        return { error: null, session: null };
      }

      return { error: null, session: null };
    } catch (error) {
      const authError = error as AuthError;
      console.error('Signup error details:', authError);
      
      // Better error messages
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        toast.error('This email is already registered. Please login instead.');
      } else if (authError.message.includes('password')) {
        toast.error('Password must be at least 6 characters long.');
      } else if (authError.message.includes('Invalid email')) {
        toast.error('Please enter a valid email address.');
      } else {
        toast.error(`Signup failed: ${authError.message}`);
      }
      
      return { error: authError, session: null };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success(`Welcome back, ${data.user.user_metadata?.full_name || 'User'}!`);
      }

      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      
      // Better error messages for common issues
      if (authError.message.includes('Email not confirmed')) {
        toast.error('Please verify your email before logging in. Check your inbox for the confirmation link.');
      } else if (authError.message.includes('Invalid login credentials')) {
        toast.error('Invalid email or password. Please try again.');
      } else {
        toast.error(authError.message);
      }
      
      return { error: authError };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message);
    }
  };

  const updateProfile = async (data: { full_name?: string }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        data,
      });

      if (error) throw error;

      toast.success('Profile updated successfully');
      return { error: null };
    } catch (error) {
      const authError = error as AuthError;
      toast.error(authError.message);
      return { error: authError };
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
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
