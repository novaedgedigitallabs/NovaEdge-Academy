const fs = require("fs");
const path = require("path");
const os = require("os");
const puppeteer = require("puppeteer");
const QRCode = require("qrcode");

const getCertificateHTML = ({ studentName, courseName, date, certificateId, qrDataUrl }) => {
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
  padding: 60px 80px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

/* SVG Guilloche Border Frame Overlay */
.border-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* Content Stack */
.content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: center;
}

/* Header */
.header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  margin-top: 10px;
}

.logo-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo-svg {
  width: 44px;
  height: 44px;
  fill: #2A134E;
}

.brand-title {
  font-weight: 900;
  font-size: 24px;
  color: #241045;
  letter-spacing: 0.22em;
  line-height: 1;
}

.brand-subtitle {
  font-weight: 600;
  font-size: 11px;
  color: #584577;
  letter-spacing: 0.38em;
  margin-top: 3px;
}

.header-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 280px;
  margin-top: 6px;
}

.divider-line {
  height: 1px;
  flex-grow: 1;
  background: linear-gradient(to right, transparent, #8E7AA8, #8E7AA8);
}
.divider-line-right {
  height: 1px;
  flex-grow: 1;
  background: linear-gradient(to left, transparent, #8E7AA8, #8E7AA8);
}

.diamond-node {
  font-size: 10px;
  color: #8E7AA8;
}

/* Title Section */
.title-section {
  margin: 6px 0;
}

.main-title {
  font-family: 'Playfair Display', 'Cinzel', Georgia, serif;
  font-weight: 900;
  font-size: 46px;
  color: #1D0C38;
  letter-spacing: -0.01em;
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

/* Ribbon Banner */
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

/* Recipient Section */
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

/* Footer Section */
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
  <!-- SVG Ornamental Guilloche Frame -->
  <svg class="border-overlay" viewBox="0 0 1123 794" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="guilloche-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
        <path d="M 0 15 C 7.5 0, 22.5 30, 30 15" fill="none" stroke="#3A1E66" stroke-width="1.2" opacity="0.85" />
        <path d="M 0 15 C 7.5 30, 22.5 0, 30 15" fill="none" stroke="#3A1E66" stroke-width="1.2" opacity="0.85" />
        <path d="M 0 7.5 C 7.5 22.5, 22.5 -7.5, 30 7.5" fill="none" stroke="#54338A" stroke-width="0.8" opacity="0.6" />
        <path d="M 0 22.5 C 7.5 37.5, 22.5 7.5, 30 22.5" fill="none" stroke="#54338A" stroke-width="0.8" opacity="0.6" />
        <path d="M 0 0 L 30 30 M 0 30 L 30 0" fill="none" stroke="#261047" stroke-width="0.4" opacity="0.3" />
      </pattern>
    </defs>
    <!-- Outer Guilloche Pattern Frame Band -->
    <rect x="16" y="16" width="1091" height="762" fill="url(#guilloche-pattern)" stroke="#261148" stroke-width="2.5" />
    <!-- Inner Ivory Paper Background Clear Out (Clears center paper) -->
    <rect x="42" y="42" width="1039" height="710" fill="#FAF8F5" stroke="#261148" stroke-width="2" />
    <!-- Double Fine Inner Lines -->
    <rect x="52" y="52" width="1019" height="690" fill="none" stroke="#381D63" stroke-width="1.5" />
    <rect x="56" y="56" width="1011" height="682" fill="none" stroke="#381D63" stroke-width="1" />
    <!-- Scalloped Corner Accents -->
    <g stroke="#381D63" fill="none">
      <path d="M 56 90 C 74 90, 90 74, 90 56" stroke-width="1.8" />
      <path d="M 56 80 C 69 80, 80 69, 80 56" stroke-width="1.2" />
      <circle cx="90" cy="56" r="2.5" fill="#381D63" />
      <circle cx="56" cy="90" r="2.5" fill="#381D63" />
    </g>
    <g stroke="#381D63" fill="none">
      <path d="M 1067 90 C 1049 90, 1033 74, 1033 56" stroke-width="1.8" />
      <path d="M 1067 80 C 1054 80, 1043 69, 1043 56" stroke-width="1.2" />
      <circle cx="1033" cy="56" r="2.5" fill="#381D63" />
      <circle cx="1067" cy="90" r="2.5" fill="#381D63" />
    </g>
    <g stroke="#381D63" fill="none">
      <path d="M 56 704 C 74 704, 90 720, 90 738" stroke-width="1.8" />
      <path d="M 56 714 C 69 714, 80 725, 80 738" stroke-width="1.2" />
      <circle cx="90" cy="738" r="2.5" fill="#381D63" />
      <circle cx="56" cy="704" r="2.5" fill="#381D63" />
    </g>
    <g stroke="#381D63" fill="none">
      <path d="M 1067 704 C 1049 704, 1033 720, 1033 738" stroke-width="1.8" />
      <path d="M 1067 714 C 1054 714, 1043 725, 1043 738" stroke-width="1.2" />
      <circle cx="1033" cy="738" r="2.5" fill="#381D63" />
      <circle cx="1067" cy="704" r="2.5" fill="#381D63" />
    </g>
  </svg>

  <div class="content">
    <!-- Header -->
    <div class="header">
      <div class="logo-row">
        <svg viewBox="0 0 100 100" class="logo-svg">
          <polygon points="50 5, 90 27.5, 90 72.5, 50 95, 10 72.5, 10 27.5" fill="none" stroke="currentColor" stroke-width="6"/>
          <path d="M 50 18 L 75 32 L 75 62 L 50 76 L 25 62 L 25 32 Z" fill="none" stroke="currentColor" stroke-width="4"/>
          <circle cx="50" cy="50" r="8"/>
          <line x1="50" y1="18" x2="50" y2="42" stroke="currentColor" stroke-width="4"/>
          <line x1="25" y1="32" x2="42" y2="42" stroke="currentColor" stroke-width="4"/>
          <line x1="75" y1="32" x2="58" y2="42" stroke="currentColor" stroke-width="4"/>
          <line x1="25" y1="62" x2="42" y2="58" stroke="currentColor" stroke-width="4"/>
          <line x1="75" y1="62" x2="58" y2="58" stroke="currentColor" stroke-width="4"/>
          <circle cx="50" cy="18" r="4"/><circle cx="25" cy="32" r="4"/><circle cx="75" cy="32" r="4"/><circle cx="25" cy="62" r="4"/><circle cx="75" cy="62" r="4"/>
        </svg>
        <div style="text-align: left;">
          <div class="brand-title">NOVAEDGE</div>
          <div class="brand-subtitle">DIGITAL LABS</div>
        </div>
      </div>
      <div class="header-divider">
        <div class="divider-line"></div>
        <span class="diamond-node">◆</span>
        <div class="divider-line-right"></div>
      </div>
    </div>

    <!-- Title -->
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

    <!-- Ribbon Banner -->
    <div class="ribbon-wrapper">
      <span class="banner-diamond">◆</span>
      <div class="ribbon-banner">${courseName ? courseName.toUpperCase() : "ADVANCED FULL STACK WEB DEVELOPMENT"}</div>
      <span class="banner-diamond">◆</span>
    </div>

    <!-- Recipient -->
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

    <!-- Footer -->
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
    
    // Wait for Google Fonts to be ready
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

const streamCertificatePDF = async (res, certificateData) => {
  try {
    const pdfBuffer = await generatePDFBuffer(certificateData);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Length", pdfBuffer.length);
    res.end(pdfBuffer);
  } catch (error) {
    console.error("Stream PDF Error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

const generateCertificate = async (studentName, courseName, date, certificateId, qrCodeBuffer) => {
  const pdfBuffer = await generatePDFBuffer({ studentName, courseName, date, certificateId, qrCodeBuffer });
  const tmpDir = os.tmpdir();
  const fileName = `cert-${certificateId}.pdf`;
  const filePath = path.join(tmpDir, fileName);
  fs.writeFileSync(filePath, pdfBuffer);
  return filePath;
};

module.exports = generateCertificate;
module.exports.streamCertificatePDF = streamCertificatePDF;
