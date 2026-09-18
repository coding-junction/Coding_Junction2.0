import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(_req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Session required." }, { status: 401 });
    }

    // 1. Get user's email from Clerk
    const primaryEmailObj = user.emailAddresses.find(
      (e) => e.id === user.primaryEmailAddressId
    );

    const emailCandidate =
      primaryEmailObj?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      "";

    if (!emailCandidate) {
      return NextResponse.json({ error: "No email address found on account." }, { status: 400 });
    }

    const normalizedEmail = emailCandidate.trim().toLowerCase();

    const supabase: any = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase service not configured." }, { status: 503 });
    }

    // 2. Query 'public.user' strictly by UNIQUE email
    const { data: existingUser, error: queryError } = await supabase
      .from("user")
      .select("*")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (queryError) {
      console.error("[Sync-Supabase] Error querying user table by email:", queryError);
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    if (existingUser) {
      return NextResponse.json({
        success: true,
        profile: existingUser,
        status: "linked_existing_app_user",
      });
    }

    // 3. User does not exist in 'public.user': create a new row
    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Community Member";
    const { data: newUser, error: insertError } = await supabase
      .from("user")
      .insert({
        email: normalizedEmail,
        full_name: fullName,
        is_active: true,
        is_verified: false,
        created_at: new Date().toISOString(),
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("[Sync-Supabase] Error inserting new user:", insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile: newUser,
      status: "created_new_user",
    });
  } catch (err: any) {
    console.error("[Sync-Supabase] Unexpected exception:", err);
    return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
  }
}
