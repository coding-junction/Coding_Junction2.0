"use client";
import { ClerkProvider, SignedIn, SignedOut, SignIn, SignInButton, UserButton } from '@clerk/nextjs';
import { DashboardMain } from '../Dashboard/page';
import { auth, currentUser } from '@clerk/nextjs/server'
import { useEffect } from 'react';
import { Router } from 'next/router';

export default function User() {

  return (
<ClerkProvider>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
      {/* <UserButton /> */}
      <DashboardMain/>
    </SignedIn>
    </ClerkProvider>
    
  );
}
