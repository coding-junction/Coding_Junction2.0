// Force dynamic rendering — Dashboard uses Clerk's useUser() which requires
// the publishableKey at render time (not available during static builds).
export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
