const sendEmail = require("./sendEmail");

/**
 * Generate and send purchase invoice email to user with CC to course@novaedgeacademy.in
 */
exports.sendPurchaseInvoiceEmail = async ({ user, course, payment, amountPaid, walletAmountUsed = 0, discountAmount = 0, couponCode = "" }) => {
  try {
    if (!user || !user.email) return;

    const invoiceNumber = `INV-${payment?._id?.toString().slice(-6).toUpperCase() || Date.now().toString().slice(-6)}`;
    const invoiceDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const studentName = user.name || "Valued Student";
    const studentEmail = user.email;
    const courseTitle = course?.title || "NovaEdge Course Enrollment";
    const originalPrice = course?.price ?? amountPaid;
    const paidAmountFormatted = (amountPaid || 0).toLocaleString("en-IN");
    const walletUsedFormatted = (walletAmountUsed || 0).toLocaleString("en-IN");
    const discountFormatted = (discountAmount || 0).toLocaleString("en-IN");
    const transactionId = payment?.razorpay_payment_id || payment?._id || `TXN-${Date.now()}`;

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #09090b; color: #e4e4e7; margin: 0; padding: 20px; }
        .invoice-box { max-width: 650px; margin: auto; padding: 30px; border: 1px solid #27272a; background-color: #18181b; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #3f3f46; padding-bottom: 20px; margin-bottom: 20px; }
        .logo-title { font-size: 22px; font-weight: bold; color: #a855f7; text-transform: uppercase; letter-spacing: 1px; }
        .invoice-title { font-size: 28px; font-weight: bold; color: #ffffff; text-align: right; }
        .badge { background: rgba(168, 85, 247, 0.15); color: #c084fc; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: bold; border: 1px solid rgba(168, 85, 247, 0.3); }
        .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; font-size: 14px; }
        .details-block h4 { margin: 0 0 6px 0; color: #a1a1aa; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
        .details-block p { margin: 0; color: #ffffff; font-weight: 500; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
        .table th { background-color: #27272a; color: #a1a1aa; text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; }
        .table td { padding: 14px 16px; border-bottom: 1px solid #27272a; color: #ffffff; font-size: 14px; }
        .totals { margin-left: auto; width: 260px; font-size: 14px; }
        .totals-row { display: flex; justify-content: space-between; padding: 6px 0; color: #a1a1aa; }
        .totals-row.final { border-top: 2px solid #3f3f46; color: #ffffff; font-weight: bold; font-size: 18px; padding-top: 12px; margin-top: 6px; }
        .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #27272a; color: #71717a; font-size: 12px; }
        .footer a { color: #c084fc; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="invoice-box">
        <div class="header">
          <div>
            <div class="logo-title">NovaEdge Academy</div>
            <p style="margin: 4px 0 0 0; color: #a1a1aa; font-size: 12px;">NovaEdge Digital Labs</p>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <p style="margin: 4px 0 0 0; color: #a1a1aa; font-size: 12px; text-align: right;">#${invoiceNumber}</p>
          </div>
        </div>

        <div class="details-grid">
          <div class="details-block">
            <h4>Billed To</h4>
            <p style="font-size: 16px; color: #ffffff; font-weight: bold;">${studentName}</p>
            <p style="color: #a1a1aa; font-size: 13px;">${studentEmail}</p>
          </div>
          <div class="details-block" style="text-align: right;">
            <h4>Invoice Details</h4>
            <p>Date: <span style="color: #a1a1aa;">${invoiceDate}</span></p>
            <p>Transaction ID: <span style="color: #a1a1aa; font-size: 12px;">${transactionId}</span></p>
            <p style="margin-top: 6px;"><span class="badge">Payment Successful</span></p>
          </div>
        </div>

        <table class="table">
          <thead>
            <tr>
              <th>Course Item</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <strong style="color: #ffffff; font-size: 15px;">${courseTitle}</strong>
                <p style="margin: 4px 0 0 0; color: #a1a1aa; font-size: 12px;">Full Lifetime Access + Verified Certificate</p>
              </td>
              <td style="text-align: right; font-weight: bold;">₹${originalPrice.toLocaleString("en-IN")}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>₹${originalPrice.toLocaleString("en-IN")}</span>
          </div>
          ${discountAmount > 0 ? `
          <div class="totals-row" style="color: #4ade80;">
            <span>Coupon Discount (${couponCode || "PROMO"}):</span>
            <span>- ₹${discountFormatted}</span>
          </div>` : ""}
          ${walletAmountUsed > 0 ? `
          <div class="totals-row" style="color: #38bdf8;">
            <span>Wallet Credit Used:</span>
            <span>- ₹${walletUsedFormatted}</span>
          </div>` : ""}
          <div class="totals-row final">
            <span>Total Paid:</span>
            <span style="color: #c084fc;">₹${paidAmountFormatted}</span>
          </div>
        </div>

        <div class="footer">
          <p>Thank you for learning with <strong>NovaEdge Academy</strong>!</p>
          <p>Questions about this invoice? Contact us at <a href="mailto:course@novaedgeacademy.in">course@novaedgeacademy.in</a></p>
          <p style="margin-top: 8px; font-size: 11px;">NovaEdge Digital Labs &copy; ${new Date().getFullYear()} NovaEdge Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const plainText = `
NovaEdge Academy - Official Purchase Invoice
Invoice Number: ${invoiceNumber}
Date: ${invoiceDate}

Billed To: ${studentName} (${studentEmail})
Course: ${courseTitle}
Transaction ID: ${transactionId}

Amount Paid: ₹${paidAmountFormatted}
Status: Completed

Thank you for choosing NovaEdge Academy!
Need help? Contact: course@novaedgeacademy.in
    `.trim();

    await sendEmail({
      email: studentEmail,
      cc: "course@novaedgeacademy.in",
      subject: `Invoice #${invoiceNumber} - NovaEdge Academy Course Purchase`,
      message: plainText,
      html: htmlContent,
    });

    console.log(`Purchase invoice #${invoiceNumber} sent successfully to ${studentEmail} (CC: course@novaedgeacademy.in)`);
  } catch (err) {
    console.error("Failed to send purchase invoice email:", err.message);
  }
};
