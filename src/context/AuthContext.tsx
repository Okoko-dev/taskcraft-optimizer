
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  signup: async () => {},
  logout: () => {},
  resetPassword: async () => {},
  updateProfile: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('taskace_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Mock login function
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would call an API endpoint
      // For demo purposes, we'll simulate a successful login
      setTimeout(() => {
        const newUser = {
          id: '1',
          name: 'Emma Walls',
          email: email,
          avatar: '/lovable-uploads/7156323a-9b42-44ad-89f9-d6477e9a511a.png',
        };
        setUser(newUser);
        localStorage.setItem('taskace_user', JSON.stringify(newUser));
        toast.success("Logged in successfully!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Login failed. Please try again.");
      setLoading(false);
      throw error;
    }
  };

  // Mock signup function
  const signup = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      // In a real app, this would call an API endpoint
      // For demo purposes, we'll simulate a successful signup
      setTimeout(() => {
        const newUser = {
          id: '1',
          name: name,
          email: email,
          avatar: '/lovable-uploads/7156323a-9b42-44ad-89f9-d6477e9a511a.png',
        };
        setUser(newUser);
        localStorage.setItem('taskace_user', JSON.stringify(newUser));
        toast.success("Account created successfully!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Signup failed. Please try again.");
      setLoading(false);
      throw error;
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskace_user');
    toast.success("Logged out successfully!");
  };

  // Mock reset password function
  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      // In a real app, this would call an API endpoint
      // For demo purposes, we'll simulate a successful password reset
      setTimeout(() => {
        toast.success("Password reset email sent!");
        setLoading(false);
      }, 1000);
    } catch (error) {
      toast.error("Password reset failed. Please try again.");
      setLoading(false);
      throw error;
    }
  };

  // Add the updateProfile function
  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('taskace_user', JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout, 
      resetPassword,
      updateProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
