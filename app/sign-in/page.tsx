"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { SignedIn, SignedOut, SignIn, useAuth } from '@clerk/nextjs';

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace('/Dashboard');
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignIn routing="hash" fallbackRedirectUrl="/Dashboard" forceRedirectUrl="/Dashboard" />
        </div>
      </SignedOut>
      <SignedIn>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground animate-pulse text-sm">Redirecting to Dashboard...</p>
        </div>
      </SignedIn>
    </>
  );
}
