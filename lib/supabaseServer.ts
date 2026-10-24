import { createClient } from "@supabase/supabase-js";

let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

// Server-side client with admin privileges
// Bypasses RLS so Next.js API routes can query and link user data securely
export function getSupabaseAdmin() {
    if (!_supabaseAdmin) {
        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!url || !key) {
            throw new Error("Supabase URL or Service Role Key is missing from environment variables.");
        }
        _supabaseAdmin = createClient(url, key, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });
    }
    return _supabaseAdmin;
}

export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
    get(_target, prop) {
        const client = getSupabaseAdmin() as any;
        const value = client[prop];
        if (typeof value === "function") {
            return value.bind(client);
        }
        return value;
    },
});

