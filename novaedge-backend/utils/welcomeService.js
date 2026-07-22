const sendEmail = require("./sendEmail");

/**
 * Send Welcome Email using NovaEdge custom letterhead HTML template.
 * Dispatches to user email with CC to course@novaedgeacademy.in
 */
exports.sendWelcomeEmail = async ({ name, email }) => {
  try {
    if (!email) return;

    const studentName = name || "Valued Student";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Welcome to NovaEdge Academy</title>
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
    max-width:640px;
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

  .rule{ height:1px; background:var(--rule); margin:0 44px; }

  /* Hero */
  .hero{ padding:34px 44px 6px; }
  .eyebrow-lbl{
    font-family:var(--mono);
    font-size:10px;
    letter-spacing:0.16em;
    text-transform:uppercase;
    color:var(--accent);
    margin-bottom:12px;
  }
  .hero h2{
    font-family:var(--serif);
    font-size:28px;
    font-weight:400;
    line-height:1.3;
    color:var(--ink);
    letter-spacing:-0.01em;
  }
  .hero h2 .name{ color:var(--accent); font-style:italic; }
  .hero p.lead{
    margin-top:14px;
    font-size:14.5px;
    line-height:1.7;
    color:var(--ink-soft);
    max-width:480px;
  }

  /* Steps */
  .steps{ padding:28px 44px 8px; }
  .steps .eyebrow-lbl{ color:var(--ink-soft); }
  .step-row{
    display:flex;
    gap:18px;
    padding:16px 0;
    border-bottom:1px solid var(--rule-soft);
  }
  .step-row:last-child{ border-bottom:none; }
  .step-num{
    font-family:var(--mono);
    font-size:12px;
    font-weight:700;
    color:var(--accent);
    min-width:22px;
    padding-top:2px;
  }
  .step-body .t{
    font-size:14.5px;
    font-weight:600;
    color:var(--ink);
    margin-bottom:3px;
  }
  .step-body .d{
    font-size:13px;
    color:var(--ink-soft);
    line-height:1.6;
  }

  /* CTA */
  .cta-wrap{ padding:30px 44px 8px; text-align:center; }
  .cta{
    display:inline-block;
    background:var(--ink);
    color:var(--paper);
    text-decoration:none;
    font-size:13.5px;
    font-weight:600;
    letter-spacing:0.01em;
    padding:13px 30px;
  }
  .cta:hover{ background:var(--accent); }

  /* Footer */
  .footer{ padding:30px 44px 34px; text-align:center; }
  .footer .thanks{
    font-family:var(--serif);
    font-size:14.5px;
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
    .letterhead,.hero,.steps,.cta-wrap,.footer{ padding-left:22px; padding-right:22px; }
    .rule{ margin:0 22px; }
  }
</style>
</head>
<body>

  <div class="sheet">
    <div class="letterhead">
      <div class="wordmark">
        <h1>NovaEdge Academy</h1>
        <p>NovaEdge Digital Labs</p>
      </div>
    </div>
    <div class="rule"></div>

    <div class="hero">
      <div class="eyebrow-lbl">Official Welcome</div>
      <h2>Welcome aboard, <span class="name">${studentName}</span>.</h2>
      <p class="lead">We're delighted to welcome you to NovaEdge Academy. Your journey toward mastering next-generation skills starts right now.</p>
    </div>

    <div class="steps">
      <div class="eyebrow-lbl">Getting Started</div>

      <div class="step-row">
        <div class="step-num">01</div>
        <div class="step-body">
          <div class="t">Access Your Dashboard</div>
          <div class="d">Track your enrolled courses, streak progress, and learning achievements in one place.</div>
        </div>
      </div>

      <div class="step-row">
        <div class="step-num">02</div>
        <div class="step-body">
          <div class="t">Interactive Lectures & Practice</div>
          <div class="d">Watch HD video lectures, solve quizzes, and practice real-world coding assignments.</div>
        </div>
      </div>

      <div class="step-row">
        <div class="step-num">03</div>
        <div class="step-body">
          <div class="t">Earn Verified Certificates</div>
          <div class="d">Complete courses to earn industry-standard certificates ready to share on LinkedIn.</div>
        </div>
      </div>
    </div>

    <div class="cta-wrap">
      <a href="https://www.novaedgeacademy.in/profile" class="cta">Go to My Dashboard</a>
    </div>

    <div class="rule"></div>
    <div class="footer">
      <p class="thanks">Thank you for learning with NovaEdge Academy.</p>
      <p class="contact">Questions or need assistance? Write to <a href="mailto:course@novaedgeacademy.in">course@novaedgeacademy.in</a></p>
      <p class="copyright">NOVAEDGE DIGITAL LABS &copy; ${new Date().getFullYear()} NOVAEDGE ACADEMY — ALL RIGHTS RESERVED</p>
    </div>
  </div>

</body>
</html>
    `;

    const plainText = `
Welcome to NovaEdge Academy, ${studentName}!

We are delighted to welcome you to NovaEdge Academy.
Access your dashboard: https://www.novaedgeacademy.in/profile

If you need any help, contact: course@novaedgeacademy.in
    `.trim();

    await sendEmail({
      email,
      cc: "course@novaedgeacademy.in",
      subject: `Welcome to NovaEdge Academy, ${studentName}!`,
      message: plainText,
      html: htmlContent,
    });

    console.log(`Welcome email sent successfully to ${email} (CC: course@novaedgeacademy.in)`);
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
  }
};
