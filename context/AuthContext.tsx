'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('music_sphere_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Login failed');
      }

      const responseData = await res.json();
      const userData = responseData.user;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('music_sphere_user', JSON.stringify(userData));
      router.push(userData.role === 'admin' ? '/admin/dashboard' : '/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const responseData = await res.json();
      
      // Store email for verification flow (mock verification)
      localStorage.setItem('music_sphere_temp_email', data.email);
      localStorage.setItem('music_sphere_temp_user', JSON.stringify(responseData.user));
       
      router.push('/auth/verify');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (code: string) => {
    setIsLoading(true);
    try {
      // Get temp email from storage
      const email = localStorage.getItem('music_sphere_temp_email');
      
      if (!email) {
        throw new Error('Email not found. Please register again.');
      }

      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      const responseData = await res.json();
      const userData = responseData.user;

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('music_sphere_user', JSON.stringify(userData));
      
      // Clear temp data
      localStorage.removeItem('music_sphere_temp_email');
      localStorage.removeItem('music_sphere_temp_user');

      router.push('/dashboard');
    } catch (error: any) {
      console.error('Verification error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('music_sphere_user');
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, register, verifyEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
