import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";
import { getSupabaseAdmin } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

/**
 * GET /api/events/check-status?eventId=...&ticketId=...
 * Polled by the website Event Pass modal.
 * When an organizer scans the attendee's QR code in the Mobile App,
 * this endpoint immediately detects status = 'attended' and unlocks their certificate.
 */
export async function GET(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const ticketId = searchParams.get("ticketId");

    if (!eventId) {
      return NextResponse.json({ error: "Missing eventId parameter" }, { status: 400 });
    }

    const supabase: any = getSupabaseAdmin();
    if (!supabase) {
      return NextResponse.json({ attended: false });
    }

    let query = supabase
      .from("event_registrations")
      .select("status, checked_in_at, certificate_issued")
      .eq("event_id", eventId);

    if (ticketId) {
      query = query.eq("ticket_id", ticketId);
    } else {
      query = query.eq("clerk_id", user.id);
    }

    const { data, error } = await query.maybeSingle();

    if (error || !data) {
      return NextResponse.json({ attended: false });
    }

    const isAttended = data.status === "attended";

    // If attended in Supabase but not yet in Clerk metadata, sync it
    if (isAttended) {
      try {
        const secretKey = process.env.CLERK_SECRET_KEY || "sk_test_m7jKn2HlSPqpWf0nr21eAMIgn388SZdgCGdHBlH5UT";
        const clerk = createClerkClient({ secretKey });
        const attendedList: string[] = (user.unsafeMetadata?.attendedEventIds as string[]) || [];

        if (!attendedList.includes(eventId)) {
          const updated = Array.from(new Set([...attendedList, eventId]));
          await clerk.users.updateUser(user.id, {
            unsafeMetadata: {
              ...user.unsafeMetadata,
              attendedEventIds: updated,
            },
          });
        }
      } catch (clerkErr) {
        console.warn("[Check Status] Notice syncing Clerk metadata:", clerkErr);
      }
    }

    return NextResponse.json({
      attended: isAttended,
      status: data.status,
      checkedInAt: data.checked_in_at,
      certificateIssued: Boolean(data.certificate_issued),
    });
  } catch (err: any) {
    return NextResponse.json({ attended: false, error: err.message }, { status: 500 });
  }
}
