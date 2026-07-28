const fs = require("fs");
const path = require("path");
const os = require("os");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

let puppeteer = null;
try {
  puppeteer = require("puppeteer");
} catch (e) {
  console.log("Puppeteer not available, using native PDFKit renderer.");
}

// ── NATIVE PDFKIT RENDERER (100% Works on Vercel, Serverless, AWS Lambda & Local) ──────
const drawCertificateNativePDF = (doc, { studentName, courseName, date, certificateId, qrCodeBuffer }) => {
  const W = doc.page.width;   // 841.89
  const H = doc.page.height;  // 595.28
  const centerX = W / 2;

  // 1. Draw High-Res Certificate Background Image
  const bgPath = path.join(__dirname, "../templates/certificate_background.png");
  const fallbackBgPath = path.join(__dirname, "../certificate_background.png");
  const actualBg = fs.existsSync(bgPath) ? bgPath : (fs.existsSync(fallbackBgPath) ? fallbackBgPath : null);

  if (actualBg) {
    doc.image(actualBg, 0, 0, { width: W, height: H });
  } else {
    // Fallback background color if image isn't found
    doc.rect(0, 0, W, H).fill("#FAF8F5");
  }

  // 2. Main Title Section (Positioned cleanly below top logo in background image)
  doc
    .fontSize(30)
    .fillColor("#1D0C38")
    .font("Times-Bold")
    .text("Certificate of Completion", 0, 105, { align: "center" });

  doc.moveTo(centerX - 130, 142).lineTo(centerX + 130, 142).lineWidth(0.8).stroke("#52338B");
  doc.polygon([centerX - 4, 142], [centerX, 138], [centerX + 4, 142], [centerX, 146]).fill("#52338B");

  // 3. Ribbon Banner Course Title
  const bannerY = 158;
  const courseUpper = (courseName || "ADVANCED FULL STACK WEB DEVELOPMENT").toUpperCase();
  doc.font("Helvetica-Bold").fontSize(10.5);
  const textWidth = doc.widthOfString(courseUpper, { characterSpacing: 1.5 });
  const bannerW = Math.max(340, Math.min(680, textWidth + 80));
  const bannerX = centerX - bannerW / 2;

  doc.polygon([bannerX - 16, bannerY + 14], [bannerX - 11, bannerY + 9], [bannerX - 6, bannerY + 14], [bannerX - 11, bannerY + 19]).fill("#2B1450");
  doc.polygon([bannerX + bannerW + 6, bannerY + 14], [bannerX + bannerW + 11, bannerY + 9], [bannerX + bannerW + 16, bannerY + 14], [bannerX + bannerW + 11, bannerY + 19]).fill("#2B1450");

  doc.save();
  doc.path(`M ${bannerX} ${bannerY} L ${bannerX + bannerW} ${bannerY} L ${bannerX + bannerW - 10} ${bannerY + 14} L ${bannerX + bannerW} ${bannerY + 28} L ${bannerX} ${bannerY + 28} L ${bannerX + 10} ${bannerY + 14} Z`)
     .fill("#1F0E3D");
  doc.restore();

  doc
    .fontSize(10)
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .text(courseUpper, bannerX + 10, bannerY + 8, {
      width: bannerW - 20,
      align: "center",
      characterSpacing: 1.5
    });

  // 4. Recipient Section
  doc
    .fontSize(9)
    .fillColor("#6E5D87")
    .font("Helvetica-Bold")
    .text("PRESENTED TO", 0, 208, { align: "center", characterSpacing: 3 });

  doc
    .fontSize(36)
    .fillColor("#231046")
    .font("Times-BoldItalic")
    .text(studentName || "Your Name Here", 0, 224, { align: "center" });

  doc.moveTo(centerX - 160, 270).lineTo(centerX + 160, 270).lineWidth(0.75).stroke("#7E6C9E");
  doc.polygon([centerX - 3, 270], [centerX, 267], [centerX + 3, 270], [centerX, 273]).fill("#7E6C9E");

  doc
    .fontSize(11)
    .fillColor("#3E334D")
    .font("Times-Italic")
    .text(
      "for successfully completing the course and demonstrating dedication, knowledge, and excellence in the subject matter.",
      centerX - 270,
      280,
      { align: "center", width: 540 }
    );

  // 5. Footer Metadata & Verification (3 Columns)
  const footerY = H - 138;

  doc.save();
  doc.dash(3, { space: 3 });
  doc.moveTo(270, footerY - 5).lineTo(270, H - 38).lineWidth(0.75).stroke("#CBBEE0");
  doc.moveTo(560, footerY - 5).lineTo(560, H - 38).lineWidth(0.75).stroke("#CBBEE0");
  doc.restore();

  const col1X = 65;
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

  if (qrCodeBuffer) {
    const qrSize = 60;
    const qrX = centerX - qrSize / 2;
    const qrY = footerY - 6;

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

  const sigX = 570;
  const sigW = 200;

  doc
    .fontSize(22)
    .fillColor("#1F0E3D")
    .font("Times-BoldItalic")
    .text("Amit Raikwar", sigX, footerY + 4, { width: sigW, align: "center" });

  doc.moveTo(sigX + 25, footerY + 32).lineTo(sigX + sigW - 25, footerY + 32).lineWidth(1.5).stroke("#2C164D");

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

// ── PUPPETEER HTML RENDERER (Used when Chromium binary is present) ─────────────────
const getCertificateHTML = ({ studentName, courseName, date, certificateId, qrDataUrl }) => {
  let bgDataUrl = '';
  try {
    const bgPath = path.join(__dirname, "../templates/certificate_background.png");
    const fallbackBgPath = path.join(__dirname, "../certificate_background.png");
    const actualBg = fs.existsSync(bgPath) ? bgPath : (fs.existsSync(fallbackBgPath) ? fallbackBgPath : null);
    if (actualBg) {
      const fileData = fs.readFileSync(actualBg);
      bgDataUrl = `data:image/png;base64,${fileData.toString("base64")}`;
    }
  } catch (e) {
    console.warn("Could not read bg image for base64 HTML:", e);
  }

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
@import url('https://fonts.googleapis.com/css2?family=Alex+Brush&family=Cinzel:wght@500;700;900&family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,400&family=Montserrat:wght@400;500;600;700;800;900&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  -webkit-print-color-adjust: exact !important;
  print-color-adjust: exact !important;
}

@page {
  size: 1123px 794px;
  margin: 0;
}

body {
  width: 1123px;
  height: 794px;
  background-color: #FAF8F5;
  font-family: 'Montserrat', sans-serif;
  color: #221042;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.certificate-card {
  position: relative;
  width: 1123px;
  height: 794px;
  background-color: #FAF8F5;
  padding: 50px 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

.bg-img-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  z-index: 0;
}

.content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
  padding-top: 100px;
}

.title-section {
  margin: 4px 0;
}

.main-title {
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-weight: 900;
  font-size: 44px;
  color: #1D0C38;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.flourish-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 6px;
}

.flourish-line {
  height: 1px;
  width: 150px;
  background-color: #A393BD;
}

.ribbon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
  margin: 6px 0;
}

.ribbon-banner {
  background-color: #1F0E3D;
  color: #FFFFFF;
  padding: 11px 52px;
  clip-path: polygon(0% 0%, 100% 0%, 96.5% 50%, 100% 100%, 0% 100%, 3.5% 50%);
  font-weight: 800;
  font-size: 15px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.banner-diamond {
  color: #2B1450;
  font-size: 14px;
}

.recipient-section {
  margin: 6px 0;
}

.presented-to {
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 0.28em;
  color: #6E5D87;
  text-transform: uppercase;
}

.student-name {
  font-family: 'Great Vibes', 'Alex Brush', cursive;
  font-size: 58px;
  color: #231046;
  font-weight: 400;
  line-height: 1.2;
  margin: 4px 0;
}

.name-underline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 400px;
  margin: 0 auto;
}

.name-line {
  height: 1px;
  flex-grow: 1;
  background: linear-gradient(to right, transparent, #7E6C9E, #7E6C9E);
}
.name-line-right {
  height: 1px;
  flex-grow: 1;
  background: linear-gradient(to left, transparent, #7E6C9E, #7E6C9E);
}

.citation-text {
  font-family: 'Playfair Display', Georgia, serif;
  font-style: italic;
  font-size: 14.5px;
  color: #3E334D;
  max-width: 620px;
  margin: 10px auto 0;
  line-height: 1.4;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding-top: 14px;
  margin-bottom: 10px;
}

.footer-col {
  display: flex;
  flex-direction: column;
}

.col-left {
  text-align: left;
  border-right: 1px dashed #CBBEE0;
  padding-right: 20px;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.meta-icon-box {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background-color: #381F66;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.meta-icon-box svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.meta-label {
  font-weight: 800;
  font-size: 9.5px;
  letter-spacing: 0.15em;
  color: #6B5A86;
  text-transform: uppercase;
  display: block;
}

.meta-value {
  font-weight: 700;
  font-size: 13px;
  color: #231046;
  display: block;
}

.meta-divider {
  height: 1px;
  background-color: #E5DDEE;
  width: 100%;
}

.col-center {
  align-items: center;
  border-right: 1px dashed #CBBEE0;
  padding: 0 10px;
}

.qr-frame {
  padding: 6px;
  background: white;
  border: 2px solid #381F66;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.qr-img {
  width: 72px;
  height: 72px;
  display: block;
}

.qr-text-top {
  font-weight: 900;
  font-size: 10px;
  color: #231046;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-top: 6px;
}

.qr-text-sub {
  font-size: 9px;
  color: #6E6184;
  margin-top: 2px;
}

.col-right {
  align-items: center;
  text-align: center;
  padding-left: 20px;
}

.signature-text {
  font-family: 'Great Vibes', 'Alex Brush', cursive;
  font-size: 40px;
  color: #1F0E3D;
  line-height: 1;
}

.signature-line {
  height: 2px;
  width: 170px;
  background-color: #2C164D;
  margin: 4px auto 6px;
}

.sig-name {
  font-weight: 900;
  font-size: 12.5px;
  color: #1F0E3D;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.sig-role {
  font-weight: 700;
  font-size: 10px;
  color: #64537E;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-top: 2px;
}

.sig-org {
  font-size: 10px;
  color: #64537E;
  font-weight: 500;
  margin-top: 1px;
}
</style>
</head>
<body>
<div class="certificate-card">
  ${bgDataUrl ? `<img src="${bgDataUrl}" class="bg-img-overlay" />` : ''}

  <div class="content">
    <div class="title-section">
      <h1 class="main-title">Certificate of Completion</h1>
      <div class="flourish-row">
        <div class="flourish-line"></div>
        <svg style="width: 20px; height: 20px; color: #4E3773; fill: currentColor;" viewBox="0 0 24 24">
          <path d="M12 3L14.5 8.5L20 11L14.5 13.5L12 19L9.5 13.5L4 11L9.5 8.5L12 3Z"/>
        </svg>
        <div class="flourish-line"></div>
      </div>
    </div>

    <div class="ribbon-wrapper">
      <span class="banner-diamond">◆</span>
      <div class="ribbon-banner">${courseName ? courseName.toUpperCase() : "ADVANCED FULL STACK WEB DEVELOPMENT"}</div>
      <span class="banner-diamond">◆</span>
    </div>

    <div class="recipient-section">
      <div class="presented-to">PRESENTED TO</div>
      <div class="student-name">${studentName || "Your Name Here"}</div>
      <div class="name-underline">
        <div class="name-line"></div>
        <span style="font-size: 9px; color: #7E6C9E;">◆</span>
        <div class="name-line-right"></div>
      </div>
      <p class="citation-text">for successfully completing the course and demonstrating dedication, knowledge, and excellence in the subject matter.</p>
    </div>

    <div class="footer-grid">
      <div class="footer-col col-left">
        <div class="meta-item">
          <div class="meta-icon-box">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
          </div>
          <div>
            <span class="meta-label">ISSUE DATE</span>
            <span class="meta-value">${date}</span>
          </div>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <div class="meta-icon-box">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          </div>
          <div>
            <span class="meta-label">CERTIFICATE ID</span>
            <span class="meta-value" style="font-family: monospace; font-size: 11px;">${certificateId}</span>
          </div>
        </div>
      </div>

      <div class="footer-col col-center">
        <div class="qr-frame">
          <img src="${qrDataUrl}" class="qr-img" />
        </div>
        <div class="qr-text-top">SCAN TO VERIFY</div>
        <div class="qr-text-sub">Authenticity of this certificate</div>
      </div>

      <div class="footer-col col-right">
        <div class="signature-text">Amit Raikwar</div>
        <div class="signature-line"></div>
        <div class="sig-name">AMIT KUMAR RAIKWAR</div>
        <div class="sig-role">FOUNDER & CEO</div>
        <div class="sig-org">NovaEdge Digital Labs</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
};

const findChromePath = () => {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) return process.env.PUPPETEER_EXECUTABLE_PATH;
  const candidatePaths = [
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/snap/bin/chromium"
  ];
  for (const p of candidatePaths) {
    if (fs.existsSync(p)) return p;
  }
  return undefined;
};

const generatePDFBuffer = async ({ studentName, courseName, date, certificateId, qrCodeBuffer }) => {
  if (!puppeteer) {
    throw new Error("Puppeteer is not available");
  }

  let qrDataUrl = '';
  if (qrCodeBuffer) {
    qrDataUrl = `data:image/png;base64,${qrCodeBuffer.toString('base64')}`;
  } else {
    try {
      const fallbackQrBuffer = await QRCode.toBuffer(`https://novaedgeacademy.in/verify/${certificateId || 'cert'}`);
      qrDataUrl = `data:image/png;base64,${fallbackQrBuffer.toString('base64')}`;
    } catch (e) {
      console.warn("Fallback QR error:", e);
    }
  }

  const htmlContent = getCertificateHTML({ studentName, courseName, date, certificateId, qrDataUrl });

  const executablePath = findChromePath();
  const launchArgs = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
  };
  if (executablePath) {
    launchArgs.executablePath = executablePath;
  }

  const browser = await puppeteer.launch(launchArgs);

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1123, height: 794, deviceScaleFactor: 2 });
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    
    await page.evaluateHandle("document.fonts.ready");

    const pdfBuffer = await page.pdf({
      width: "1123px",
      height: "794px",
      printBackground: true,
      margin: { top: "0px", right: "0px", bottom: "0px", left: "0px" },
    });
    return pdfBuffer;
  } finally {
    await browser.close();
  }
};

// ── HYBRID STREAMER (Tries Puppeteer if Chrome available, fallback to PDFKit native on Vercel) ──
const streamCertificatePDF = async (res, certificateData) => {
  try {
    // If not Vercel and Chrome binary is present, use Puppeteer
    if (!process.env.VERCEL && puppeteer && findChromePath()) {
      try {
        const pdfBuffer = await generatePDFBuffer(certificateData);
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Length", pdfBuffer.length);
        return res.end(pdfBuffer);
      } catch (puppeteerErr) {
        console.warn("Puppeteer PDF generation failed, falling back to native PDFKit:", puppeteerErr.message);
      }
    }

    // NATIVE PDFKIT STREAMING (Zero dependencies, 100% Works on Vercel Serverless & Cloud)
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename="certificate-${certificateData.certificateId || 'download'}.pdf"`);

    const doc = new PDFDocument({
      size: "A4",
      layout: "landscape",
      margin: 0,
    });

    doc.pipe(res);
    drawCertificateNativePDF(doc, certificateData);
    doc.end();
  } catch (error) {
    console.error("Stream PDF Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

const generateCertificate = async (studentName, courseName, date, certificateId, qrCodeBuffer) => {
  if (!process.env.VERCEL && puppeteer && findChromePath()) {
    try {
      const pdfBuffer = await generatePDFBuffer({ studentName, courseName, date, certificateId, qrCodeBuffer });
      const tmpDir = os.tmpdir();
      const fileName = `cert-${certificateId}.pdf`;
      const filePath = path.join(tmpDir, fileName);
      fs.writeFileSync(filePath, tmpDir, fileName);
      return filePath;
    } catch (e) {
      console.warn("Puppeteer generateCertificate failed, using PDFKit:", e.message);
    }
  }

  // Fallback to PDFKit file generation
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
      drawCertificateNativePDF(doc, { studentName, courseName, date, certificateId, qrCodeBuffer });
      doc.end();
      stream.on("finish", () => resolve(filePath));
      stream.on("error", reject);
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateCertificate;
module.exports.streamCertificatePDF = streamCertificatePDF;
