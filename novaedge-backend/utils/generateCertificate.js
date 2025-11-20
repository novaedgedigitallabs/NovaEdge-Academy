const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

// This function returns a Promise that resolves to the file path of the new PDF
const generateCertificate = (
  studentName,
  courseName,
  date,
  certificateId,
  qrCodeBuffer
) => {
  return new Promise((resolve, reject) => {
    // 1. Create a document (Landscape A4 is standard for certs)
    const doc = new PDFDocument({ layout: "landscape", size: "A4" });

    // Define where to save the file temporarily
    // Make sure you have a "tmp" folder or change this path
    const fileName = `cert-${certificateId}.pdf`;
    const filePath = path.join(__dirname, `../tmp/${fileName}`);

    // Pipe the PDF into the file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // --- DESIGNING THE CERTIFICATE ---

    // 2. Background / Border (Simple Rectangle)
    doc
      .rect(20, 20, doc.page.width - 40, doc.page.height - 40)
      .strokeColor("#2980b9") // Blue Border
      .lineWidth(5)
      .stroke();

    // 3. Header: "Certificate of Completion"
    doc
      .font("Helvetica-Bold")
      .fontSize(30)
      .fillColor("#2c3e50")
      .text("CERTIFICATE OF COMPLETION", 0, 100, { align: "center" });

    doc.moveDown();

    // 4. "This is verified that"
    doc
      .font("Helvetica")
      .fontSize(15)
      .fillColor("black")
      .text("This is to certify that", { align: "center" });

    doc.moveDown();

    // 5. Student Name (Big and Bold)
    doc
      .font("Helvetica-Bold")
      .fontSize(40)
      .fillColor("#e74c3c") // Red/Orange color
      .text(studentName, { align: "center" });

    doc.moveDown();

    // 6. "Has successfully completed the course"
    doc
      .font("Helvetica")
      .fontSize(15)
      .fillColor("black")
      .text("Has successfully completed the course", { align: "center" });

    doc.moveDown(0.5);

    // 7. Course Name
    doc
      .font("Helvetica-Bold")
      .fontSize(25)
      .fillColor("#2980b9")
      .text(courseName, { align: "center" });

    doc.moveDown(2);

    // 8. Date & ID
    doc
      .fontSize(12)
      .fillColor("black")
      .text(`Date: ${date}`, 100, 450)
      .text(`Certificate ID: ${certificateId}`, 100, 470);

    // 9. Add the QR Code Image (Passed as a Buffer)
    // We place it in the bottom right corner
    if (qrCodeBuffer) {
      doc.image(qrCodeBuffer, doc.page.width - 150, 400, { fit: [100, 100] });
      doc.text("Scan to Verify", doc.page.width - 150, 505, {
        width: 100,
        align: "center",
      });
    }

    // 10. Finalize the PDF
    doc.end();

    // Return the file path when finished writing
    stream.on("finish", () => resolve(filePath));
    stream.on("error", (err) => reject(err));
  });
};

module.exports = generateCertificate;
