"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, SignIn, useAuth } from "@clerk/nextjs";
import { Sparkles, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SignInPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const [redirectUrl, setRedirectUrl] = useState("/Dashboard");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const redir = params.get("redirect_url");
      if (redir) {
        setRedirectUrl(redir);
      }
    }
  }, []);

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace(redirectUrl);
    }
  }, [isLoaded, isSignedIn, router, redirectUrl]);

  return (
    <>
      <SignedOut>
        <div className="flex flex-col items-center justify-center min-h-screen p-4 sm:p-6 bg-gradient-to-b from-background via-background/95 to-background">
          {/* Header Brand */}
          <div className="text-center mb-6 max-w-sm">
            <Link href="/" className="inline-flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg text-foreground dark:text-white">Coding Junction</span>
            </Link>
            <h1 className="text-2xl font-extrabold text-foreground dark:text-white tracking-tight">
              Welcome to Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Sign in to access your student dashboard, event passes, and certificates.
            </p>
          </div>

          {/* Unified Clerk Sign-In */}
          <div className="w-full flex justify-center">
            <SignIn
              routing="hash"
              fallbackRedirectUrl={redirectUrl}
              forceRedirectUrl={redirectUrl}
            />
          </div>

          {/* Seamless Sync Notice */}
          <div className="mt-5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Mobile app profiles &amp; event certificates sync automatically</span>
          </div>
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
