import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Creates an authenticated Supabase client for client-side components using Clerk's Supabase JWT.
 * 
 * Usage:
 * ```tsx
 * const { getToken } = useAuth();
 * const token = await getToken({ template: "supabase" });
 * const supabase = createClerkSupabaseClient(token);
 * const { data } = await supabase.from("profiles").select("*");
 * ```
 */
export function createClerkSupabaseClient(clerkToken?: string | null): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    console.warn("Supabase public credentials missing: check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY");
    return null;
  }

  return createClient(url, anonKey, {
    global: {
      headers: clerkToken
        ? {
            Authorization: `Bearer ${clerkToken}`,
          }
        : {},
    },
  });
}
