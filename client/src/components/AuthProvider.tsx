import { createContext, useContext, ReactNode, useState, useEffect } from "react";
import { useLocalStorage } from "../lib/useLocalStorage";
import { User } from "@shared/schema";
import { apiRequest } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
  isLoading: boolean;
  token: string | null;
  isAdmin: boolean;
  showOnboarding: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthResponse {
  user: User;
  token: string;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const [token, setToken] = useLocalStorage<string | null>("token", null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Check if the user is authenticated
    const checkAuth = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        // Try to get the current user with the stored token
        const res = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          credentials: 'include'
        });

        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          // Token is invalid or expired
          setUser(null);
          setToken(null);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [token]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('POST', '/api/auth/login', { email, password });
      const data: AuthResponse = await res.json();
      
      setUser(data.user);
      setToken(data.token);
      
      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.firstName}!`,
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiRequest('POST', '/api/auth/register', { firstName, lastName, email, password });
      const data: AuthResponse = await res.json();
      
      setUser(data.user);
      setToken(data.token);
      
      toast({
        title: "Registration successful",
        description: `Welcome, ${data.user.firstName}!`,
      });
      
      return;
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.message || "Could not create account",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await apiRequest('POST', '/api/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
    }
  };
  
  const completeOnboarding = async () => {
    if (!user) return;
    
    try {
      const res = await apiRequest('POST', '/api/me/complete-onboarding');
      const data = await res.json();
      
      if (data.success) {
        // Update local user state with onboardingComplete = true
        setUser(prev => prev ? { ...prev, onboardingComplete: true } : null);
        
        toast({
          title: "Onboarding complete",
          description: "You're all set to use the app!",
        });
      }
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    }
  };

  // Determine if onboarding should be shown
  const showOnboarding = Boolean(user && !user.onboardingComplete);

  const value = {
    user,
    login,
    register,
    logout,
    completeOnboarding,
    isLoading,
    token,
    isAdmin: user?.isAdmin || false,
    showOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
