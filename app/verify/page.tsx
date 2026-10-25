import type { Metadata } from "next";
import { Suspense } from "react";
import VerifyClient from "@/components/verify/VerifyClient";

export const metadata: Metadata = {
  title: "Verify Certificate | Official Credential Ledger",
  description:
    "Verify official certificates, awards, and event credentials issued by Coding Junction, the official tech community of University Institute of Technology (UIT), Burdwan.",
  openGraph: {
    title: "Verify Certificate | Coding Junction",
    description:
      "Verify official certificates, awards, and event credentials issued by Coding Junction, UIT Burdwan.",
  },
};

export default function VerifyPage() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-10 h-10 border-3 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        }
      >
        <VerifyClient />
      </Suspense>
    </main>
  );
}
