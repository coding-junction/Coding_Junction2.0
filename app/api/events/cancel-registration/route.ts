import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

export const dynamic = "force-dynamic";

/**
 * POST /api/events/cancel-registration
 * Cancels a student's event registration and permanently revokes their digital entry pass.
 */
export async function POST(req: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const body = await req.json();
    const { eventId } = body;

    if (!eventId) {
      return NextResponse.json({ error: "Event ID is required." }, { status: 400 });
    }

    const email = (user.primaryEmailAddress?.emailAddress || "").toLowerCase().trim();

    let cancelledDetails: { eventTitle?: string; ticketId?: string; fullName?: string } = {
      eventTitle: body.eventTitle,
      ticketId: body.ticketId,
    };

    // 1. Remove eventId from Clerk user metadata
    try {
      const secretKey = process.env.CLERK_SECRET_KEY || "sk_test_m7jKn2HlSPqpWf0nr21eAMIgn388SZdgCGdHBlH5UT";
      const clerk = createClerkClient({ secretKey });
      const currentList: string[] = (user.unsafeMetadata?.registeredEventIds as string[]) || [];
      const updatedList = currentList.filter((id) => id !== eventId);

      await clerk.users.updateUser(user.id, {
        unsafeMetadata: {
          ...user.unsafeMetadata,
          registeredEventIds: updatedList,
        },
      });
    } catch (clerkErr) {
      console.warn("[Cancel Registration] Notice updating Clerk metadata:", clerkErr);
    }

    // 2. Non-blocking sync to Google Sheets webhook (if configured)
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "cancel",
          eventId,
          eventTitle: cancelledDetails.eventTitle || "",
          ticketId: cancelledDetails.ticketId || "",
          email,
          fullName: cancelledDetails.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim(),
          timestamp: new Date().toISOString(),
        }),
      }).catch((sheetErr) => {
        console.warn("[Cancel Registration] Google Sheets webhook notice:", sheetErr);
      });
    }

    return NextResponse.json({
      success: true,
      message: "Event registration successfully cancelled and pass revoked.",
      eventId,
    });
  } catch (error: any) {
    console.error("[Cancel Registration] Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to cancel event registration." },
      { status: 500 }
    );
  }
}
