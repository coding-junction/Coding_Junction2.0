import { NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { getSupabaseAdmin } from "@/lib/supabaseServer";
import { sendRegistrationConfirmationEmail } from "@/lib/mailer";

export const dynamic = "force-dynamic";

function generateTicketId(eventId: string, userId?: string): string {
  const cleanEvent = eventId.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase() || "EVT";
  const cleanUser = (userId || "").replace("user_", "").slice(-4).toUpperCase() || "PASS";
  return `CJ-EVT-${cleanEvent}-${cleanUser}`;
}

export async function POST(req: Request) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const {
      eventId,
      eventTitle,
      eventDate,
      eventLocation,
      fullName,
      email,
      phone,
      collegeName,
      university,
      department,
      yearOfStudy,
      rollNumber,
      githubOrLinkedIn,
      referralSource,
    } = body;

    if (!eventId || !eventTitle) {
      return NextResponse.json(
        { error: "Event ID and Event Title are required." },
        { status: 400 }
      );
    }

    const finalFullName = (fullName || user.fullName || `${user.firstName || ""} ${user.lastName || ""}`).trim();
    const finalEmail = (email || user.primaryEmailAddress?.emailAddress || "").trim().toLowerCase();

    if (!finalFullName || !finalEmail) {
      return NextResponse.json(
        { error: "Full Name and a verified Email are required to register." },
        { status: 400 }
      );
    }

    // Check College Verification status from Clerk metadata
    const collegeMeta = user.unsafeMetadata?.collegeVerification as {
      isVerified?: boolean;
      collegeName?: string;
      university?: string;
      aicteId?: string;
    } | undefined;

    const isCollegeVerified = Boolean(collegeMeta?.isVerified);
    let finalCollege = (collegeName || collegeMeta?.collegeName || "").trim();

    const supabase: any = getSupabaseAdmin();
    let userId: string | null = null;
    let appUser: any = null;

    if (supabase && finalEmail) {
      try {
        // Query the actual Supabase mobile app table 'public.user'
        const { data: foundUser } = await supabase
          .from("user")
          .select("id, full_name, email, phone, college_name, department, roll_no")
          .eq("email", finalEmail)
          .maybeSingle();

        if (foundUser) {
          appUser = foundUser;
          userId = foundUser.id;
          if (!finalCollege && foundUser.college_name) finalCollege = foundUser.college_name.trim();
        } else {
          // If student doesn't exist in 'public.user' yet, create user record so they have an ID
          const { data: createdUser } = await supabase
            .from("user")
            .insert({
              email: finalEmail,
              full_name: finalFullName,
              phone: phone || null,
              college_name: finalCollege || null,
              department: department || null,
              roll_no: rollNumber || null,
            })
            .select("id")
            .maybeSingle();

          if (createdUser) {
            userId = createdUser.id;
          }
        }
      } catch (err) {
        console.warn("[Register] Notice querying Supabase user:", err);
      }
    }

    const ticketId = generateTicketId(eventId, user.id);

    // Save minimal normalized record to Supabase: ONLY IDs and status
    if (supabase) {
      try {
        await supabase
          .from("event_registrations")
          .upsert(
            {
              event_id: eventId,
              user_id: userId,
              clerk_id: user.id,
              ticket_id: ticketId,
              status: "confirmed",
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            },
            { onConflict: "event_id,clerk_id" }
          );
      } catch (dbEx: any) {
        console.warn("[Register] Notice persisting to Supabase event_registrations:", dbEx?.message);
      }
    }

    // Send registration confirmation email with pass download instructions
    let emailSent = false;
    try {
      const emailResult = await sendRegistrationConfirmationEmail({
        recipientEmail: finalEmail,
        attendeeName: finalFullName,
        eventTitle,
        eventDate,
        eventLocation,
        ticketId,
        collegeName: finalCollege,
        isCollegeVerified,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://coding-junction.in",
      });
      emailSent = emailResult.success;
    } catch (mailErr) {
      console.warn("[Registration] Notice sending confirmation email:", mailErr);
    }

    // Non-blocking sync to Google Sheets webhook (if configured)
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      const rawPhone = (phone || appUser?.phone || "").trim();
      const safePhone = rawPhone.startsWith("+") || rawPhone.startsWith("=") ? `'${rawPhone}` : rawPhone;

      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          eventId,
          eventTitle,
          eventDate: eventDate || "",
          eventLocation: eventLocation || "",
          ticketId,
          fullName: finalFullName,
          email: finalEmail,
          phone: safePhone,
          collegeName: finalCollege,
          university: university || "",
          department: department || appUser?.department || "",
          yearOfStudy: yearOfStudy || "",
          rollNumber: rollNumber || appUser?.roll_no || "",
          githubOrLinkedIn: githubOrLinkedIn || "",
          referralSource: referralSource || "",
          status: "CONFIRMED",
          timestamp: new Date().toISOString(),
        }),
      }).catch((sheetErr) => {
        console.warn("[Registration] Google Sheets webhook notice:", sheetErr);
      });
    }

    // Return the confirmed registration data
    return NextResponse.json({
      success: true,
      ticketId,
      emailSent,
      registration: {
        ticketId,
        eventId,
        eventTitle,
        eventDate,
        eventLocation,
        fullName: finalFullName,
        email: finalEmail,
        phone,
        collegeName: finalCollege,
        isCollegeVerified,
        department,
        yearOfStudy,
        rollNumber,
        status: "confirmed",
        emailSent,
      },
    });
  } catch (error: any) {
    console.error("Event registration API error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error during registration." },
      { status: 500 }
    );
  }
}
