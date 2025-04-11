"use client";
import { ClerkProvider, SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import { DashboardMain } from '../Dashboard/page';

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
