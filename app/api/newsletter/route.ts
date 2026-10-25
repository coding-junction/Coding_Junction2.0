import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export const dynamic = "force-dynamic";

const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
};

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json(
        { error: "A valid email address is required." },
        { status: 400 }
      );
    }

    const resend = getResendClient();

    // If Resend is configured, send the welcome email
    if (resend) {
      const fromAddress = process.env.EMAIL_FROM || "Coding Junction <noreply@coding-junction.in>";

      await resend.emails.send({
        from: fromAddress,
        to: email,
        subject: "Welcome to Coding Junction! 🚀",
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%); padding: 40px 32px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 800; color: white;">Welcome to Coding Junction! 🎉</h1>
              <p style="margin: 12px 0 0; font-size: 14px; color: rgba(255,255,255,0.85);">You're now part of our tech community</p>
            </div>
            <div style="padding: 32px;">
              <p style="font-size: 15px; line-height: 1.7; color: #cbd5e1;">
                Thank you for subscribing to the Coding Junction newsletter! You'll receive updates about:
              </p>
              <ul style="font-size: 14px; line-height: 2; color: #94a3b8; padding-left: 20px;">
                <li>🎯 Upcoming events, hackathons & workshops</li>
                <li>📝 New blog posts & technical articles</li>
                <li>🏆 Project showcases & achievements</li>
                <li>🤝 Community news & announcements</li>
              </ul>
              <div style="margin-top: 24px; text-align: center;">
                <a href="https://coding-junction.in" style="display: inline-block; padding: 12px 32px; background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; text-decoration: none; border-radius: 12px; font-size: 14px; font-weight: 600;">
                  Visit Our Website →
                </a>
              </div>
              <p style="font-size: 12px; color: #64748b; margin-top: 32px; text-align: center;">
                Coding Junction — UIT Burdwan • <a href="https://coding-junction.in" style="color: #818cf8;">coding-junction.in</a>
              </p>
            </div>
          </div>
        `,
      });
    } else {
      console.warn("RESEND_API_KEY is not configured. Skipping welcome email.");
    }

    // Optionally log to Google Sheets webhook
    if (process.env.GOOGLE_SHEETS_WEBHOOK_URL) {
      fetch(process.env.GOOGLE_SHEETS_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "newsletter_subscription",
          email,
          subscribedAt: new Date().toISOString(),
        }),
      }).catch(() => {
        // Non-critical, ignore errors
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter subscription error:", error);
    return NextResponse.json(
      { error: "Failed to subscribe. Please try again later." },
      { status: 500 }
    );
  }
}
