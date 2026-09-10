// Force dynamic rendering for auth pages — Clerk requires
// the publishableKey at render time which isn't available during static builds.
export const dynamic = 'force-dynamic';

export default function SignInLayout({ children }: { children: React.ReactNode }) {
  return children;
}
