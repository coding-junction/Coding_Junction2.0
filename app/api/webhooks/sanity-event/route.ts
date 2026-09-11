import { NextRequest, NextResponse } from "next/server";
import { createClerkClient } from "@clerk/backend";
import { sanity } from "@/lib/sanity";
import { broadcastEventEmail, verifySmtpConnection } from "@/lib/mailer";

// Force dynamic execution for API route
export const dynamic = "force-dynamic";

/**
 * GET /api/webhooks/sanity-event
 * Diagnostic endpoint to check webhook readiness and SMTP connection
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const isTest = searchParams.get("test") === "true";
  const testRecipient = searchParams.get("to") || process.env.SMTP_USER;

  const smtpCheck = await verifySmtpConnection();

  if (isTest && testRecipient) {
    if (!smtpCheck.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot run test: ${smtpCheck.message}`,
        },
        { status: 500 }
      );
    }

    try {
      const testResult = await broadcastEventEmail({
        recipients: [testRecipient],
        event: {
          title: "🧪 Test Announcement: Webhook & SMTP Verification",
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          location: "Coding Junction Virtual Hub",
          description:
            "This is a test notification confirming that Sanity Webhook -> Next.js -> Gmail SMTP -> Clerk User broadcast pipeline is fully operational!",
          registerLink: "https://coding-junction.in/Dashboard",
        },
      });

      return NextResponse.json({
        success: true,
        message: `Test email dispatched to ${testRecipient}`,
        result: testResult,
      });
    } catch (err: any) {
      return NextResponse.json(
        {
          success: false,
          error: `Test email failed: ${err.message || String(err)}`,
        },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({
    status: "online",
    endpoint: "/api/webhooks/sanity-event",
    smtp: smtpCheck,
    instructions:
      "Configure a webhook in Sanity Management Dashboard (sanity.io/manage) pointing POST requests to this URL when _type == 'event'.",
  });
}

/**
 * POST /api/webhooks/sanity-event
 * Triggered automatically by Sanity whenever a new event document is published or created
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Optional Secret Authentication
    const webhookSecret = process.env.SANITY_WEBHOOK_SECRET;
    if (webhookSecret) {
      const incomingSecret =
        req.headers.get("sanity-webhook-secret") ||
        req.headers.get("authorization")?.replace("Bearer ", "");
      if (incomingSecret !== webhookSecret) {
        return NextResponse.json(
          { error: "Unauthorized: Invalid or missing webhook secret" },
          { status: 401 }
        );
      }
    }

    // 2. Parse Incoming Payload
    const body = await req.json().catch(() => ({}));
    const eventId = body._id || body.id;
    const documentType = body._type || body.type;

    // Ensure it's an event document
    if (documentType && documentType !== "event") {
      return NextResponse.json(
        { message: `Ignored document type '${documentType}'. Only 'event' triggers emails.` },
        { status: 200 }
      );
    }

    // 3. Fetch Fresh, Resolved Event Data from Sanity
    let eventTitle = body.title;
    let eventDate = body.date;
    let eventLocation = body.location;
    let eventDescription = body.description;
    let eventRegisterLink = body.registerLink;
    let eventImageUrl =
      body.imageUrl || body.image?.asset?.url || body.images?.[0]?.asset?.url;

    // If payload only sent IDs or references, query Sanity directly for full details
    if (eventId) {
      try {
        const freshEvent = await sanity.fetch(
          `*[_id in [$id, "drafts." + $id]][0]{
            title,
            date,
            location,
            description,
            registerLink,
            "imageUrl": coalesce(image.asset->url, images[0].asset->url)
          }`,
          { id: eventId.replace(/^drafts\./, "") }
        );

        if (freshEvent) {
          eventTitle = freshEvent.title || eventTitle;
          eventDate = freshEvent.date || eventDate;
          eventLocation = freshEvent.location || eventLocation;
          eventDescription = freshEvent.description || eventDescription;
          eventRegisterLink = freshEvent.registerLink || eventRegisterLink;
          eventImageUrl = freshEvent.imageUrl || eventImageUrl;
        }
      } catch (sanityErr) {
        console.warn("[Sanity Webhook] Could not fetch fresh document from Sanity, using payload data:", sanityErr);
      }
    }

    if (!eventTitle) {
      return NextResponse.json(
        { error: "Invalid payload: Event title is missing." },
        { status: 400 }
      );
    }

    // 4. Retrieve All Registered Users from Clerk
    const clerkSecretKey = process.env.CLERK_SECRET_KEY;
    if (!clerkSecretKey) {
      return NextResponse.json(
        { error: "CLERK_SECRET_KEY is not configured in environment variables." },
        { status: 500 }
      );
    }

    const clerk = createClerkClient({ secretKey: clerkSecretKey });
    const memberEmails: string[] = [];

    let offset = 0;
    const limit = 100;
    while (true) {
      const userList = await clerk.users.getUserList({ limit, offset });
      for (const u of userList.data) {
        const primary = u.primaryEmailAddress?.emailAddress;
        if (primary) {
          memberEmails.push(primary);
        }
      }
      if (userList.data.length < limit || memberEmails.length >= userList.totalCount) {
        break;
      }
      offset += limit;
    }

    if (memberEmails.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No registered member emails found in Clerk directory.",
        sentCount: 0,
      });
    }

    // 5. Send Broadcast Email via Nodemailer Gmail SMTP
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://coding-junction.in";
    const broadcastResult = await broadcastEventEmail({
      recipients: memberEmails,
      event: {
        title: eventTitle,
        date: eventDate,
        location: eventLocation,
        description: eventDescription,
        imageUrl: eventImageUrl,
        registerLink: eventRegisterLink,
        siteUrl,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Event announcement dispatched for '${eventTitle}'`,
      stats: {
        sentCount: broadcastResult.sentCount,
        totalRecipients: broadcastResult.totalRecipients,
        errors: broadcastResult.errors,
      },
    });
  } catch (error: any) {
    console.error("[Sanity Webhook Error]:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error occurred while processing event webhook.",
      },
      { status: 500 }
    );
  }
}
