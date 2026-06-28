'use client';

import { useAuth as useAuthContext } from '@/components/providers/auth-provider';

export function useAuth() {
  const { customer, isLoading, isAuthenticated, login, logout } = useAuthContext();
  return { customer, isLoading, isAuthenticated, login, logout };
}