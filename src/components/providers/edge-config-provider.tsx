'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface EdgeConfigData {
  bannerMessage?: string;
  killSwitches?: Record<string, boolean>;
  featuredProducts?: string[];
}

interface EdgeConfigContextType {
  data: EdgeConfigData | null;
  isLoading: boolean;
}

const EdgeConfigContext = createContext<EdgeConfigContextType | null>(null);

export function EdgeConfigProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<EdgeConfigData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEdgeConfig = async () => {
      try {
        const response = await fetch('/api/edge-config');
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error('Failed to fetch Edge Config:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEdgeConfig();
  }, []);

  return (
    <EdgeConfigContext.Provider value={{ data, isLoading }}>
      {children}
    </EdgeConfigContext.Provider>
  );
}

export function useEdgeConfig() {
  const context = useContext(EdgeConfigContext);
  if (!context) {
    throw new Error('useEdgeConfig must be used within an EdgeConfigProvider');
  }
  return context;
}