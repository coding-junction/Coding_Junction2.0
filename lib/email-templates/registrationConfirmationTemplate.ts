export interface RegistrationEmailPayload {
  attendeeName: string;
  recipientEmail: string;
  eventTitle: string;
  eventDate?: string;
  eventLocation?: string;
  ticketId: string;
  collegeName?: string;
  isCollegeVerified?: boolean;
  siteUrl?: string;
}

export function generateRegistrationConfirmationEmailHtml({
  attendeeName,
  eventTitle,
  eventDate,
  eventLocation,
  ticketId,
  collegeName,
  isCollegeVerified,
  siteUrl = "https://coding-junction.in",
}: RegistrationEmailPayload): string {
  const formattedDate = eventDate
    ? new Date(eventDate).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date to be announced";

  const passesUrl = `${siteUrl}/Dashboard`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Registration Confirmed: ${eventTitle}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0c0d14;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #ffffff;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #0c0d14;
      padding: 32px 16px;
      box-sizing: border-box;
    }
    .container {
      max-width: 580px;
      margin: 0 auto;
      background: #121422;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }
    .header {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .badge {
      display: inline-block;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.3);
      padding: 5px 14px;
      border-radius: 20px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #ffffff;
      margin-bottom: 12px;
    }
    .title {
      font-size: 24px;
      font-weight: 800;
      color: #ffffff;
      margin: 0 0 6px 0;
      line-height: 1.25;
    }
    .subtitle {
      font-size: 13px;
      color: rgba(255, 255, 255, 0.85);
      margin: 0;
    }
    .body {
      padding: 28px 24px;
    }
    .greeting {
      font-size: 16px;
      color: #e2e8f0;
      margin: 0 0 16px 0;
      line-height: 1.5;
    }
    .ticket-card {
      background: #181b2e;
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      padding: 20px;
      margin: 20px 0;
    }
    .ticket-header {
      border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
      padding-bottom: 14px;
      margin-bottom: 14px;
    }
    .ticket-label {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #94a3b8;
      margin: 0 0 4px 0;
      font-family: monospace;
    }
    .ticket-id {
      font-size: 20px;
      font-weight: 800;
      color: #818cf8;
      font-family: monospace;
      margin: 0;
      letter-spacing: 1.5px;
    }
    .info-grid {
      width: 100%;
      border-collapse: collapse;
    }
    .info-grid td {
      padding: 6px 0;
      vertical-align: top;
    }
    .info-label {
      font-size: 11px;
      color: #94a3b8;
      text-transform: uppercase;
      font-weight: 600;
    }
    .info-value {
      font-size: 13px;
      color: #f8fafc;
      font-weight: 600;
    }
    .instructions-box {
      background: rgba(99, 102, 241, 0.08);
      border-left: 3px solid #6366f1;
      border-radius: 8px;
      padding: 16px;
      margin: 24px 0;
    }
    .instructions-title {
      font-size: 13px;
      font-weight: 700;
      color: #a5b4fc;
      margin: 0 0 10px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .step-item {
      font-size: 13px;
      color: #cbd5e1;
      margin: 8px 0;
      line-height: 1.5;
    }
    .step-num {
      display: inline-block;
      width: 18px;
      height: 18px;
      background: #4f46e5;
      color: #ffffff;
      border-radius: 50%;
      text-align: center;
      line-height: 18px;
      font-size: 11px;
      font-weight: bold;
      margin-right: 6px;
    }
    .btn-container {
      text-align: center;
      margin: 28px 0 16px 0;
    }
    .btn-primary {
      display: inline-block;
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff !important;
      text-decoration: none;
      font-size: 14px;
      font-weight: 700;
      padding: 14px 28px;
      border-radius: 12px;
      box-shadow: 0 4px 14px rgba(79, 70, 229, 0.4);
    }
    .footer {
      background: #0d0e17;
      padding: 24px;
      text-align: center;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
    }
    .footer-text {
      font-size: 11px;
      color: #64748b;
      margin: 4px 0;
    }
    .footer-link {
      color: #818cf8;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <!-- Header -->
      <div class="header">
        <div class="badge">Registration Confirmed</div>
        <h1 class="title">You're In!</h1>
        <p class="subtitle">${eventTitle}</p>
      </div>

      <!-- Body -->
      <div class="body">
        <p class="greeting">
          Hi <strong>${attendeeName}</strong>,
        </p>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 16px 0;">
          Your registration for <strong>${eventTitle}</strong> has been successfully confirmed. Your official Digital Admission Pass is now active under your Coding Junction account.
        </p>

        <!-- Digital Ticket Card -->
        <div class="ticket-card">
          <div class="ticket-header">
            <div class="ticket-label">Your Official Ticket ID</div>
            <div class="ticket-id">${ticketId}</div>
          </div>
          
          <table class="info-grid">
            <tr>
              <td style="width: 50%;">
                <div class="info-label">Event</div>
                <div class="info-value">${eventTitle}</div>
              </td>
              <td style="width: 50%;">
                <div class="info-label">Date & Time</div>
                <div class="info-value">${formattedDate}</div>
              </td>
            </tr>
            <tr>
              <td>
                <div class="info-label">Venue / Location</div>
                <div class="info-value">${eventLocation || "Announced on Portal"}</div>
              </td>
              <td>
                <div class="info-label">Institution</div>
                <div class="info-value">${collegeName || "Coding Junction Community"}${isCollegeVerified ? " (AICTE Verified)" : ""}</div>
              </td>
            </tr>
          </table>
        </div>

        <!-- How to Download Your Pass Instructions -->
        <div class="instructions-box">
          <div class="instructions-title">📋 How to Access & Download Your Event Pass</div>
          <div class="step-item">
            <span class="step-num">1</span> <strong>Open Your Dashboard:</strong> Log in to your <a href="${passesUrl}" style="color: #a5b4fc; text-decoration: underline;">Coding Junction Portal</a>.
          </div>
          <div class="step-item">
            <span class="step-num">2</span> <strong>Navigate to "Event Passes":</strong> Click on the <strong>Event Passes</strong> tab in the navigation menu.
          </div>
          <div class="step-item">
            <span class="step-num">3</span> <strong>Download Digital Ticket:</strong> Locate <em>${eventTitle}</em> and click <strong>"Download Pass (PNG)"</strong> to save your high-resolution ticket with your entry barcode.
          </div>
          <div class="step-item">
            <span class="step-num">4</span> <strong>Venue Check-in:</strong> Present the digital pass on your smartphone or printout at the event venue for instant QR/Barcode check-in.
          </div>
        </div>

        <!-- CTA Button -->
        <div class="btn-container">
          <a href="${passesUrl}" class="btn-primary" target="_blank">
            Open Dashboard & View Pass →
          </a>
        </div>

        <p style="font-size: 12px; color: #94a3b8; text-align: center; margin: 16px 0 0 0;">
          Need help? Contact the organizing team at <a href="mailto:support@coding-junction.in" style="color: #818cf8;">support@coding-junction.in</a>
        </p>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="footer-text"><strong>Coding Junction Community</strong> — Where Developers Connect & Grow</p>
        <p class="footer-text">
          <a href="${siteUrl}" class="footer-link">Website</a> • 
          <a href="${siteUrl}/Events" class="footer-link">Events</a> • 
          <a href="${passesUrl}" class="footer-link">My Dashboard</a>
        </p>
        <p class="footer-text" style="margin-top: 10px; font-size: 10px;">
          This is an automated confirmation sent to ${attendeeName}. Please do not reply directly to this email.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
