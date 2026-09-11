export interface EventEmailPayload {
  title: string;
  date?: string;
  location?: string;
  description?: string;
  imageUrl?: string;
  registerLink?: string;
  siteUrl?: string;
}

export function generateNewEventEmailHtml({
  title,
  date,
  location,
  description,
  imageUrl,
  registerLink,
  siteUrl = "https://coding-junction.in",
}: EventEmailPayload): string {
  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Date to be announced";

  const targetLink = registerLink || `${siteUrl}/Events`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Event: ${title}</title>
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
      padding: 28px 32px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      background: linear-gradient(180deg, rgba(99, 102, 241, 0.12) 0%, rgba(18, 20, 34, 0) 100%);
      text-align: center;
    }
    .logo-text {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #ffffff;
      margin: 0;
    }
    .logo-accent {
      color: #818cf8;
    }
    .badge {
      display: inline-block;
      margin-top: 12px;
      padding: 4px 12px;
      border-radius: 9999px;
      background: rgba(99, 102, 241, 0.15);
      border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .content {
      padding: 32px;
    }
    .banner-img {
      width: 100%;
      max-height: 280px;
      object-fit: cover;
      border-radius: 12px;
      margin-bottom: 24px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .title {
      font-size: 26px;
      font-weight: 800;
      line-height: 1.25;
      color: #ffffff;
      margin: 0 0 16px 0;
    }
    .meta-box {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      font-size: 13px;
      color: #cbd5e1;
    }
    .meta-item:last-child {
      margin-bottom: 0;
    }
    .meta-label {
      font-weight: 600;
      color: #94a3b8;
      width: 80px;
      flex-shrink: 0;
    }
    .description {
      font-size: 14px;
      line-height: 1.65;
      color: #94a3b8;
      margin-bottom: 32px;
      white-space: pre-line;
    }
    .cta-container {
      text-align: center;
      margin-bottom: 24px;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 36px;
      font-size: 14px;
      font-weight: 700;
      border-radius: 12px;
      box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
      transition: all 0.2s ease;
    }
    .footer {
      padding: 24px 32px;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      background: #0d0e17;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .footer a {
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
        <h1 class="logo-text">Coding<span class="logo-accent">Junction</span></h1>
        <div class="badge">New Event Announcement</div>
      </div>

      <!-- Main Content -->
      <div class="content">
        ${
          imageUrl
            ? `<img src="${imageUrl}" alt="${title}" class="banner-img" />`
            : ""
        }

        <h2 class="title">${title}</h2>

        <!-- Event Meta -->
        <div class="meta-box">
          <div class="meta-item">
            <span class="meta-label">📅 Date:</span>
            <span>${formattedDate}</span>
          </div>
          ${
            location
              ? `
          <div class="meta-item">
            <span class="meta-label">📍 Venue:</span>
            <span>${location}</span>
          </div>`
              : ""
          }
        </div>

        <!-- Description -->
        <div class="description">
          ${description || "An exciting new event has been announced by Coding Junction. Click below to register and claim your entry pass!"}
        </div>

        <!-- Call to Action -->
        <div class="cta-container">
          <a href="${targetLink}" target="_blank" rel="noopener noreferrer" class="cta-button">
            Register / Claim Pass &rarr;
          </a>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>You received this email because you are a registered member of <strong>Coding Junction</strong>.</p>
        <p>
          <a href="${siteUrl}">Official Website</a> • 
          <a href="${siteUrl}/Dashboard">Student Dashboard</a> • 
          <a href="${siteUrl}/Events">All Events</a>
        </p>
        <p style="margin-top: 12px; font-size: 11px; color: #475569;">
          © ${new Date().getFullYear()} Coding Junction, UIT Burdwan. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}
