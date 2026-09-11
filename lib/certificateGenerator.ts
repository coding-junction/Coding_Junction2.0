/**
 * Coding Junction Dynamic Certificate Generation Engine
 * Generates high-resolution, print-ready certificates by overlaying
 * verified student details onto Sanity certificate templates.
 */

export interface CertificateOptions {
  studentName: string;
  templateUrl?: string;
  certificateTitle?: string;
  collegeName?: string;
  eventDate?: string;
  certificateId?: string;
}

/**
 * Sanitizes student name to guarantee strictly only the attendee's name is printed.
 * Removes any phone numbers, digit sequences, emails, or extraneous characters.
 */
export function sanitizeStudentName(rawName: string): string {
  if (!rawName) return "Attendee";

  let cleaned = rawName
    // Remove phone number formats like +91 9876543210 or 98765-43210
    .replace(/[+0-9()\-\s]{8,}/g, " ")
    // Remove email addresses
    .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, " ")
    // Strip any remaining isolated digits
    .replace(/\d+/g, "")
    // Remove stray punctuation except standard name symbols
    .replace(/[^a-zA-Z\s'.\-]/g, "")
    // Collapse multiple whitespaces
    .replace(/\s+/g, " ")
    .trim();

  return cleaned || "Attendee";
}

/**
 * Loads an image with CORS enabled
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(new Error(`Failed to load certificate template from ${src}: ${err}`));
    img.src = src;
  });
}

/**
 * Generates an off-screen high-resolution certificate canvas.
 * When a template is provided from Sanity (e.g. designed in Canva/Figma),
 * it ONLY imprints the user's name onto the template's designated name field.
 */
export async function generateCertificateCanvas(
  options: CertificateOptions
): Promise<HTMLCanvasElement> {
  const {
    studentName,
    templateUrl,
    certificateTitle = "Certificate of Participation",
    collegeName,
    eventDate,
    certificateId = `CJ-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not supported");

  // High-res standard certificate size matching Sanity template (2000 x 1414 px)
  const WIDTH = 2000;
  const HEIGHT = 1414;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  // Clean the user's name: strictly no phone number or digits
  const cleanName = sanitizeStudentName(studentName);

  if (templateUrl) {
    // ─── 1. Template from Sanity CMS ───
    try {
      const img = await loadImage(templateUrl);
      ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
    } catch {
      drawDefaultTemplate(ctx, WIDTH, HEIGHT);
    }

    // ─── 2. Imprint ONLY the User's Name onto the Name Field ───
    // Dotted line in Sanity Canva template is precisely at Y = 662.
    // Placing alphabetic baseline at Y = 646 sits the text directly above the line.
    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";

    const nameX = WIDTH / 2; // 1000 px (centered)
    const nameY = 646;       // 16px above Y=662 dotted line

    // Prestigious, elegant font tailored for official certificates
    let fontSize = 60;
    const fontFamilies = "'Cinzel', 'Playfair Display', 'Times New Roman', Georgia, serif";
    ctx.font = `bold ${fontSize}px ${fontFamilies}`;

    // Auto-scale if the user has a longer name to fit within the dotted line (~1150px)
    const maxNameWidth = 1150;
    while (ctx.measureText(cleanName).width > maxNameWidth && fontSize > 28) {
      fontSize -= 2;
      ctx.font = `bold ${fontSize}px ${fontFamilies}`;
    }

    // Deep ink tone matching Canva template typography
    ctx.fillStyle = "#111827";
    ctx.shadowColor = "rgba(0, 0, 0, 0.12)";
    ctx.shadowBlur = 3;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    ctx.fillText(cleanName, nameX, nameY);
    ctx.restore();
  } else {
    // ─── 3. Default Procedural Fallback Template ───
    drawDefaultTemplate(ctx, WIDTH, HEIGHT);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 64px 'Cinzel', 'Playfair Display', Georgia, serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(cleanName.toUpperCase(), WIDTH / 2, HEIGHT * 0.52);

    if (collegeName) {
      ctx.font = "italic 24px 'Inter', sans-serif";
      ctx.fillStyle = "#cbd5e1";
      ctx.fillText(`from ${collegeName}`, WIDTH / 2, HEIGHT * 0.58);
    }

    ctx.font = "28px 'Inter', sans-serif";
    ctx.fillStyle = "#94a3b8";
    ctx.fillText(
      `for outstanding participation in "${certificateTitle}"`,
      WIDTH / 2,
      HEIGHT * 0.64
    );

    const formattedDate = eventDate
      ? new Date(eventDate).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

    ctx.font = "20px 'Courier New', monospace";
    ctx.fillStyle = "#64748b";
    ctx.textAlign = "left";
    ctx.fillText(`Date: ${formattedDate}`, 160, HEIGHT - 140);

    ctx.textAlign = "right";
    ctx.fillText(`Credential ID: ${certificateId}`, WIDTH - 160, HEIGHT - 140);
    ctx.restore();
  }

  return canvas;
}

/**
 * Draws an elegant dark-theme certificate template if no custom Sanity image is uploaded
 */
function drawDefaultTemplate(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  // Background gradient
  const bgGrad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    100,
    width / 2,
    height / 2,
    width * 0.7
  );
  bgGrad.addColorStop(0, "#16192b");
  bgGrad.addColorStop(1, "#0a0c16");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Decorative border
  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 6;
  ctx.strokeRect(60, 60, width - 120, height - 120);

  ctx.strokeStyle = "#f59e0b";
  ctx.lineWidth = 2;
  ctx.strokeRect(74, 74, width - 148, height - 148);

  // Header Title
  ctx.save();
  ctx.textAlign = "center";

  ctx.font = "bold 32px 'Inter', sans-serif";
  ctx.fillStyle = "#818cf8";
  ctx.letterSpacing = "6px";
  ctx.fillText("CODING JUNCTION • UIT BURDWAN", width / 2, 220);

  ctx.font = "bold 58px 'Cinzel', Georgia, serif";
  ctx.fillStyle = "#f8fafc";
  ctx.letterSpacing = "4px";
  ctx.fillText("CERTIFICATE OF PARTICIPATION", width / 2, 320);

  ctx.font = "italic 26px Georgia, serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("This certificate is proudly awarded to", width / 2, 410);

  // Signatures line
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.moveTo(160, height - 200);
  ctx.lineTo(460, height - 200);
  ctx.stroke();

  ctx.font = "18px 'Inter', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.textAlign = "center";
  ctx.fillText("Faculty Coordinator", 310, height - 170);

  ctx.beginPath();
  ctx.moveTo(width - 460, height - 200);
  ctx.lineTo(width - 160, height - 200);
  ctx.stroke();

  ctx.fillText("President, Coding Junction", width - 310, height - 170);

  ctx.restore();
}

/**
 * Downloads the certificate directly as a high-res PNG image
 */
export async function downloadCertificatePng(
  options: CertificateOptions
): Promise<void> {
  const canvas = await generateCertificateCanvas(options);
  const dataUrl = canvas.toDataURL("image/png", 1.0);

  const cleanName = sanitizeStudentName(options.studentName).replace(/[^a-zA-Z0-9]/g, "_");
  const cleanTitle = (options.certificateTitle || "Certificate").replace(/[^a-zA-Z0-9]/g, "_");

  const link = document.createElement("a");
  link.download = `Certificate_${cleanTitle}_${cleanName}.png`;
  link.href = dataUrl;
  link.click();
}
