import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { sanity } from "@/lib/sanity";

export const dynamic = "force-dynamic";

/**
 * GET & POST /api/events/check-in
 * Scanned at venue gate by club organizers to physically check-in an attendee.
 * Automatically updates Clerk user metadata (attendedEventIds) and unlocks their certificate.
 */
export async function GET(req: NextRequest) {
  return handleCheckIn(req);
}

export async function POST(req: NextRequest) {
  return handleCheckIn(req);
}

async function handleCheckIn(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  let userId = searchParams.get("userId");
  let eventId = searchParams.get("eventId");
  let ticketId = searchParams.get("ticketId") || "CJ-PASS";

  // If POST with JSON body, extract from body if missing from query
  if (req.method === "POST") {
    try {
      const body = await req.json();
      if (body.userId) userId = body.userId;
      if (body.eventId) eventId = body.eventId;
      if (body.ticketId) ticketId = body.ticketId;
    } catch {
      // Use query params fallback
    }
  }

  const isHtmlRequest =
    req.headers.get("accept")?.includes("text/html") ||
    req.headers.get("sec-fetch-dest") === "document";

  if (!userId || !eventId) {
    if (isHtmlRequest) {
      return new NextResponse(
        renderHtmlResponse({
          success: false,
          title: "Invalid Check-in Pass",
          message: "Missing attendee or event identification in the scanned pass.",
        }),
        { headers: { "Content-Type": "text/html" }, status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Missing userId or eventId" },
      { status: 400 }
    );
  }

  try {
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      throw new Error("CLERK_SECRET_KEY is not configured.");
    }

    const clerkClient = createClerkClient({ secretKey: clerkSecretKey });

    // 1. Fetch user from Clerk
    const clerkUser = await clerkClient.users.getUser(userId);
    const userName =
      clerkUser.fullName ||
      `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
      "Attendee";

    // 2. Resolve Event or Certificate Title from Sanity
    let eventTitle = "Coding Junction Event";
    try {
      const sanityDoc = await sanity.fetch(
        `*[_id == $eventId][0]{ title }`,
        { eventId }
      );
      if (sanityDoc?.title) {
        eventTitle = sanityDoc.title;
      }
    } catch {
      // Fallback
    }

    // 3. Update attendedEventIds in user metadata
    const currentAttended: string[] =
      (clerkUser.unsafeMetadata?.attendedEventIds as string[]) || [];

    const isAlreadyAttended = currentAttended.includes(eventId);
    const updatedAttended = isAlreadyAttended
      ? currentAttended
      : [...currentAttended, eventId];

    if (!isAlreadyAttended) {
      await clerkClient.users.updateUser(userId, {
        unsafeMetadata: {
          ...clerkUser.unsafeMetadata,
          attendedEventIds: updatedAttended,
          lastCheckInAt: new Date().toISOString(),
        },
      });
    }

    // 4. Return response (HTML for phone camera scans, JSON for in-app scanner)
    if (isHtmlRequest) {
      return new NextResponse(
        renderHtmlResponse({
          success: true,
          title: isAlreadyAttended
            ? "Already Checked In"
            : "Physical Attendance Verified!",
          attendeeName: userName,
          eventTitle,
          ticketId,
          message: isAlreadyAttended
            ? "This attendee pass was previously verified. The certificate remains unlocked."
            : "Attendee has been verified at the venue gate. Their certificate is now automatically unlocked!",
        }),
        { headers: { "Content-Type": "text/html" } }
      );
    }

    return NextResponse.json({
      success: true,
      verified: true,
      alreadyVerified: isAlreadyAttended,
      attendee: userName,
      event: eventTitle,
      ticketId,
      message: "Physical attendance verified and certificate unlocked automatically.",
    });
  } catch (err: any) {
    console.error("Check-in verification failed:", err);

    if (isHtmlRequest) {
      return new NextResponse(
        renderHtmlResponse({
          success: false,
          title: "Verification Failed",
          message:
            err?.message ||
            "Unable to process check-in. Please ensure attendee ID and network connection are valid.",
        }),
        { headers: { "Content-Type": "text/html" }, status: 500 }
      );
    }

    return NextResponse.json(
      { success: false, error: err?.message || "Check-in failed" },
      { status: 500 }
    );
  }
}

function renderHtmlResponse(data: {
  success: boolean;
  title: string;
  attendeeName?: string;
  eventTitle?: string;
  ticketId?: string;
  message: string;
}) {
  const accentColor = data.success ? "#10b981" : "#ef4444";
  const icon = data.success ? "✓" : "✕";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${data.title} | Coding Junction</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #090a10;
      color: #ffffff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .card {
      background: #12131d;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      max-width: 440px;
      width: 100%;
      padding: 2rem;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    }
    .badge-icon {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: ${accentColor}20;
      border: 2px solid ${accentColor}50;
      color: ${accentColor};
      font-size: 32px;
      font-weight: bold;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.25rem;
    }
    h1 {
      font-size: 1.35rem;
      font-weight: 800;
      margin-bottom: 0.5rem;
      color: #fff;
    }
    .info-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 16px;
      padding: 1.25rem;
      margin: 1.5rem 0;
      text-align: left;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      padding: 0.35rem 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .info-row:last-child { border-bottom: none; }
    .label { color: #94a3b8; font-family: monospace; font-size: 0.75rem; text-transform: uppercase; }
    .val { color: #f8fafc; font-weight: 600; text-align: right; }
    .status-badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 999px;
      background: ${accentColor}18;
      border: 1px solid ${accentColor}40;
      color: ${accentColor};
      font-size: 0.75rem;
      font-weight: 700;
      font-family: monospace;
      margin-bottom: 1rem;
    }
    .msg {
      color: #94a3b8;
      font-size: 0.825rem;
      line-height: 1.5;
    }
    .footer-note {
      margin-top: 1.5rem;
      padding-top: 1.25rem;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      color: #64748b;
      font-size: 0.75rem;
      font-family: monospace;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge-icon">${icon}</div>
    <span class="status-badge">${data.success ? "CERTIFICATE UNLOCKED" : "VERIFICATION ERROR"}</span>
    <h1>${data.title}</h1>

    ${
      data.attendeeName
        ? `<div class="info-box">
        <div class="info-row">
          <span class="label">Attendee</span>
          <span class="val">${data.attendeeName}</span>
        </div>
        <div class="info-row">
          <span class="label">Event</span>
          <span class="val">${data.eventTitle || "Session"}</span>
        </div>
        <div class="info-row">
          <span class="label">Ticket ID</span>
          <span class="val" style="color: #818cf8; font-family: monospace;">${data.ticketId}</span>
        </div>
        <div class="info-row">
          <span class="label">Status</span>
          <span class="val" style="color: #10b981;">Physical Entry Logged</span>
        </div>
      </div>`
        : ""
    }

    <p class="msg">${data.message}</p>

    <div class="footer-note">
      Coding Junction Entrance Verification Engine
    </div>
  </div>
</body>
</html>`;
}
