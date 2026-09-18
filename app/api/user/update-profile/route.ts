import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized: Session required." }, { status: 401 });
    }

    const primaryEmail = (
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      ""
    ).toLowerCase().trim();

    if (!primaryEmail) {
      return NextResponse.json({ error: "No email address found on account." }, { status: 400 });
    }

    const supabase: any = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ error: "Supabase service not configured." }, { status: 503 });
    }

    const body = await req.json();
    const {
      full_name,
      college_name,
      department,
      roll_no,
      batch,
      cgpa,
      year,
      semester,
      favorite_subjects,
      is_verified,
      is_identity_verified,
      verification_status,
      id_card_path,
      verification_document_type,
    } = body;

    // 1. Check if user exists in 'public.user'
    const { data: existingUser, error: queryError } = await supabase
      .from("user")
      .select("*")
      .eq("email", primaryEmail)
      .maybeSingle();

    if (queryError) {
      console.error("[Update-Profile] Query error:", queryError);
      return NextResponse.json({ error: queryError.message }, { status: 500 });
    }

    const updatePayload: Record<string, any> = {};
    if (full_name !== undefined) updatePayload.full_name = full_name?.trim();
    if (college_name !== undefined) updatePayload.college_name = college_name?.trim();
    if (department !== undefined) updatePayload.department = department?.trim();
    if (roll_no !== undefined) updatePayload.roll_no = roll_no?.trim();
    if (batch !== undefined) updatePayload.batch = batch?.trim();
    if (cgpa !== undefined) updatePayload.cgpa = cgpa ? Number(cgpa) : null;
    if (year !== undefined) updatePayload.year = year ? Number(year) : null;
    if (semester !== undefined) updatePayload.semester = semester ? Number(semester) : null;
    if (favorite_subjects !== undefined) updatePayload.favorite_subjects = favorite_subjects?.trim();
    if (is_verified !== undefined) updatePayload.is_verified = Boolean(is_verified);
    if (is_identity_verified !== undefined) updatePayload.is_identity_verified = Boolean(is_identity_verified);
    if (verification_status !== undefined) updatePayload.verification_status = verification_status;
    if (id_card_path !== undefined) updatePayload.id_card_path = id_card_path;
    if (verification_document_type !== undefined) updatePayload.verification_document_type = verification_document_type;

    if (existingUser) {
      const { data: updated, error: updateError } = await supabase
        .from("user")
        .update(updatePayload)
        .eq("id", existingUser.id)
        .select("*")
        .single();

      if (updateError) {
        console.error("[Update-Profile] Update error:", updateError);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Profile updated and synchronized with mobile app.",
        profile: updated,
      });
    } else {
      // Create new user in 'public.user'
      const { data: inserted, error: insertError } = await supabase
        .from("user")
        .insert({
          email: primaryEmail,
          full_name: full_name?.trim() || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Community Member",
          is_active: true,
          created_at: new Date().toISOString(),
          ...updatePayload,
        })
        .select("*")
        .single();

      if (insertError) {
        console.error("[Update-Profile] Insert error:", insertError);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        message: "Profile created and synchronized with mobile app.",
        profile: inserted,
      });
    }
  } catch (err: any) {
    console.error("[Update-Profile] Unexpected exception:", err);
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 });
  }
}
