'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

import { buildOAuthAuthorizeUrl } from '@/lib/auth/login-hint';

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
  login: (redirectTo?: string, email?: string) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, locale = 'en' }: { children: ReactNode; locale?: string }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const checkAuth = useCallback(async () => {
    setIsLoading(true);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 3_000);

    try {
      const response = await fetch(`/${locale}/api/auth/me`, { signal: controller.signal });
      if (response.ok) {
        const data = await response.json();
        setCustomer(data.customer ?? null);
      } else {
        setCustomer(null);
      }
    } catch {
      setCustomer(null);
    } finally {
      clearTimeout(timeout);
      setIsLoading(false);
    }
  }, [locale]);

  useEffect(() => {
    const schedule = () => void checkAuth();

    if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
      const id = window.requestIdleCallback(schedule, { timeout: 1_500 });
      return () => window.cancelIdleCallback(id);
    }

    const timer = window.setTimeout(schedule, 0);
    return () => window.clearTimeout(timer);
  }, [checkAuth]);

  const login = (redirectTo = `/${locale}/account`, email?: string) => {
    window.location.href = buildOAuthAuthorizeUrl(locale, redirectTo, email);
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