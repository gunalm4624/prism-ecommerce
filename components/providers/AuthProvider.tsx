"use client";

import { useEffect } from 'react';
import { initializeAuthListener } from '@/lib/firebaseClient';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeAuthListener();
  }, []);

  return <>{children}</>;
} 