"use client";

import { auth } from '@/lib/firebaseClient';
import { clearUserSession } from '@/lib/firebaseClient';
import { Button } from "@/components/ui/button";

export function SignOut() {
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      clearUserSession();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <Button 
      onClick={handleSignOut}
      variant="ghost"
    >
      Sign Out
    </Button>
  );
} 