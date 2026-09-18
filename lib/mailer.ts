import nodemailer from "nodemailer";
import { Resend } from "resend";
import { EventEmailPayload, generateNewEventEmailHtml } from "./email-templates/newEventTemplate";
import {
  RegistrationEmailPayload,
  generateRegistrationConfirmationEmailHtml,
} from "./email-templates/registrationConfirmationTemplate";

/**
 * Returns an initialized Resend client if RESEND_API_KEY is configured
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

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
 * Helper to get the sender address depending on provider
 */
export function getSenderAddress(): string {
  if (process.env.RESEND_API_KEY) {
    return (
      process.env.EMAIL_FROM ||
      process.env.RESEND_FROM ||
      "Coding Junction <onboarding@resend.dev>"
    );
  }
  return process.env.SMTP_FROM || `"Coding Junction" <${process.env.SMTP_USER || "events@coding-junction.in"}>`;
}

/**
 * Verifies if the email provider (Resend or SMTP) is functional
 */
export async function verifySmtpConnection(): Promise<{ ok: boolean; message: string }> {
  // Check Resend first
  if (process.env.RESEND_API_KEY) {
    if (process.env.RESEND_API_KEY.startsWith("re_")) {
      return { ok: true, message: "Resend API key configured and ready." };
    }
    return { ok: false, message: "RESEND_API_KEY appears invalid (must start with re_)." };
  }

  // Fallback to Nodemailer SMTP
  const transporter = getMailerTransporter();
  if (!transporter) {
    return {
      ok: false,
      message: "Neither RESEND_API_KEY nor (SMTP_USER / SMTP_PASS) is configured.",
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
  const fromAddress = getSenderAddress();
  const subject = `🚀 New Event: ${event.title} | Coding Junction`;

  let sentCount = 0;
  const errors: string[] = [];

  // Provider 1: Resend
  const resend = getResendClient();
  if (resend) {
    const BATCH_SIZE = 50;
    const fromClean = fromAddress.includes("<")
      ? fromAddress.split("<")[1].replace(">", "").trim()
      : fromAddress;

    for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
      const chunk = validEmails.slice(i, i + BATCH_SIZE);
      try {
        const { error } = await resend.emails.send({
          from: fromAddress,
          to: [fromClean],
          bcc: chunk,
          subject,
          html: htmlContent,
          text: textContent,
        });

        if (error) {
          errors.push(`Resend Batch ${i / BATCH_SIZE + 1} failed: ${error.message}`);
        } else {
          sentCount += chunk.length;
        }
      } catch (err: any) {
        errors.push(`Resend Batch ${i / BATCH_SIZE + 1} failed: ${err?.message || String(err)}`);
      }
    }

    return { sentCount, totalRecipients: validEmails.length, errors };
  }

  // Provider 2: Nodemailer SMTP
  const transporter = getMailerTransporter();
  if (!transporter) {
    throw new Error(
      "Cannot send email: Neither RESEND_API_KEY nor SMTP credentials (SMTP_USER / SMTP_PASS) are configured."
    );
  }

  const BATCH_SIZE = 45;
  for (let i = 0; i < validEmails.length; i += BATCH_SIZE) {
    const chunk = validEmails.slice(i, i + BATCH_SIZE);
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: process.env.SMTP_USER,
        bcc: chunk,
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

/**
 * Sends a personal registration confirmation email with Ticket ID and pass download instructions
 */
export async function sendRegistrationConfirmationEmail(
  payload: RegistrationEmailPayload
): Promise<{ success: boolean; error?: string }> {
  const { recipientEmail, attendeeName, eventTitle, ticketId } = payload;
  if (!recipientEmail || !recipientEmail.includes("@")) {
    return { success: false, error: "Invalid recipient email address." };
  }

  const htmlContent = generateRegistrationConfirmationEmailHtml(payload);
  const textContent = `Hi ${attendeeName},\n\nYour registration for ${eventTitle} has been confirmed!\nTicket ID: ${ticketId}\n\nTo download your Event Pass, visit your Coding Junction Dashboard: https://coding-junction.in/Dashboard\n\nCoding Junction Team`;
  const fromAddress = getSenderAddress();
  const subject = `🎟️ Registration Confirmed: ${eventTitle} | Ticket ID: ${ticketId}`;

  // Provider 1: Resend
  const resend = getResendClient();
  if (resend) {
    try {
      const { error } = await resend.emails.send({
        from: fromAddress,
        to: recipientEmail,
        subject,
        html: htmlContent,
        text: textContent,
      });

      if (error) {
        console.error(`[Mailer:Resend] Failed to send registration email to ${recipientEmail}:`, error);
        return { success: false, error: error.message };
      }

      console.log(`[Mailer:Resend] Registration email sent successfully to ${recipientEmail} (Ticket: ${ticketId})`);
      return { success: true };
    } catch (err: any) {
      console.error(`[Mailer:Resend] Exception sending to ${recipientEmail}:`, err);
      return { success: false, error: err?.message || String(err) };
    }
  }

  // Provider 2: Nodemailer SMTP
  const transporter = getMailerTransporter();
  if (transporter) {
    try {
      await transporter.sendMail({
        from: fromAddress,
        to: recipientEmail,
        subject,
        html: htmlContent,
        text: textContent,
      });
      console.log(`[Mailer:SMTP] Registration email sent successfully to ${recipientEmail} (Ticket: ${ticketId})`);
      return { success: true };
    } catch (err: any) {
      console.error(`[Mailer:SMTP] Failed to send registration email to ${recipientEmail}:`, err);
      return { success: false, error: err.message || String(err) };
    }
  }

  console.warn("[Mailer] Neither RESEND_API_KEY nor SMTP credentials configured. Skipping confirmation email.");
  return { success: false, error: "No email service configured (RESEND_API_KEY or SMTP_USER/SMTP_PASS)." };
}
