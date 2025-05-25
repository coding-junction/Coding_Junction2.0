"use client";
import { SignedIn, SignedOut, SignUp } from '@clerk/nextjs';
import DashboardMain from '../Dashboard/page';

export default function SignUpPage() {
  return (
    <>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <SignUp routing="hash" />
        </div>
      </SignedOut>
      <SignedIn>
        <DashboardMain />
      </SignedIn>
    </>
  );
}
