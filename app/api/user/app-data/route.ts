import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase: any = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase credentials not configured in environment." },
        { status: 503 }
      );
    }

    const primaryEmail = (
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      ""
    ).toLowerCase().trim();

    if (!primaryEmail) {
      return NextResponse.json({ error: "User has no email address." }, { status: 400 });
    }

    // Query 'public.user' by email
    const { data: dbUser, error: queryError } = await supabase
      .from("user")
      .select("*")
      .eq("email", primaryEmail)
      .maybeSingle();

    if (queryError) {
      console.error("[App-Data] Error querying user by email:", queryError);
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, profile: dbUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch app data" }, { status: 500 });
  }
}
