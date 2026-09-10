"use client";

import { usePathname } from "next/navigation";

/**
 * Wraps children and only renders them if the current route
 * is NOT one of the hidden routes (e.g. Dashboard, sign-in, sign-up).
 * Used in the root layout to conditionally hide the global NavBar and Footer.
 */
export default function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes where the global navbar + footer should be hidden
  const hiddenRoutes = ["/Dashboard", "/sign-in", "/sign-up"];
  const shouldHide = hiddenRoutes.some((route) => pathname?.startsWith(route));

  if (shouldHide) return null;

  return <>{children}</>;
}
