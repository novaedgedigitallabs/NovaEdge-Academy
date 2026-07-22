const sendEmail = require("./sendEmail");

/**
 * Send Welcome Email to newly registered or newly enrolled student with CC to course@novaedgeacademy.in
 */
exports.sendWelcomeEmail = async ({ name, email }) => {
  try {
    if (!email) return;

    const studentName = name || "Valued Student";

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #09090b; color: #e4e4e7; margin: 0; padding: 20px; }
        .container { max-width: 650px; margin: auto; padding: 32px; border: 1px solid #27272a; background-color: #18181b; border-radius: 16px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.5); }
        .logo-header { text-align: center; padding-bottom: 24px; border-bottom: 1px solid #27272a; margin-bottom: 28px; }
        .logo-title { font-size: 26px; font-weight: bold; background: linear-gradient(135deg, #c084fc, #818cf8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; letter-spacing: 1.5px; }
        .hero-banner { background: linear-gradient(135deg, rgba(168, 85, 247, 0.15), rgba(99, 102, 241, 0.15)); border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 28px; }
        .hero-banner h2 { margin: 0 0 8px 0; color: #ffffff; font-size: 24px; }
        .hero-banner p { margin: 0; color: #a1a1aa; font-size: 14px; }
        .step-list { margin: 24px 0; }
        .step-item { display: flex; align-items: flex-start; gap: 16px; margin-bottom: 16px; background-color: #27272a/50; padding: 14px 18px; border-radius: 10px; border: 1px solid #27272a; }
        .step-number { background: #a855f7; color: #ffffff; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 14px; flex-shrink: 0; }
        .step-text h4 { margin: 0 0 2px 0; color: #ffffff; font-size: 15px; }
        .step-text p { margin: 0; color: #a1a1aa; font-size: 13px; }
        .btn-container { text-align: center; margin: 32px 0 24px 0; }
        .btn { background: linear-gradient(135deg, #a855f7, #6366f1); color: #ffffff !important; text-decoration: none; padding: 14px 32px; border-radius: 9999px; font-weight: bold; font-size: 15px; display: inline-block; box-shadow: 0 10px 15px -3px rgba(168, 85, 247, 0.4); }
        .footer { text-align: center; margin-top: 36px; padding-top: 20px; border-top: 1px solid #27272a; color: #71717a; font-size: 12px; }
        .footer a { color: #c084fc; text-decoration: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo-header">
          <div class="logo-title">NovaEdge Academy</div>
          <p style="margin: 4px 0 0 0; color: #a1a1aa; font-size: 12px;">Empowering Next-Gen Innovators</p>
        </div>

        <div class="hero-banner">
          <h2>Welcome aboard, ${studentName}! 🎉</h2>
          <p>We're thrilled to have you join our learning community at NovaEdge Academy.</p>
        </div>

        <p style="color: #e4e4e7; font-size: 15px; line-height: 1.6;">
          Your account is active and ready. You now have full access to interactive courses, hands-on coding assignments, community discussions, and verified certification tracks.
        </p>

        <div class="step-list">
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-text">
              <h4>Explore Your Dashboard</h4>
              <p>Track your learning progress, streak, and enrolled courses in one place.</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-text">
              <h4>Learn & Practice</h4>
              <p>Watch HD video lectures, solve quizzes, and practice real-world projects.</p>
            </div>
          </div>
          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-text">
              <h4>Earn Verified Certificates</h4>
              <p>Complete courses to showcase industry-standard certificates on your resume & LinkedIn.</p>
            </div>
          </div>
        </div>

        <div class="btn-container">
          <a href="https://www.novaedgeacademy.in/profile" class="btn">Go to My Dashboard</a>
        </div>

        <div class="footer">
          <p>Need assistance or have questions? Reach out to us anytime at <a href="mailto:course@novaedgeacademy.in">course@novaedgeacademy.in</a></p>
          <p style="margin-top: 8px; font-size: 11px;">NovaEdge Digital Labs &copy; ${new Date().getFullYear()} NovaEdge Academy. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
    `;

    const plainText = `
Welcome to NovaEdge Academy, ${studentName}!

We are excited to have you join our learning platform.
Access your dashboard: https://www.novaedgeacademy.in/profile

If you need any help, contact: course@novaedgeacademy.in
    `.trim();

    await sendEmail({
      email,
      cc: "course@novaedgeacademy.in",
      subject: `Welcome to NovaEdge Academy, ${studentName}! 🎉`,
      message: plainText,
      html: htmlContent,
    });

    console.log(`Welcome email sent successfully to ${email} (CC: course@novaedgeacademy.in)`);
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
  }
};
