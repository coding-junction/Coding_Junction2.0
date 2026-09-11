/**
 * Coding Junction Dynamic Certificate Generation Engine
 * Generates high-resolution, print-ready certificates by overlaying
 * verified student details onto Sanity certificate templates.
 */

export interface CertificateOptions {
  studentName: string;
  collegeName?: string;
  eventTitle: string;
  eventDate?: string;
  templateUrl?: string;
  certificateId?: string;
  qrVerificationUrl?: string;
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
 * Generates an off-screen high-resolution certificate canvas
 */
export async function generateCertificateCanvas(
  options: CertificateOptions
): Promise<HTMLCanvasElement> {
  const {
    studentName,
    collegeName,
    eventTitle,
    eventDate,
    templateUrl,
    certificateId = `CJ-CERT-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  } = options;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context not supported");

  // Standard high-res certificate size (A4 landscape at 300 DPI: 3508 x 2480, or 2000 x 1414 for ultra-fast rendering)
  const WIDTH = 2000;
  const HEIGHT = 1414;

  canvas.width = WIDTH;
  canvas.height = HEIGHT;

  if (templateUrl) {
    // 1. Template from Sanity CMS
    try {
      const img = await loadImage(templateUrl);
      ctx.drawImage(img, 0, 0, WIDTH, HEIGHT);
    } catch {
      // If template fails to load, fallback to default procedural template
      drawDefaultTemplate(ctx, WIDTH, HEIGHT);
    }
  } else {
    // 2. Default High-Fidelity Coding Junction Certificate Template
    drawDefaultTemplate(ctx, WIDTH, HEIGHT);
  }

  // 3. Stamp Student Name (Large, centered, elegant typography)
  ctx.save();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Name
  ctx.font = "bold 64px 'Cinzel', 'Playfair Display', Georgia, serif";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(0, 0, 0, 0.4)";
  ctx.shadowBlur = 10;
  ctx.fillText(studentName.toUpperCase(), WIDTH / 2, HEIGHT * 0.52);

  // College / Affiliation (if present)
  if (collegeName) {
    ctx.font = "italic 24px 'Inter', sans-serif";
    ctx.fillStyle = "#cbd5e1";
    ctx.shadowBlur = 0;
    ctx.fillText(`from ${collegeName}`, WIDTH / 2, HEIGHT * 0.58);
  }

  // Event Context
  ctx.font = "28px 'Inter', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText(
    `for outstanding participation in "${eventTitle}"`,
    WIDTH / 2,
    HEIGHT * 0.64
  );

  // Date & Certificate ID Footer
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

  const cleanName = options.studentName.replace(/[^a-zA-Z0-9]/g, "_");
  const cleanEvent = options.eventTitle.replace(/[^a-zA-Z0-9]/g, "_");

  const link = document.createElement("a");
  link.download = `Certificate_${cleanEvent}_${cleanName}.png`;
  link.href = dataUrl;
  link.click();
}
