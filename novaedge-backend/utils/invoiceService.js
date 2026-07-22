const sendEmail = require("./sendEmail");

/**
 * World-Class HTML Purchase Invoice Email Template.
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
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice #${invoiceNumber} — NovaEdge Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f4f7; padding: 40px 10px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 600px; max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05);">
          
          <!-- Top Accent Line -->
          <tr>
            <td style="height: 6px; background: linear-gradient(90deg, #6366f1, #a855f7, #ec4899);"></td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 40px 24px 40px; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="left" valign="top">
                    <div style="font-size: 22px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; text-transform: uppercase;">
                      NovaEdge <span style="color: #6366f1;">Academy</span>
                    </div>
                    <div style="font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px;">
                      NovaEdge Digital Labs
                    </div>
                  </td>
                  <td align="right" valign="top">
                    <div style="font-size: 11px; font-weight: 700; color: #6366f1; letter-spacing: 1.5px; text-transform: uppercase;">
                      TAX INVOICE
                    </div>
                    <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-top: 4px; font-family: monospace;">
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

          <!-- Customer & Payment Details -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%" align="left" valign="top" style="padding-right: 12px;">
                    <div style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">
                      BILLED TO
                    </div>
                    <div style="font-size: 15px; font-weight: 700; color: #0f172a;">
                      ${studentName}
                    </div>
                    <div style="font-size: 13px; color: #475569; margin-top: 2px; word-break: break-all;">
                      ${studentEmail}
                    </div>
                  </td>
                  <td width="50%" align="right" valign="top" style="padding-left: 12px;">
                    <div style="font-size: 10px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;">
                      PAYMENT INFO
                    </div>
                    <div style="font-size: 13px; color: #334155;">
                      <span style="color: #64748b;">Transaction ID:</span><br>
                      <strong style="font-family: monospace; font-size: 12px; color: #0f172a;">${transactionId}</strong>
                    </div>
                    <div style="margin-top: 6px;">
                      <span style="display: inline-block; background-color: #dcfce7; color: #166534; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 9999px; border: 1px solid #bbf7d0;">
                        PAID &amp; COMPLETED
                      </span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Items Table -->
          <tr>
            <td style="padding: 28px 40px 10px 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th align="left" style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;">
                      DESCRIPTION
                    </th>
                    <th align="right" style="font-size: 11px; font-weight: 700; color: #64748b; letter-spacing: 1px; text-transform: uppercase; padding-bottom: 12px; border-bottom: 2px solid #e2e8f0;">
                      AMOUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td align="left" style="padding: 16px 0; border-bottom: 1px solid #f1f5f9; valign: top;">
                      <div style="font-size: 15px; font-weight: 700; color: #0f172a;">
                        ${courseTitle}
                      </div>
                      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">
                        Full Lifetime Access &bull; Interactive Lectures &bull; Verified Certificate
                      </div>
                    </td>
                    <td align="right" style="padding: 16px 0; border-bottom: 1px solid #f1f5f9; valign: top; font-family: monospace; font-size: 15px; font-weight: 700; color: #0f172a;">
                      ₹${originalPrice.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals Section -->
          <tr>
            <td style="padding: 10px 40px 32px 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="50%"></td>
                  <td width="50%" align="right">
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td align="left" style="padding: 6px 0; font-size: 13px; color: #64748b;">Subtotal:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #334155; font-family: monospace;">₹${originalPrice.toLocaleString("en-IN")}</td>
                      </tr>
                      ${discountAmount > 0 ? `
                      <tr>
                        <td align="left" style="padding: 6px 0; font-size: 13px; color: #16a34a;">Coupon (${couponCode || "DISCOUNT"}):</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #16a34a; font-family: monospace;">- ₹${discountFormatted}</td>
                      </tr>` : ""}
                      ${walletAmountUsed > 0 ? `
                      <tr>
                        <td align="left" style="padding: 6px 0; font-size: 13px; color: #2563eb;">Wallet Balance:</td>
                        <td align="right" style="padding: 6px 0; font-size: 13px; font-weight: 600; color: #2563eb; font-family: monospace;">- ₹${walletUsedFormatted}</td>
                      </tr>` : ""}
                      <tr>
                        <td colspan="2" style="padding-top: 10px;">
                          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 8px; padding: 12px 16px;">
                            <tr>
                              <td align="left" style="font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">TOTAL PAID</td>
                              <td align="right" style="font-size: 18px; font-weight: 800; color: #ffffff; font-family: monospace;">₹${paidAmountFormatted}</td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <div style="font-size: 14px; font-weight: 600; color: #334155; font-style: italic;">
                Thank you for learning with NovaEdge Academy!
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                Have questions about this invoice? Write to <a href="mailto:course@novaedgeacademy.in" style="color: #6366f1; text-decoration: none; font-weight: 600;">course@novaedgeacademy.in</a>
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
NovaEdge Academy — Official Purchase Invoice
Invoice Number: #${invoiceNumber}
Date: ${invoiceDate}

Billed To: ${studentName} (${studentEmail})
Course: ${courseTitle}
Transaction ID: ${transactionId}

Total Paid: ₹${paidAmountFormatted}

Thank you for learning with NovaEdge Academy!
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
