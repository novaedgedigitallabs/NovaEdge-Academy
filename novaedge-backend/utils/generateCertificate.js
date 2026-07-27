const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Helper to draw the certificate on a PDFDocument instance matching the NovaEdge Digital Labs template
const drawCertificateContent = (doc, { studentName, courseName, date, certificateId, qrCodeBuffer }) => {
  const W = doc.page.width;   // 841.89
  const H = doc.page.height;  // 595.28
  const centerX = W / 2;

  // ── 1. Paper Background (Warm Off-White / Ivory Cream) ────────────────────
  doc.rect(0, 0, W, H).fill("#FAF8F5");

  // ── 2. Outer Royal Purple Guilloche Border Frame ───────────────────────────
  const B = 14;
  // Outer solid band
  doc.rect(B, B, W - B * 2, H - B * 2).fill("#2A144E");

  // Inner cream cutout
  const gap = 20;
  doc.rect(B + gap, B + gap, W - (B + gap) * 2, H - (B + gap) * 2).fill("#FAF8F5");

  // Double fine inner border lines
  doc.rect(B + gap + 8, B + gap + 8, W - (B + gap + 8) * 2, H - (B + gap + 8) * 2)
     .lineWidth(1.5)
     .stroke("#381D63");

  doc.rect(B + gap + 12, B + gap + 12, W - (B + gap + 12) * 2, H - (B + gap + 12) * 2)
     .lineWidth(1.0)
     .stroke("#381D63");

  // Scalloped corner accents
  const cornerX1 = B + gap + 12;
  const cornerY1 = B + gap + 12;
  const cornerX2 = W - (B + gap + 12);
  const cornerY2 = H - (B + gap + 12);
  const r = 24;

  doc.lineWidth(1.2).strokeColor("#381D63");
  // Top-Left corner arc
  doc.moveTo(cornerX1, cornerY1 + r).bezierCurveTo(cornerX1 + r, cornerY1 + r, cornerX1 + r, cornerY1, cornerX1 + r, cornerY1).stroke();
  // Top-Right corner arc
  doc.moveTo(cornerX2, cornerY1 + r).bezierCurveTo(cornerX2 - r, cornerY1 + r, cornerX2 - r, cornerY1, cornerX2 - r, cornerY1).stroke();
  // Bottom-Left corner arc
  doc.moveTo(cornerX1, cornerY2 - r).bezierCurveTo(cornerX1 + r, cornerY2 - r, cornerX1 + r, cornerY2, cornerX1 + r, cornerY2).stroke();
  // Bottom-Right corner arc
  doc.moveTo(cornerX2, cornerY2 - r).bezierCurveTo(cornerX2 - r, cornerY2 - r, cornerX2 - r, cornerY2, cornerX2 - r, cornerY2).stroke();

  // ── 3. Header Section (Logo & Brand Name) ──────────────────────────────────
  const logoY = 48;
  
  // Hexagon logo
  const hexX = centerX - 95;
  const hexY = logoY + 12;
  const size = 14;
  doc.save();
  doc.lineWidth(2).strokeColor("#2A134E");
  doc.polygon(
    [hexX, hexY - size],
    [hexX + size * 0.866, hexY - size * 0.5],
    [hexX + size * 0.866, hexY + size * 0.5],
    [hexX, hexY + size],
    [hexX - size * 0.866, hexY + size * 0.5],
    [hexX - size * 0.866, hexY - size * 0.5]
  ).stroke();
  doc.circle(hexX, hexY, 3).fill("#2A134E");
  doc.restore();

  // Brand Name
  doc
    .fontSize(16)
    .fillColor("#241045")
    .font("Helvetica-Bold")
    .text("NOVAEDGE", centerX - 72, logoY, { characterSpacing: 3, lineBreak: false });

  doc
    .fontSize(8.5)
    .fillColor("#584577")
    .font("Helvetica-Bold")
    .text("DIGITAL LABS", centerX - 72, logoY + 19, { characterSpacing: 4.5, lineBreak: false });

  // Top Separator line with diamond node
  doc.moveTo(centerX - 120, logoY + 36).lineTo(centerX + 120, logoY + 36).lineWidth(0.5).stroke("#8E7AA8");
  doc.circle(centerX, logoY + 36, 2).fill("#8E7AA8");

  // ── 4. Main Title Section ──────────────────────────────────────────────────
  doc
    .fontSize(32)
    .fillColor("#1D0C38")
    .font("Times-Bold")
    .text("Certificate of Completion", 0, 108, { align: "center" });

  // Scroll ornament divider
  doc.moveTo(centerX - 130, 148).lineTo(centerX + 130, 148).lineWidth(0.8).stroke("#A393BD");
  doc.polygon([centerX - 4, 148], [centerX, 144], [centerX + 4, 148], [centerX, 152]).fill("#4E3773");

  // ── 5. Ribbon Banner Course Title ─────────────────────────────────────────
  const bannerY = 166;
  const courseUpper = (courseName || "ADVANCED FULL STACK WEB DEVELOPMENT").toUpperCase();
  doc.font("Helvetica-Bold").fontSize(12);
  const textWidth = doc.widthOfString(courseUpper, { characterSpacing: 1.5 });
  const bannerW = Math.max(340, Math.min(680, textWidth + 80));
  const bannerH = 30;
  const bannerX = centerX - bannerW / 2;

  // Outer flanking diamonds
  doc.polygon([bannerX - 16, bannerY + 15], [bannerX - 11, bannerY + 10], [bannerX - 6, bannerY + 15], [bannerX - 11, bannerY + 20]).fill("#2B1450");
  doc.polygon([bannerX + bannerW + 6, bannerY + 15], [bannerX + bannerW + 11, bannerY + 10], [bannerX + bannerW + 16, bannerY + 15], [bannerX + bannerW + 11, bannerY + 20]).fill("#2B1450");

  // Dark violet ribbon background with notched tails
  doc.save();
  doc.path(`M ${bannerX} ${bannerY} L ${bannerX + bannerW} ${bannerY} L ${bannerX + bannerW - 10} ${bannerY + 15} L ${bannerX + bannerW} ${bannerY + 30} L ${bannerX} ${bannerY + 30} L ${bannerX + 10} ${bannerY + 15} Z`)
     .fill("#1F0E3D");
  doc.restore();

  // Banner text
  doc
    .fontSize(11)
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .text(courseUpper, bannerX + 10, bannerY + 9, {
      width: bannerW - 20,
      align: "center",
      characterSpacing: 1.5
    });

  // ── 6. Recipient Section ───────────────────────────────────────────────────
  doc
    .fontSize(9.5)
    .fillColor("#6E5D87")
    .font("Helvetica-Bold")
    .text("PRESENTED TO", 0, 218, { align: "center", characterSpacing: 3 });

  // Student Name
  doc
    .fontSize(38)
    .fillColor("#231046")
    .font("Times-BoldItalic")
    .text(studentName || "Your Name Here", 0, 236, { align: "center" });

  // Underline under name with central diamond
  doc.moveTo(centerX - 160, 284).lineTo(centerX + 160, 284).lineWidth(0.75).stroke("#7E6C9E");
  doc.polygon([centerX - 3, 284], [centerX, 281], [centerX + 3, 284], [centerX, 287]).fill("#7E6C9E");

  // Citation statement
  doc
    .fontSize(11.5)
    .fillColor("#3E334D")
    .font("Times-Italic")
    .text(
      "for successfully completing the course and demonstrating dedication, knowledge, and excellence in the subject matter.",
      centerX - 270,
      294,
      { align: "center", width: 540 }
    );

  // ── 7. Footer Metadata & Verification (3 Columns) ──────────────────────────
  const footerY = H - 138;

  // Column Dividers (Dashed)
  doc.save();
  doc.dash(3, { space: 3 });
  doc.moveTo(270, footerY - 5).lineTo(270, H - 38).lineWidth(0.75).stroke("#CBBEE0");
  doc.moveTo(560, footerY - 5).lineTo(560, H - 38).lineWidth(0.75).stroke("#CBBEE0");
  doc.restore();

  // ── Left Column: Issue Date & Certificate ID
  const col1X = 65;
  // Issue Date block
  doc.roundedRect(col1X, footerY, 24, 24, 4).fill("#381F66");
  doc.fontSize(7).fillColor("#FFFFFF").font("Helvetica-Bold").text("CAL", col1X + 4, footerY + 8);

  doc
    .fontSize(8.5)
    .fillColor("#6B5A86")
    .font("Helvetica-Bold")
    .text("ISSUE DATE", col1X + 32, footerY, { characterSpacing: 1.5 });
  doc
    .fontSize(11)
    .fillColor("#231046")
    .font("Helvetica-Bold")
    .text(date, col1X + 32, footerY + 11);

  doc.moveTo(col1X, footerY + 30).lineTo(col1X + 180, footerY + 30).lineWidth(0.5).stroke("#E5DDEE");

  // Certificate ID block
  doc.roundedRect(col1X, footerY + 36, 24, 24, 4).fill("#381F66");
  doc.fontSize(7).fillColor("#FFFFFF").font("Helvetica-Bold").text("ID", col1X + 8, footerY + 44);

  doc
    .fontSize(8.5)
    .fillColor("#6B5A86")
    .font("Helvetica-Bold")
    .text("CERTIFICATE ID", col1X + 32, footerY + 36, { characterSpacing: 1.5 });
  doc
    .fontSize(9.5)
    .fillColor("#231046")
    .font("Helvetica-Bold")
    .text(certificateId, col1X + 32, footerY + 47);

  // ── Center Column: QR Code & Verification
  if (qrCodeBuffer) {
    const qrSize = 60;
    const qrX = centerX - qrSize / 2;
    const qrY = footerY - 6;

    // Purple Border Frame for QR
    doc.roundedRect(qrX - 4, qrY - 4, qrSize + 8, qrSize + 8, 6).lineWidth(1.5).stroke("#381F66");
    doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });

    doc
      .fontSize(8.5)
      .fillColor("#231046")
      .font("Helvetica-Bold")
      .text("SCAN TO VERIFY", 270, qrY + qrSize + 8, { width: 290, align: "center", characterSpacing: 1.2 });
    doc
      .fontSize(7.5)
      .fillColor("#6E6184")
      .font("Helvetica")
      .text("Authenticity of this certificate", 270, qrY + qrSize + 19, { width: 290, align: "center" });
  }

  // ── Right Column: Signatory
  const sigX = 570;
  const sigW = 200;

  // Cursive Signature representation
  doc
    .fontSize(22)
    .fillColor("#1F0E3D")
    .font("Times-BoldItalic")
    .text("Amit Raikwar", sigX, footerY + 4, { width: sigW, align: "center" });

  // Signature line
  doc.moveTo(sigX + 25, footerY + 32).lineTo(sigX + sigW - 25, footerY + 32).lineWidth(1.5).stroke("#2C164D");

  // Signatory title
  doc
    .fontSize(9.5)
    .fillColor("#1F0E3D")
    .font("Helvetica-Bold")
    .text("AMIT KUMAR RAIKWAR", sigX, footerY + 37, { width: sigW, align: "center", characterSpacing: 1 });

  doc
    .fontSize(8)
    .fillColor("#64537E")
    .font("Helvetica-Bold")
    .text("FOUNDER & CEO", sigX, footerY + 49, { width: sigW, align: "center", characterSpacing: 1.2 });

  doc
    .fontSize(8)
    .fillColor("#64537E")
    .font("Helvetica")
    .text("NovaEdge Digital Labs", sigX, footerY + 60, { width: sigW, align: "center" });
};


// Direct HTTP response streaming (No file, zero disk usage, works on Vercel/serverless)
const streamCertificatePDF = (res, certificateData) => {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 0,
  });

  doc.pipe(res);
  drawCertificateContent(doc, certificateData);
  doc.end();
};

const generateCertificate = async (studentName, courseName, date, certificateId, qrCodeBuffer) => {
  return new Promise((resolve, reject) => {
    try {
      const tmpDir = os.tmpdir();
      const fileName = `cert-${certificateId}.pdf`;
      const filePath = path.join(tmpDir, fileName);

      const doc = new PDFDocument({
        size: "A4",
        layout: "landscape",
        margin: 0,
      });

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);
      drawCertificateContent(doc, { studentName, courseName, date, certificateId, qrCodeBuffer });
      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificate;
module.exports.streamCertificatePDF = streamCertificatePDF;
