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

  // 2. Main Title Section (Positioned cleanly below NovaEdge logo at Y = 175)
  doc
    .fontSize(28)
    .fillColor("#1D0C38")
    .font("Times-Bold")
    .text("Certificate of Completion", 0, 175, { align: "center" });

  doc.moveTo(centerX - 130, 210).lineTo(centerX + 130, 210).lineWidth(0.8).stroke("#52338B");
  doc.polygon([centerX - 4, 210], [centerX, 206], [centerX + 4, 210], [centerX, 214]).fill("#52338B");

  // 3. Ribbon Banner Course Title
  const bannerY = 224;
  const courseUpper = (courseName || "ADVANCED FULL STACK WEB DEVELOPMENT").toUpperCase();
  doc.font("Helvetica-Bold").fontSize(10);
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
    .fontSize(9.5)
    .fillColor("#FFFFFF")
    .font("Helvetica-Bold")
    .text(courseUpper, bannerX + 10, bannerY + 8, {
      width: bannerW - 20,
      align: "center",
      characterSpacing: 1.5
    });

  // 4. Recipient Section
  doc
    .fontSize(8.5)
    .fillColor("#6E5D87")
    .font("Helvetica-Bold")
    .text("PRESENTED TO", 0, 268, { align: "center", characterSpacing: 3 });

  doc
    .fontSize(34)
    .fillColor("#231046")
    .font("Times-BoldItalic")
    .text(studentName || "Your Name Here", 0, 282, { align: "center" });

  doc.moveTo(centerX - 160, 324).lineTo(centerX + 160, 324).lineWidth(0.75).stroke("#7E6C9E");
  doc.polygon([centerX - 3, 324], [centerX, 321], [centerX + 3, 324], [centerX, 327]).fill("#7E6C9E");

  const descText = `For successfully completing all comprehensive course modules, practical assessments, and hands-on project builds, while demonstrating solid technical skills, dedication, and a strong commitment to continuous learning throughout the ${courseName || "program"}. This certificate acknowledges the recipient's proficiency and readiness to apply these skills in real-world development environments.`;

  doc
    .fontSize(10)
    .fillColor("#3E334D")
    .font("Times-Italic")
    .text(
      descText,
      centerX - 300,
      328,
      { align: "center", width: 600, lineGap: 3 }
    );

  // 5. Footer Metadata & Verification (3 Columns Harmoniously Aligned)
  const footerY = H - 122;

  doc.save();
  doc.dash(3, { space: 3 });
  doc.moveTo(270, footerY - 12).lineTo(270, H - 24).lineWidth(0.75).stroke("#CBBEE0");
  doc.moveTo(560, footerY - 12).lineTo(560, H - 24).lineWidth(0.75).stroke("#CBBEE0");
  doc.restore();

  // Column 1 (Left - Issue Date & Cert ID):
  const col1X = 65;
  doc.roundedRect(col1X, footerY - 6, 22, 22, 4).fill("#381F66");
  doc.rect(col1X + 5, footerY - 1, 12, 12).lineWidth(1).stroke("#FFFFFF");
  doc.rect(col1X + 5, footerY - 1, 12, 3.5).fill("#FFFFFF");
  doc.circle(col1X + 8.5, footerY + 5.5, 0.8).fill("#FFFFFF");
  doc.circle(col1X + 13.5, footerY + 5.5, 0.8).fill("#FFFFFF");
  doc.circle(col1X + 8.5, footerY + 8.5, 0.8).fill("#FFFFFF");
  doc.circle(col1X + 13.5, footerY + 8.5, 0.8).fill("#FFFFFF");

  doc
    .fontSize(8)
    .fillColor("#6B5A86")
    .font("Helvetica-Bold")
    .text("ISSUE DATE", col1X + 30, footerY - 6, { characterSpacing: 1.5 });
  doc
    .fontSize(10)
    .fillColor("#231046")
    .font("Helvetica-Bold")
    .text(date, col1X + 30, footerY + 4);

  doc.moveTo(col1X, footerY + 22).lineTo(col1X + 180, footerY + 22).lineWidth(0.5).stroke("#E5DDEE");

  doc.roundedRect(col1X, footerY + 28, 22, 22, 4).fill("#381F66");
  doc.save();
  doc.path(`M ${col1X + 11} ${footerY + 32} L ${col1X + 17} ${footerY + 35} L ${col1X + 17} ${footerY + 41} C ${col1X + 17} ${footerY + 45}, ${col1X + 11} ${footerY + 47}, ${col1X + 11} ${footerY + 47} C ${col1X + 11} ${footerY + 47}, ${col1X + 5} ${footerY + 45}, ${col1X + 5} ${footerY + 41} L ${col1X + 5} ${footerY + 35} Z`).fill("#FFFFFF");
  doc.restore();

  doc
    .fontSize(8)
    .fillColor("#6B5A86")
    .font("Helvetica-Bold")
    .text("CERTIFICATE ID", col1X + 30, footerY + 28, { characterSpacing: 1.5 });
  doc
    .fontSize(9)
    .fillColor("#231046")
    .font("Helvetica-Bold")
    .text(certificateId, col1X + 30, footerY + 38);

  // Column 2 (Center - QR Code & Caption):
  if (qrCodeBuffer) {
    const qrSize = 50;
    const qrX = centerX - qrSize / 2;
    const qrY = footerY - 10;

    doc.roundedRect(qrX - 3, qrY - 3, qrSize + 6, qrSize + 6, 5).lineWidth(1.2).stroke("#381F66");
    doc.image(qrCodeBuffer, qrX, qrY, { width: qrSize, height: qrSize });

    // Perfectly Centered Caption Text Box
    doc
      .fontSize(8)
      .fillColor("#231046")
      .font("Helvetica-Bold")
      .text("SCAN TO VERIFY", centerX - 140, qrY + qrSize + 6, { width: 280, align: "center", characterSpacing: 1.2 });
    doc
      .fontSize(7)
      .fillColor("#6E6184")
      .font("Helvetica")
      .text("Authenticity of this certificate", centerX - 140, qrY + qrSize + 18, { width: 280, align: "center" });
  }

  // Column 3 (Right - Founder Signature):
  const sigX = 570;
  const sigW = 200;

  const sigImgPath = path.join(__dirname, "../templates/founder_sign.png");
  const fallbackSigImgPath = path.join(__dirname, "../founder_sign.png");
  const actualSig = fs.existsSync(sigImgPath) ? sigImgPath : (fs.existsSync(fallbackSigImgPath) ? fallbackSigImgPath : null);

  if (actualSig) {
    doc.image(actualSig, sigX + 35, footerY - 18, { fit: [130, 36], align: "center" });
  } else {
    doc
      .fontSize(20)
      .fillColor("#1F0E3D")
      .font("Times-BoldItalic")
      .text("Amit Raikwar", sigX, footerY - 4, { width: sigW, align: "center" });
  }

  doc.moveTo(sigX + 25, footerY + 22).lineTo(sigX + sigW - 25, footerY + 22).lineWidth(1.2).stroke("#2C164D");

  doc
    .fontSize(9)
    .fillColor("#1F0E3D")
    .font("Helvetica-Bold")
    .text("AMIT KUMAR RAIKWAR", sigX, footerY + 26, { width: sigW, align: "center", characterSpacing: 1 });

  doc
    .fontSize(7.5)
    .fillColor("#64537E")
    .font("Helvetica-Bold")
    .text("FOUNDER & CEO", sigX, footerY + 37, { width: sigW, align: "center", characterSpacing: 1.2 });

  doc
    .fontSize(7.5)
    .fillColor("#64537E")
    .font("Helvetica")
    .text("NovaEdge Digital Labs", sigX, footerY + 47, { width: sigW, align: "center" });
};

// ── PUPPETEER HTML RRENDERER (Used when Chromium binary is present) ─────────────────
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

  let sigDataUrl = '';
  try {
    const sigPath = path.join(__dirname, "../templates/founder_sign.png");
    const fallbackSigPath = path.join(__dirname, "../founder_sign.png");
    const actualSig = fs.existsSync(sigPath) ? sigPath : (fs.existsSync(fallbackSigPath) ? fallbackSigPath : null);
    if (actualSig) {
      const fileData = fs.readFileSync(actualSig);
      sigDataUrl = `data:image/png;base64,${fileData.toString("base64")}`;
    }
  } catch (e) {
    console.warn("Could not read signature image for base64 HTML:", e);
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
  padding: 40px 70px;
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
  padding-top: 180px;
  padding-bottom: 20px;
}

.title-section {
  margin: 2px 0;
}

.main-title {
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-weight: 900;
  font-size: 38px;
  color: #1D0C38;
  letter-spacing: -0.01em;
  text-transform: uppercase;
}

.flourish-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 4px;
}

.flourish-line {
  height: 1px;
  width: 130px;
  background-color: #A393BD;
}

.ribbon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 4px 0;
}

.ribbon-banner {
  background-color: #1F0E3D;
  color: #FFFFFF;
  padding: 9px 44px;
  clip-path: polygon(0% 0%, 100% 0%, 96.5% 50%, 100% 100%, 0% 100%, 3.5% 50%);
  font-weight: 800;
  font-size: 13.5px;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.banner-diamond {
  color: #2B1450;
  font-size: 12px;
}

.recipient-section {
  margin: 4px 0;
}

.presented-to {
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 0.25em;
  color: #6E5D87;
  text-transform: uppercase;
}

.student-name {
  font-family: 'Great Vibes', 'Alex Brush', cursive;
  font-size: 52px;
  color: #231046;
  font-weight: 400;
  line-height: 1.15;
  margin: 2px 0;
}

.name-underline {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 360px;
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
  max-width: 680px;
  margin: 6px auto 0;
  line-height: 1.45;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  padding-top: 10px;
  margin-bottom: 5px;
}

.footer-col {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
}

.col-left {
  text-align: left;
  border-right: 1px dashed #CBBEE0;
  padding-right: 20px;
  gap: 10px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.meta-icon-box {
  width: 30px;
  height: 30px;
  border-radius: 6px;
  background-color: #381F66;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.meta-icon-box svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 2;
}

.meta-label {
  font-weight: 800;
  font-size: 8.5px;
  letter-spacing: 0.14em;
  color: #6B5A86;
  text-transform: uppercase;
  display: block;
}

.meta-value {
  font-weight: 700;
  font-size: 12px;
  color: #231046;
  display: block;
}

.meta-divider {
  height: 1px;
  background-color: #E5DDEE;
  width: 100%;
}

.col-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-right: 1px dashed #CBBEE0;
  padding: 0 10px;
}

.qr-frame {
  padding: 5px;
  background: white;
  border: 1.5px solid #381F66;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.06);
  margin: 0 auto;
}

.qr-img {
  width: 60px;
  height: 60px;
  display: block;
}

.qr-text-top {
  font-weight: 900;
  font-size: 9px;
  color: #231046;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 5px;
  margin-bottom: 2px;
  text-align: center;
  width: 100%;
}

.qr-text-sub {
  font-size: 8px;
  color: #6E6184;
  margin-top: 2px;
  line-height: 1.2;
  text-align: center;
  width: 100%;
}

.col-right {
  align-items: center;
  justify-content: center;
  text-align: center;
  padding-left: 20px;
}

.sig-img {
  height: 38px;
  max-width: 135px;
  object-fit: contain;
  mix-blend-mode: multiply;
  display: block;
  margin: 0 auto -2px auto;
}

.signature-text {
  font-family: 'Great Vibes', 'Alex Brush', cursive;
  font-size: 34px;
  color: #1F0E3D;
  line-height: 1;
}

.signature-line {
  height: 1.5px;
  width: 150px;
  background-color: #2C164D;
  margin: 3px auto 4px;
}

.sig-name {
  font-weight: 900;
  font-size: 11.5px;
  color: #1F0E3D;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.sig-role {
  font-weight: 700;
  font-size: 9px;
  color: #64537E;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-top: 1px;
}

.sig-org {
  font-size: 9px;
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
        <svg style="width: 18px; height: 18px; color: #4E3773; fill: currentColor;" viewBox="0 0 24 24">
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
      <p class="citation-text">For successfully completing all comprehensive course modules, practical assessments, and hands-on project builds, while demonstrating solid technical skills, dedication, and a strong commitment to continuous learning throughout the ${courseName || "program"}. This certificate acknowledges the recipient's proficiency and readiness to apply these skills in real-world development environments.</p>
    </div>

    <div class="footer-grid">
      <div class="footer-col col-left">
        <div class="meta-item">
          <div class="meta-icon-box">
            <svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" ry="2" fill="none" stroke="currentColor" stroke-width="2"></rect><line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" stroke-width="2"></line><line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" stroke-width="2"></line><line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" stroke-width="2"></line></svg>
          </div>
          <div>
            <span class="meta-label">ISSUE DATE</span>
            <span class="meta-value">${date}</span>
          </div>
        </div>
        <div class="meta-divider"></div>
        <div class="meta-item">
          <div class="meta-icon-box">
            <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="none" stroke="currentColor" stroke-width="2"></path></svg>
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
        ${sigDataUrl ? `<img src="${sigDataUrl}" class="sig-img" />` : `<div class="signature-text">Amit Raikwar</div>`}
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
