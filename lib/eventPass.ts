"use client";
import QRCode from "qrcode";

/**
 * Generate a crisp, scannable QR Code Data URL for mobile venue scanning.
 */
export async function generateQrDataUrl(text: string): Promise<string> {
  if (!text) return "";
  try {
    return await QRCode.toDataURL(text, {
      margin: 1,
      width: 280,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
  } catch (err) {
    console.warn("Notice generating QR code data URL:", err);
    return "";
  }
}

/**
 * Helper to register a user for an event and immediately generate their Event Pass.
 * Saves to both localStorage and Clerk user metadata with zero backend needed.
 */
export function getRegisteredEventIds(user?: any): string[] {
  if (typeof window === "undefined" || !user || !user.id) return [];
  try {
    // 1. Clean up legacy un-scoped global keys if present to prevent cross-account pollution
    try {
      localStorage.removeItem("cj_registered_event_ids_v2");
      localStorage.removeItem("cj_registered_event_ids");
    } catch {
      // Ignore
    }

    // 2. Read strictly user-scoped registrations from Clerk metadata & user-keyed localStorage
    const fromClerk = (user?.unsafeMetadata?.registeredEventIds as string[]) || [];
    const userKey = `cj_registered_event_ids_${user.id}`;
    const rawLocal = localStorage.getItem(userKey);
    const local = rawLocal ? JSON.parse(rawLocal) : [];

    return Array.from(
      new Set([...(Array.isArray(local) ? local : []), ...fromClerk])
    );
  } catch {
    return [];
  }
}

export function isEventRegistered(eventId: string, user?: any): boolean {
  if (!eventId || !user || !user.id) return false;
  const list = getRegisteredEventIds(user);
  return list.includes(eventId);
}

export async function registerForEvent(eventId: string, user?: any): Promise<string[]> {
  if (!eventId || typeof window === "undefined") return [];

  // Strictly enforce authentication: no registration without sign in / sign up
  if (!user || !user.id) {
    console.warn("User must be signed in to register for an event.");
    return [];
  }

  const userKey = `cj_registered_event_ids_${user.id}`;
  const current = getRegisteredEventIds(user);
  const next = Array.from(new Set([...current, eventId]));

  // 1. Save strictly to user-specific localStorage
  try {
    localStorage.setItem(userKey, JSON.stringify(next));
    localStorage.removeItem("cj_registered_event_ids_v2");
    localStorage.removeItem("cj_registered_event_ids");
  } catch (err) {
    console.error("Failed to save registered event to localStorage:", err);
  }

  // 2. Save to Clerk user metadata
  if (user && typeof user.update === "function") {
    try {
      await user.update({
        unsafeMetadata: {
          ...(user.unsafeMetadata || {}),
          registeredEventIds: next,
        },
      });
    } catch (err) {
      console.error("Failed to sync registered event to Clerk metadata:", err);
    }
  }

  // 3. Notify listeners across components
  try {
    window.dispatchEvent(
      new CustomEvent("cj:event-registered", {
        detail: { eventId, allIds: next },
      })
    );
  } catch {
    // Ignore in non-browser environments
  }

  return next;
}

export async function cancelEventRegistration(eventId: string, user?: any, eventTitle?: string): Promise<string[]> {
  if (!eventId || typeof window === "undefined") return [];
  if (!user || !user.id) return [];

  const userKey = `cj_registered_event_ids_${user.id}`;
  const current = getRegisteredEventIds(user);
  const next = current.filter((id) => id !== eventId);
  const ticketId = `CJ-EVT-${eventId.replace(/[^a-zA-Z0-9]/g, "").slice(-4).toUpperCase()}-${user.id.replace("user_", "").slice(-4).toUpperCase()}`;

  // 1. Update localStorage
  try {
    localStorage.setItem(userKey, JSON.stringify(next));
  } catch (err) {
    console.error("Failed to update localStorage after cancellation:", err);
  }

  // 2. Update Clerk user metadata
  if (user && typeof user.update === "function") {
    try {
      await user.update({
        unsafeMetadata: {
          ...(user.unsafeMetadata || {}),
          registeredEventIds: next,
        },
      });
    } catch (err) {
      console.error("Failed to update Clerk metadata after cancellation:", err);
    }
  }

  // 3. Mark cancelled in backend & external Sheets
  try {
    await fetch("/api/events/cancel-registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId, eventTitle, ticketId }),
    });
  } catch (err) {
    console.warn("Notice updating registration cancellation on backend:", err);
  }

  // Refresh client-side Clerk user state
  if (user && typeof user.reload === "function") {
    try {
      await user.reload();
    } catch {
      // Ignore
    }
  }

  // 4. Notify listeners across components
  try {
    window.dispatchEvent(
      new CustomEvent("cj:event-cancelled", {
        detail: { eventId, allIds: next },
      })
    );
  } catch {
    // Ignore
  }

  return next;
}

/**
 * Render and download a digital conference boarding pass as a crisp PNG ticket.
 */
export async function downloadEventPassPng({
  eventTitle,
  attendeeName,
  date,
  location,
  ticketId,
  isVerified,
}: {
  eventTitle: string;
  attendeeName: string;
  date?: string;
  location?: string;
  ticketId: string;
  isVerified?: boolean;
}): Promise<void> {
  if (typeof window === "undefined") return;

  const canvas = document.createElement("canvas");
  canvas.width = 1000;
  canvas.height = 460;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 1000, 460);
  bgGrad.addColorStop(0, "#080911");
  bgGrad.addColorStop(0.5, "#0e101f");
  bgGrad.addColorStop(1, "#14172e");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1000, 460);

  // Outer border
  ctx.strokeStyle = "rgba(99, 102, 241, 0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 998, 458);

  // Top accent stripe
  const topGrad = ctx.createLinearGradient(0, 0, 1000, 0);
  topGrad.addColorStop(0, "#6366f1");
  topGrad.addColorStop(0.5, "#a855f7");
  topGrad.addColorStop(1, "#06b6d4");
  ctx.fillStyle = topGrad;
  ctx.fillRect(0, 0, 1000, 6);

  // Perforation line at x = 700
  ctx.save();
  ctx.setLineDash([8, 8]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(700, 30);
  ctx.lineTo(700, 430);
  ctx.stroke();

  // Top and bottom cutout notches
  ctx.setLineDash([]);
  ctx.fillStyle = "#030712";
  ctx.beginPath();
  ctx.arc(700, 0, 22, 0, Math.PI);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(700, 460, 22, Math.PI, 0);
  ctx.fill();
  ctx.restore();

  // Left Section (Main Ticket Info)
  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillText("CODING JUNCTION · OFFICIAL EVENT ENTRY PASS", 50, 50);

  // Event Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px sans-serif";
  const displayTitle = eventTitle.length > 36 ? eventTitle.slice(0, 34) + "..." : eventTitle;
  ctx.fillText(displayTitle, 50, 100);

  // Date & Venue banner box
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.lineWidth = 1;
  ctx.fillRect(50, 130, 600, 64);
  ctx.strokeRect(50, 130, 600, 64);

  const formattedDate = date
    ? new Date(date).toLocaleDateString("en-IN", {
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Date Announced Soon";

  ctx.fillStyle = "#cbd5e1";
  ctx.font = "14px 'Courier New', monospace";
  ctx.fillText(`DATE: ${formattedDate}`, 70, 168);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px 'Courier New', monospace";
  ctx.fillText(`VENUE: ${location || "Coding Junction Tech Hub"}`, 340, 168);

  // Attendee Info Section
  ctx.fillStyle = "rgba(99, 102, 241, 0.06)";
  ctx.strokeStyle = "rgba(99, 102, 241, 0.25)";
  ctx.fillRect(50, 220, 600, 140);
  ctx.strokeRect(50, 220, 600, 140);

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillText("ATTENDEE NAME", 75, 250);
  ctx.fillText("TICKET ID", 380, 250);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px sans-serif";
  ctx.fillText(attendeeName, 75, 285);

  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 18px 'Courier New', monospace";
  ctx.fillText(ticketId, 380, 285);

  ctx.fillStyle = "#64748b";
  ctx.font = "bold 11px 'Courier New', monospace";
  ctx.fillText("ACCESS LEVEL", 75, 325);
  ctx.fillText("ADMISSION STATUS", 380, 325);

  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillText("ALL-ACCESS ADMISSION", 75, 345);

  if (isVerified) {
    ctx.fillStyle = "#34d399";
    ctx.fillText("✓ VERIFIED ATTENDEE (CHECKED IN)", 380, 345);
  } else {
    ctx.fillStyle = "#fbbf24";
    ctx.fillText("● PASS CONFIRMED (ACTIVE)", 380, 345);
  }

  // Verification status bar
  ctx.fillStyle = isVerified ? "rgba(16, 185, 129, 0.15)" : "rgba(99, 102, 241, 0.15)";
  ctx.fillRect(50, 380, 600, 44);
  ctx.fillStyle = isVerified ? "#34d399" : "#a5b4fc";
  ctx.font = "12px 'Courier New', monospace";
  const statusMsg = isVerified
    ? "✓ PHYSICAL ATTENDANCE VALIDATED · OFFICIAL CERTIFICATE UNLOCKED"
    : "PRESENT THIS PASS AT VENUE GATE FOR ADMISSION & CHECK-IN";
  ctx.fillText(statusMsg, 75, 407);

  // Right Stub (Stub & Barcode)
  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 12px 'Courier New', monospace";
  ctx.fillText("BOARDING STUB", 740, 50);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 14px sans-serif";
  ctx.fillText(displayTitle.slice(0, 22), 740, 75);

  ctx.fillStyle = "#64748b";
  ctx.font = "11px 'Courier New', monospace";
  ctx.fillText(`ID: ${ticketId}`, 740, 95);

  // Scannable QR Code on Right Stub
  try {
    const qrDataUrl = await QRCode.toDataURL(ticketId, {
      margin: 1,
      width: 220,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
    });
    const qrImg = new Image();
    qrImg.src = qrDataUrl;
    await new Promise((resolve) => {
      qrImg.onload = resolve;
      qrImg.onerror = resolve;
    });

    // White rounded backdrop for crisp mobile camera scanning
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.rect(745, 125, 175, 175);
    ctx.fill();
    ctx.drawImage(qrImg, 750, 130, 165, 165);
  } catch (qrErr) {
    console.warn("Notice rendering QR code on pass canvas:", qrErr);
  }

  // QR Code Ticket ID label
  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 13px 'Courier New', monospace";
  ctx.fillText(ticketId, 745, 325);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "10px sans-serif";
  ctx.fillText("SCAN AT VENUE GATE (CODING JUNCTION APP)", 745, 345);

  ctx.fillStyle = "#64748b";
  ctx.font = "10px 'Courier New', monospace";
  ctx.fillText("CODING JUNCTION COMMUNITY · coding-junction.in", 745, 400);

  // Convert to Blob and Trigger Download
  canvas.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${eventTitle.replace(/[^a-zA-Z0-9]/g, "_")}_Event_Pass.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, "image/png");
}
