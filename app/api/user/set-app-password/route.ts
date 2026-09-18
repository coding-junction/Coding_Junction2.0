import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { password } = await req.json();
    if (!password || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const primaryEmail = (
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      ""
    ).toLowerCase().trim();

    if (!primaryEmail) {
      return NextResponse.json({ error: "No email address found." }, { status: 400 });
    }

    const supabase: any = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase service not configured." }, { status: 503 });
    }

    // Hash with standard bcrypt (matching mobile app $2b$12$)
    const salt = bcrypt.genSaltSync(12);
    const hashedPassword = bcrypt.hashSync(password, salt);

    // Update in 'public.user'
    const { data: existingUser } = await supabase
      .from("user")
      .select("id")
      .eq("email", primaryEmail)
      .maybeSingle();

    if (existingUser) {
      const { error: updErr } = await supabase
        .from("user")
        .update({ hashed_password: hashedPassword })
        .eq("id", existingUser.id);

      if (updErr) {
        return NextResponse.json({ error: updErr.message }, { status: 500 });
      }
    } else {
      const { error: insErr } = await supabase
        .from("user")
        .insert({
          email: primaryEmail,
          full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Member",
          hashed_password: hashedPassword,
          is_active: true,
          is_verified: false,
          created_at: new Date().toISOString(),
        });

      if (insErr) {
        return NextResponse.json({ error: insErr.message }, { status: 500 });
      }
    }

    return NextResponse.json({
      success: true,
      message: "Mobile App password configured! You can now log into the Android/iOS app with this email and password.",
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to set app password." }, { status: 500 });
  }
}
