"use client";

import { auth } from '@/lib/firebaseClient';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { storeUserSession } from '@/lib/firebaseClient';

export function SignIn() {
  const handleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      storeUserSession(result.user);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    // ... your sign in button JSX
  );
} 