"use client";
import { SignedIn, SignedOut, SignIn } from '@clerk/nextjs';
import DashboardMain from '../Dashboard/page';

export default function SignInPage() {
  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignIn routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
        <DashboardMain />
      </SignedIn>
    </>
  );
}
