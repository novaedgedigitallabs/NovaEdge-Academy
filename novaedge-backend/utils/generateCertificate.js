const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const os = require("os");

// Generates a styled certificate PDF using PDFKit (works on Vercel/serverless)
const generateCertificate = async (
  studentName,
  courseName,
  date,
  certificateId,
  qrCodeBuffer
) => {
  return new Promise((resolve, reject) => {
    try {
      // Use os.tmpdir() for serverless/Vercel read-only filesystem compatibility
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

      const W = doc.page.width;   // 841.89
      const H = doc.page.height;  // 595.28

      // ── Background ──────────────────────────────────────────────────────────
      // Deep navy gradient via layered rects
      doc.rect(0, 0, W, H).fill("#0a0f1e");
      doc.rect(0, 0, W, H / 2).fill("#0d1629");

      // ── Decorative border ───────────────────────────────────────────────────
      const B = 18; // border inset
      // Outer gold border
      doc.rect(B, B, W - B * 2, H - B * 2).lineWidth(2).stroke("#c9a84c");
      // Inner thin border
      doc.rect(B + 6, B + 6, W - (B + 6) * 2, H - (B + 6) * 2).lineWidth(0.5).stroke("#c9a84c");

      // ── Corner ornaments ────────────────────────────────────────────────────
      const ornamentSize = 30;
      const corners = [
        [B + 6, B + 6],
        [W - B - 6 - ornamentSize, B + 6],
        [B + 6, H - B - 6 - ornamentSize],
        [W - B - 6 - ornamentSize, H - B - 6 - ornamentSize],
      ];
      corners.forEach(([x, y]) => {
        doc.rect(x, y, ornamentSize, ornamentSize).lineWidth(1).stroke("#c9a84c");
        doc.rect(x + 4, y + 4, ornamentSize - 8, ornamentSize - 8).lineWidth(0.5).stroke("#c9a84c");
      });

      // ── Header badge ────────────────────────────────────────────────────────
      const badgeY = 52;
      doc
        .fontSize(9)
        .fillColor("#c9a84c")
        .font("Helvetica-Bold")
        .text("NOVAEDGE ACADEMY", 0, badgeY, { align: "center", characterSpacing: 4 });

      // Divider lines around badge text
      const badgeTextW = 160;
      const centerX = W / 2;
      doc.moveTo(centerX - badgeTextW, badgeY + 7).lineTo(centerX - 95, badgeY + 7).lineWidth(0.5).stroke("#c9a84c");
      doc.moveTo(centerX + 95, badgeY + 7).lineTo(centerX + badgeTextW, badgeY + 7).lineWidth(0.5).stroke("#c9a84c");

      // ── "CERTIFICATE OF COMPLETION" title ───────────────────────────────────
      doc
        .fontSize(34)
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .text("CERTIFICATE OF COMPLETION", 0, 85, { align: "center", characterSpacing: 2 });

      // Gold underline
      doc.moveTo(centerX - 200, 128).lineTo(centerX + 200, 128).lineWidth(1.5).stroke("#c9a84c");

      // ── "This is to certify that" ────────────────────────────────────────────
      doc
        .fontSize(12)
        .fillColor("#a0aec0")
        .font("Helvetica")
        .text("This is to certify that", 0, 148, { align: "center" });

      // ── Student Name ─────────────────────────────────────────────────────────
      doc
        .fontSize(30)
        .fillColor("#f6d860")
        .font("Helvetica-BoldOblique")
        .text(studentName, 0, 172, { align: "center" });

      // Name underline
      const nameWidth = Math.min(doc.widthOfString(studentName) + 60, 400);
      doc.moveTo(centerX - nameWidth / 2, 212).lineTo(centerX + nameWidth / 2, 212).lineWidth(0.5).stroke("#f6d860");

      // ── "has successfully completed" ─────────────────────────────────────────
      doc
        .fontSize(12)
        .fillColor("#a0aec0")
        .font("Helvetica")
        .text("has successfully completed the course", 0, 224, { align: "center" });

      // ── Course Name ──────────────────────────────────────────────────────────
      doc
        .fontSize(16)
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .text(courseName, 60, 248, { align: "center", width: W - 120, lineGap: 3 });

      // ── Bottom section ───────────────────────────────────────────────────────
      const bottomY = H - 120;

      // Date block (left)
      doc
        .fontSize(10)
        .fillColor("#a0aec0")
        .font("Helvetica")
        .text("DATE OF ISSUE", 90, bottomY, { characterSpacing: 1 });
      doc
        .fontSize(13)
        .fillColor("#ffffff")
        .font("Helvetica-Bold")
        .text(date, 90, bottomY + 16);
      doc.moveTo(90, bottomY + 38).lineTo(230, bottomY + 38).lineWidth(0.5).stroke("#4a5568");

      // Certificate ID block (center)
      doc
        .fontSize(10)
        .fillColor("#a0aec0")
        .font("Helvetica")
        .text("CERTIFICATE ID", 0, bottomY, { align: "center", characterSpacing: 1 });
      doc
        .fontSize(11)
        .fillColor("#c9a84c")
        .font("Helvetica-Bold")
        .text(certificateId, 0, bottomY + 16, { align: "center" });

      // QR Code (right side)
      if (qrCodeBuffer) {
        const qrSize = 70;
        const qrX = W - 90 - qrSize;
        const qrY = bottomY - 10;
        doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });
        doc
          .fontSize(7)
          .fillColor("#a0aec0")
          .text("Scan to verify", qrX, qrY + qrSize + 4, { width: qrSize, align: "center" });
      }

      // ── Footer ───────────────────────────────────────────────────────────────
      doc
        .fontSize(8)
        .fillColor("#4a5568")
        .text("This certificate is issued by NovaEdge Academy. Verify at novaedgeacademy.in/verify", 0, H - 30, { align: "center" });

      doc.end();

      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateCertificate;
