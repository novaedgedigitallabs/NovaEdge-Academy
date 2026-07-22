const sendEmail = require("./sendEmail");

/**
 * World-Class HTML Welcome Email Template.
 * Uses robust table layouts & explicit inline styles for 100% pixel-perfect rendering in Gmail/Outlook.
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
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to NovaEdge Academy</title>
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
            <td style="padding: 32px 40px 20px 40px; border-bottom: 1px solid #f1f5f9; text-align: center;">
              <div style="font-size: 24px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; text-transform: uppercase;">
                NovaEdge <span style="color: #6366f1;">Academy</span>
              </div>
              <div style="font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 1px; text-transform: uppercase; margin-top: 4px;">
                Empowering Next-Gen Innovators
              </div>
            </td>
          </tr>

          <!-- Hero Greeting Banner -->
          <tr>
            <td style="padding: 32px 40px 24px 40px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f5f3ff; border: 1px solid #ddd6fe; border-radius: 10px; padding: 24px;">
                <tr>
                  <td align="center">
                    <div style="font-size: 11px; font-weight: 700; color: #7c3aed; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 6px;">
                      OFFICIAL WELCOME
                    </div>
                    <div style="font-size: 22px; font-weight: 800; color: #0f172a; line-height: 1.3;">
                      Welcome aboard, <span style="color: #6366f1;">${studentName}</span>! 🎉
                    </div>
                    <div style="font-size: 14px; color: #475569; margin-top: 10px; line-height: 1.6; max-width: 460px;">
                      We are thrilled to welcome you to NovaEdge Academy. Your journey toward mastering industry-ready skills and building real-world projects starts right now.
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Getting Started Steps -->
          <tr>
            <td style="padding: 0 40px 28px 40px;">
              <div style="font-size: 11px; font-weight: 700; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; margin-bottom: 16px;">
                GETTING STARTED LAUNCHPAD
              </div>

              <!-- Step 1 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 14px 16px;">
                <tr>
                  <td width="36" align="center" valign="top" style="padding-right: 12px;">
                    <div style="width: 28px; height: 28px; background-color: #6366f1; color: #ffffff; border-radius: 50%; font-size: 12px; font-weight: 800; line-height: 28px; text-align: center;">
                      01
                    </div>
                  </td>
                  <td align="left" valign="top">
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a;">
                      Access Your Dashboard
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px; line-height: 1.5;">
                      Track your enrolled courses, daily study streak, and skill milestones in real-time.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 12px; background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 14px 16px;">
                <tr>
                  <td width="36" align="center" valign="top" style="padding-right: 12px;">
                    <div style="width: 28px; height: 28px; background-color: #a855f7; color: #ffffff; border-radius: 50%; font-size: 12px; font-weight: 800; line-height: 28px; text-align: center;">
                      02
                    </div>
                  </td>
                  <td align="left" valign="top">
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a;">
                      Interactive Lectures &amp; Practice
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px; line-height: 1.5;">
                      Watch HD video lectures, solve quizzes, and submit hands-on coding assignments.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 14px 16px;">
                <tr>
                  <td width="36" align="center" valign="top" style="padding-right: 12px;">
                    <div style="width: 28px; height: 28px; background-color: #ec4899; color: #ffffff; border-radius: 50%; font-size: 12px; font-weight: 800; line-height: 28px; text-align: center;">
                      03
                    </div>
                  </td>
                  <td align="left" valign="top">
                    <div style="font-size: 14px; font-weight: 700; color: #0f172a;">
                      Earn Verified Certificates
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px; line-height: 1.5;">
                      Complete course tracks to earn industry-recognized certificates to feature on LinkedIn &amp; Resumes.
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 40px 36px 40px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #0f172a; border-radius: 9999px; padding: 14px 36px;">
                    <a href="https://www.novaedgeacademy.in/profile" target="_blank" style="font-size: 14px; font-weight: 700; color: #ffffff; text-decoration: none; display: inline-block; letter-spacing: 0.5px;">
                      GO TO MY DASHBOARD &rarr;
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #f8fafc; border-top: 1px solid #f1f5f9; text-align: center;">
              <div style="font-size: 14px; font-weight: 600; color: #334155; font-style: italic;">
                Thank you for choosing NovaEdge Academy!
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                Need help or have questions? Contact us at <a href="mailto:course@novaedgeacademy.in" style="color: #6366f1; text-decoration: none; font-weight: 600;">course@novaedgeacademy.in</a>
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
Welcome to NovaEdge Academy, ${studentName}!

We are delighted to welcome you to NovaEdge Academy.
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
