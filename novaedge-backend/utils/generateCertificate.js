const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// This function returns a Promise that resolves to the file path of the new PDF
const generateCertificate = async (
  studentName,
  courseName,
  date,
  certificateId,
  qrCodeBuffer
) => {
  try {
    // 1. Read the HTML Template
    const templatePath = path.join(__dirname, "../templates/certificate.html");
    const templateHtml = fs.readFileSync(templatePath, "utf8");

    // 2. Compile Template with Handlebars
    const template = handlebars.compile(templateHtml);

    // Convert QR Buffer to Data URI
    const qrDataUri = `data:image/png;base64,${qrCodeBuffer.toString("base64")}`;

    const html = template({
      userName: studentName,
      courseTitle: courseName,
      issuedAt: date,
      certNumber: certificateId,
      qrDataUri: qrDataUri,
      // signatureImageUrl: "..." // Add signature logic later if needed
    });

    // 3. Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"], // Required for some server environments
    });
    const page = await browser.newPage();
    await page.setViewport({ width: 1123, height: 794 });

    // 4. Set Content and Wait for Load
    await page.setContent(html, { waitUntil: "networkidle0" });

    // 5. Generate PDF
    const fileName = `cert-${certificateId}.pdf`;
    const filePath = path.join(__dirname, `../tmp/${fileName}`);

    await page.pdf({
      path: filePath,
      format: "A4",
      landscape: true,
      printBackground: true,
    });

    await browser.close();

    return filePath;
  } catch (error) {
    console.error("Error generating certificate PDF:", error);
    throw error;
  }
};

module.exports = generateCertificate;
