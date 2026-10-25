import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    const fromAddress = process.env.EMAIL_FROM || "Coding Junction <noreply@coding-junction.in>";

    // Send notification to the CJ team
    await resend.emails.send({
      from: fromAddress,
      to: "ranadebsaha@coding-junction.in",
      replyTo: email,
      subject: `[Contact Form] ${subject}`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #14b8a6 100%); padding: 24px 32px;">
            <h2 style="margin: 0; font-size: 20px; color: white;">New Contact Form Submission</h2>
          </div>
          <div style="padding: 24px 32px;">
            <p style="font-size: 14px; color: #94a3b8; margin-bottom: 4px;">From</p>
            <p style="font-size: 15px; color: #e2e8f0; margin-top: 0; margin-bottom: 16px;">${name} &lt;${email}&gt;</p>
            <p style="font-size: 14px; color: #94a3b8; margin-bottom: 4px;">Subject</p>
            <p style="font-size: 15px; color: #e2e8f0; margin-top: 0; margin-bottom: 16px;">${subject}</p>
            <p style="font-size: 14px; color: #94a3b8; margin-bottom: 4px;">Message</p>
            <div style="font-size: 15px; color: #e2e8f0; margin-top: 0; padding: 16px; background: rgba(255,255,255,0.05); border-radius: 8px; white-space: pre-wrap; line-height: 1.6;">${message}</div>
          </div>
        </div>
      `,
    });

    // Send confirmation to the sender
    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: `We received your message — Coding Junction`,
      html: `
        <div style="font-family: 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0f; color: #e2e8f0; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 32px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px; color: white;">Thanks for reaching out! 💬</h1>
          </div>
          <div style="padding: 24px 32px;">
            <p style="font-size: 15px; line-height: 1.7; color: #cbd5e1;">
              Hi ${name},<br/><br/>
              We've received your message and will get back to you within 24–48 hours.<br/><br/>
              In the meantime, feel free to explore our <a href="https://coding-junction.in" style="color: #818cf8;">website</a> or follow us on social media!
            </p>
            <p style="font-size: 12px; color: #64748b; margin-top: 24px; text-align: center;">
              Coding Junction — UIT Burdwan
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to send message." },
      { status: 500 }
    );
  }
}
