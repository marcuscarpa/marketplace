'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

interface AuthContextType {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (redirectTo?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, locale = 'en' }: { children: ReactNode; locale?: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch(`/${locale}/api/auth/me`);
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer ?? null);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    void checkAuth();
  }, [checkAuth]);

  const login = (redirectTo = `/${locale}/account`) => {
    window.location.href = `/${locale}/api/auth/oauth/authorize?redirect=${encodeURIComponent(redirectTo)}`;
  };

  const logout = async () => {
    await fetch(`/${locale}/api/auth/logout`, { method: 'POST', credentials: 'same-origin' });
    setCustomer(null);
    router.push(`/${locale}`);
  };

  return (
    <AuthContext.Provider value={{ customer, isLoading, isAuthenticated: !!customer, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}