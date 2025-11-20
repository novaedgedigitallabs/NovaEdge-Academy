const QRCode = require("qrcode");

const generateQR = async (text) => {
  try {
    // 1. Convert the text (URL) into a PNG image buffer
    // We use toBuffer because PDFKit loves Buffers
    const qrImageBuffer = await QRCode.toBuffer(text, {
      width: 300, // Size of the QR Code
      margin: 2, // White space around the QR Code
      color: {
        dark: "#000000", // Black dots
        light: "#FFFFFF", // White background
      },
    });

    return qrImageBuffer;
  } catch (error) {
    console.error("QR Generation Error:", error);
    throw new Error("Failed to generate QR Code");
  }
};

module.exports = generateQR;
