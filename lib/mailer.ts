import nodemailer from "nodemailer";
import { EventEmailPayload, generateNewEventEmailHtml } from "./email-templates/newEventTemplate";

/**
 * Creates and returns a Nodemailer transporter configured for Gmail SMTP
 */
export function getMailerTransporter() {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass: pass.replace(/\s+/g, ""), // Remove any spaces from Google App Password
    },
  });
}

/**
 * Verifies if the SMTP credentials are functional
 */
export async function verifySmtpConnection(): Promise<{ ok: boolean; message: string }> {
  const transporter = getMailerTransporter();
  if (!transporter) {
    return {
      ok: false,
      message: "SMTP_USER or SMTP_PASS is missing in environment variables.",
    };
  }

  try {
    await transporter.verify();
    return { ok: true, message: "SMTP connection verified successfully." };
  } catch (error: any) {
    return { ok: false, message: error.message || "Failed to connect to SMTP server." };
  }
}

export interface BroadcastOptions {
  recipients: string[];
  event: EventEmailPayload;
}

/**
 * Broadcasts the new event announcement email to a list of recipients
 */
export async function broadcastEventEmail({
  recipients,
  event,
}: BroadcastOptions): Promise<{
  sentCount: number;
  totalRecipients: number;
  errors: string[];
}> {
  const transporter = getMailerTransporter();
  if (!transporter) {
    throw new Error(
      "Cannot send email: SMTP credentials (SMTP_USER / SMTP_PASS) are not configured."
    );
  }

  // Deduplicate and filter valid emails
  const validEmails = Array.from(
    new Set(
      recipients
        .map((e) => e?.trim().toLowerCase())
        .filter((e): e is string => Boolean(e && e.includes("@")))
    )
  );

  if (validEmails.length === 0) {
    return { sentCount: 0, totalRecipients: 0, errors: ["No valid recipient email addresses found."] };
  }

  const htmlContent = generateNewEventEmailHtml(event);
  const textContent = `New Event Announced: ${event.title}\nDate: ${event.date || "TBA"}\nLocation: ${event.location || "TBA"}\n\n${event.description || ""}\n\nRegister here: ${event.registerLink || "https://coding-junction.in/Events"}`;

  const fromAddress = process.env.SMTP_FROM || `"Coding Junction" <${process.env.SMTP_USER}>`;
  const subject = `🚀 New Event: ${event.title} | Coding Junction`;

  let sentCount = 0;
  const errors: string[] = [];

  // Gmail allows up to 500 recipients per day (or 2,000 for Google Workspace).
  // Sending with BCC in chunks of 45 avoids revealing user emails to each other and optimizes delivery.
  const BATCH_SIZE = 45;
  for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
    const chunk = validEmails.slice(i, i + BATCH_SIZE);
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: process.env.SMTP_USER, // Main 'to' recipient is club email
        bcc: chunk, // Private broadcast to members
        subject,
        html: htmlContent,
        text: textContent,
      });
      sentCount += chunk.length;
    } catch (err: any) {
      console.error(`[Mailer] Error sending email chunk ${i / BATCH_SIZE + 1}:`, err);
      errors.push(`Batch ${i / BATCH_SIZE + 1} failed: ${err.message || String(err)}`);
    }
  }

  return {
    sentCount,
    totalRecipients: validEmails.length,
    errors,
  };
}
