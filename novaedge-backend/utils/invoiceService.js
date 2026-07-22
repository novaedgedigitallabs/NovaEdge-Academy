const sendEmail = require("./sendEmail");

/**
 * Humanized & Clean Purchase Invoice Email Template with Official Header Logo.
 * Uses robust table layouts & explicit inline styles for 100% pixel-perfect rendering in Gmail/Outlook.
 * Dispatches to user email with CC to course@novaedgeacademy.in
 */
exports.sendPurchaseInvoiceEmail = async ({ user, course, payment, amountPaid, walletAmountUsed = 0, discountAmount = 0, couponCode = "" }) => {
  try {
    if (!user || !user.email) return;

    const invoiceNumber = `INV-${payment?._id?.toString().slice(-6).toUpperCase() || Date.now().toString().slice(-6)}`;
    const invoiceDate = new Date().toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const studentName = user.name || "Student";
    const studentEmail = user.email;
    const courseTitle = course?.title || "NovaEdge Course Enrollment";
    const originalPrice = course?.price ?? amountPaid;
    const paidAmountFormatted = (amountPaid || 0).toLocaleString("en-IN");
    const walletUsedFormatted = (walletAmountUsed || 0).toLocaleString("en-IN");
    const discountFormatted = (discountAmount || 0).toLocaleString("en-IN");
    const transactionId = payment?.razorpay_payment_id || payment?._id || `TXN-${Date.now()}`;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoiceNumber} — NovaEdge Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 600px; max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 32px 36px 24px 36px; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" valign="middle">
                    <img src="https://www.novaedgeacademy.in/Header_logo.webp" alt="NovaEdge Academy" width="160" style="display: block; border: 0; outline: none; max-width: 160px; height: auto;" />
                    <div style="font-size: 11px; color: #64748b; margin-top: 6px;">
                      NovaEdge Digital Labs
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <div style="font-size: 11px; font-weight: 700; color: #475569; letter-spacing: 1px; text-transform: uppercase;">
                      INVOICE
                    </div>
                    <div style="font-size: 15px; font-weight: 700; color: #0f172a; margin-top: 4px; font-family: monospace;">
                      #${invoiceNumber}
                    </div>
                    <div style="font-size: 12px; color: #64748b; margin-top: 2px;">
                      ${invoiceDate}
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Billed To & Payment Summary -->
          <tr>
            <td style="padding: 24px 36px; background-color: #f8fafc; border-bottom: 1px solid #e2e8f0;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" align="left" valign="top" style="padding-right: 12px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Billed To
                    </div>
                    <div style="font-size: 15px; font-weight: 600; color: #0f172a;">
                      ${studentName}
                    </div>
                    <div style="font-size: 13px; color: #475569; margin-top: 2px; word-break: break-all;">
                      ${studentEmail}
                    </div>
                  </td>
                  <td width="50%" align="right" valign="top" style="padding-left: 12px;">
                    <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Payment Details
                    </div>
                    <div style="font-size: 13px; color: #334155;">
                      Transaction ID: <span style="font-family: monospace; font-size: 12px; color: #0f172a; font-weight: 600;">${transactionId}</span>
                    </div>
                    <div style="font-size: 13px; color: #166534; font-weight: 600; margin-top: 4px;">
                      Status: Paid
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 28px 36px 12px 36px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th align="left" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 10px; border-bottom: 1px solid #0f172a;">
                      Course Item
                    </th>
                    <th align="right" style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; padding-bottom: 10px; border-bottom: 1px solid #0f172a;">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td align="left" style="padding: 16px 0; border-bottom: 1px solid #e2e8f0; valign: top;">
                      <div style="font-size: 15px; font-weight: 600; color: #0f172a;">
                        ${courseTitle}
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
                        Lifetime Course Access and Completion Certificate
                      </div>
                    </td>
                    <td align="right" style="padding: 16px 0; border-bottom: 1px solid #e2e8f0; valign: top; font-family: monospace; font-size: 15px; font-weight: 600; color: #0f172a;">
                      ₹${originalPrice.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 8px 36px 32px 36px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%"></td>
                  <td width="50%" align="right">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left" style="padding: 6px 0; font-size: 13px; color: #64748b;">Subtotal</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #0f172a; font-family: monospace;">₹${originalPrice.toLocaleString("en-IN")}</td>
                      </tr>
                      ${discountAmount > 0 ? `
                      <tr>
                        <td align="left" style="padding: 6px 0; font-size: 13px; color: #64748b;">Discount (${couponCode || "PROMO"})</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #0f172a; font-family: monospace;">- ₹${discountFormatted}</td>
                      </tr>` : ""}
                      ${walletAmountUsed > 0 ? `
                      <tr>
                        <td align="left" style="padding: 6px 0; font-size: 13px; color: #64748b;">Wallet Credit</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #0f172a; font-family: monospace;">- ₹${walletUsedFormatted}</td>
                      </tr>` : ""}
                      <tr>
                        <td align="left" style="padding: 12px 0 0 0; font-size: 14px; font-weight: 700; color: #0f172a; border-top: 1px solid #0f172a;">Total Paid</td>
                        <td align="right" style="padding: 12px 0 0 0; font-size: 18px; font-weight: 700; color: #0f172a; border-top: 1px solid #0f172a; font-family: monospace;">₹${paidAmountFormatted}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 13px; color: #334155;">
                Thank you for learning with NovaEdge Academy.
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                If you have any questions about this invoice, please write to <a href="mailto:course@novaedgeacademy.in" style="color: #0f172a; font-weight: 600; text-decoration: underline;">course@novaedgeacademy.in</a>
              </div>
              <div style="font-size: 10px; font-weight: 600; color: #94a3b8; letter-spacing: 0.5px; text-transform: uppercase; margin-top: 16px;">
                NOVAEDGE DIGITAL LABS &copy; ${new Date().getFullYear()} NOVAEDGE ACADEMY &bull; ALL RIGHTS RESERVED
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const plainText = `
NovaEdge Academy — Purchase Invoice
Invoice Number: #${invoiceNumber}
Date: ${invoiceDate}

Billed To: ${studentName} (${studentEmail})
Course: ${courseTitle}
Transaction ID: ${transactionId}

Total Paid: ₹${paidAmountFormatted}

Thank you for learning with NovaEdge Academy.
Questions? Contact: course@novaedgeacademy.in
    `.trim();

    await sendEmail({
      email: studentEmail,
      cc: "course@novaedgeacademy.in",
      subject: `Invoice #${invoiceNumber} — NovaEdge Academy`,
      message: plainText,
      html: htmlContent,
    });

    console.log(`Purchase invoice #${invoiceNumber} sent successfully to ${studentEmail} (CC: course@novaedgeacademy.in)`);
  } catch (err) {
    console.error("Failed to send purchase invoice email:", err.message);
  }
};
