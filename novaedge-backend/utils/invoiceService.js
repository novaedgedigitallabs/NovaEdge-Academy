const sendEmail = require("./sendEmail");

/**
 * Generate and send purchase invoice email using NovaEdge custom invoice template (seal removed).
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
<title>Invoice #${invoiceNumber} — NovaEdge Academy</title>
<style>
  :root{
    --ink:#14172B;
    --ink-soft:#4B4F63;
    --paper:#FBFAF8;
    --card:#FFFFFF;
    --rule:#DEDCD5;
    --rule-soft:#EDEBE5;
    --accent:#2748C4;
    --accent-soft:#EEF1FC;
    --mono: 'SF Mono','Roboto Mono','Courier New',monospace;
    --serif: Georgia,'Iowan Old Style','Times New Roman',serif;
    --sans: -apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;
  }
  *{margin:0;padding:0;box-sizing:border-box;}
  html,body{height:100%;}
  body{
    font-family:var(--sans);
    background:
      radial-gradient(circle at 1px 1px, rgba(20,23,43,0.05) 1px, transparent 0) 0 0/22px 22px,
      var(--paper);
    color:var(--ink);
    padding:48px 16px;
    -webkit-font-smoothing:antialiased;
  }

  .sheet{
    max-width:680px;
    margin:0 auto;
    background:var(--card);
    border:1px solid var(--rule);
    position:relative;
    box-shadow:0 1px 2px rgba(20,23,43,0.04), 0 12px 32px -16px rgba(20,23,43,0.18);
  }

  /* Letterhead */
  .letterhead{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    padding:38px 44px 26px;
  }
  .wordmark h1{
    font-family:var(--serif);
    font-size:26px;
    font-weight:400;
    letter-spacing:-0.01em;
    color:var(--ink);
  }
  .wordmark p{
    font-family:var(--mono);
    font-size:10.5px;
    letter-spacing:0.14em;
    text-transform:uppercase;
    color:var(--ink-soft);
    margin-top:6px;
  }
  .meta{ text-align:right; }
  .meta .eyebrow{
    font-family:var(--mono);
    font-size:10px;
    letter-spacing:0.16em;
    text-transform:uppercase;
    color:var(--ink-soft);
  }
  .meta .num{
    font-family:var(--mono);
    font-size:16px;
    font-weight:700;
    color:var(--ink);
    margin-top:4px;
  }
  .meta .date{
    font-family:var(--mono);
    font-size:11.5px;
    color:var(--ink-soft);
    margin-top:8px;
  }

  .rule{
    height:1px;
    background:var(--rule);
    margin:0 44px;
  }

  /* Body */
  .body{ padding:30px 44px 8px; }

  .cols{
    display:flex;
    gap:32px;
    flex-wrap:wrap;
    padding-bottom:26px;
    border-bottom:1px solid var(--rule-soft);
  }
  .cols .col{ flex:1; min-width:200px; }
  .eyebrow-lbl{
    font-family:var(--mono);
    font-size:10px;
    letter-spacing:0.14em;
    text-transform:uppercase;
    color:var(--ink-soft);
    margin-bottom:9px;
  }
  .cols .name{
    font-size:15px;
    font-weight:600;
    color:var(--ink);
    margin-bottom:3px;
  }
  .cols .sub{
    font-size:13.5px;
    color:var(--ink-soft);
  }
  .cols .kv{ font-size:13.5px; line-height:1.9; }
  .cols .kv b{ color:var(--ink); font-weight:600; }

  table{ width:100%; border-collapse:collapse; margin-top:26px; }
  thead th{
    text-align:left;
    font-family:var(--mono);
    font-size:10px;
    letter-spacing:0.14em;
    text-transform:uppercase;
    color:var(--ink-soft);
    padding-bottom:12px;
    border-bottom:1px solid var(--ink);
  }
  thead th.r{ text-align:right; }
  tbody td{
    padding:20px 0;
    border-bottom:1px solid var(--rule-soft);
    vertical-align:top;
  }
  .item-title{ font-size:15px; font-weight:600; color:var(--ink); }
  .item-sub{ font-size:12.5px; color:var(--ink-soft); margin-top:5px; }
  .amt{
    text-align:right;
    font-family:var(--mono);
    font-size:14.5px;
    font-weight:600;
    color:var(--ink);
    white-space:nowrap;
  }

  .totals{ display:flex; justify-content:flex-end; padding:22px 0 6px; }
  .totals-box{ width:260px; }
  .trow{
    display:flex;
    justify-content:space-between;
    font-size:13.5px;
    color:var(--ink-soft);
    padding:6px 0;
  }
  .trow .v{ font-family:var(--mono); color:var(--ink); }
  .grand{
    margin-top:10px;
    background:var(--ink);
    color:var(--paper);
    padding:14px 16px;
    display:flex;
    justify-content:space-between;
    align-items:center;
  }
  .grand .lbl{ font-family:var(--mono); font-size:10.5px; letter-spacing:0.12em; text-transform:uppercase; opacity:0.75; }
  .grand .val{ font-family:var(--mono); font-size:18px; font-weight:700; }

  /* Footer */
  .footer{
    padding:28px 44px 34px;
    text-align:center;
  }
  .footer .thanks{
    font-family:var(--serif);
    font-size:15px;
    font-style:italic;
    color:var(--ink);
    margin-bottom:10px;
  }
  .footer .contact{ font-size:12.5px; color:var(--ink-soft); }
  .footer .contact a{ color:var(--accent); text-decoration:none; font-weight:600; }
  .footer .copyright{
    font-family:var(--mono);
    font-size:10px;
    letter-spacing:0.06em;
    color:#A9A6A0;
    margin-top:18px;
  }

  @media (max-width:520px){
    .letterhead, .body, .footer{ padding-left:22px; padding-right:22px; }
    .letterhead{ flex-direction:column; gap:18px; }
    .meta{ text-align:left; }
    .rule{ margin:0 22px; }
  }
</style>
</head>
<body>

  <div class="sheet" id="invoice">
    <div class="letterhead">
      <div class="wordmark">
        <h1>NovaEdge Academy</h1>
        <p>NovaEdge Digital Labs</p>
      </div>
      <div class="meta">
        <div class="eyebrow">Invoice</div>
        <div class="num">#${invoiceNumber}</div>
        <div class="date">${invoiceDate}</div>
      </div>
    </div>
    <div class="rule"></div>

    <div class="body">
      <div class="cols">
        <div class="col">
          <div class="eyebrow-lbl">Billed To</div>
          <div class="name">${studentName}</div>
          <div class="sub">${studentEmail}</div>
        </div>
        <div class="col">
          <div class="eyebrow-lbl">Payment</div>
          <div class="kv">
            <b>Transaction ID</b><br>${transactionId}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Course Item</th>
            <th class="r">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <div class="item-title">${courseTitle}</div>
              <div class="item-sub">Full Lifetime Access + Verified Certificate</div>
            </td>
            <td class="amt">₹${originalPrice.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>

      <div class="totals">
        <div class="totals-box">
          <div class="trow"><span>Subtotal</span><span class="v">₹${originalPrice.toLocaleString("en-IN")}</span></div>
          ${discountAmount > 0 ? `<div class="trow"><span>Discount (${couponCode || "PROMO"})</span><span class="v">- ₹${discountFormatted}</span></div>` : ""}
          ${walletAmountUsed > 0 ? `<div class="trow"><span>Wallet Credit</span><span class="v">- ₹${walletUsedFormatted}</span></div>` : ""}
          <div class="grand">
            <span class="lbl">Total Paid</span>
            <span class="val">₹${paidAmountFormatted}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="rule"></div>
    <div class="footer">
      <p class="thanks">Thank you for learning with NovaEdge Academy.</p>
      <p class="contact">Questions about this invoice? Write to <a href="mailto:course@novaedgeacademy.in">course@novaedgeacademy.in</a></p>
      <p class="copyright">NOVAEDGE DIGITAL LABS &copy; ${new Date().getFullYear()} NOVAEDGE ACADEMY — ALL RIGHTS RESERVED</p>
    </div>
  </div>

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

Subtotal: ₹${originalPrice.toLocaleString("en-IN")}
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
