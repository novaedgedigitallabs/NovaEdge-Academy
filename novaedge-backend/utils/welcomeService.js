const sendEmail = require("./sendEmail");

/**
 * Humanized & Clean Welcome Email Template with Official Header Logo.
 * Uses robust table layouts & explicit inline styles for 100% pixel-perfect rendering in Gmail/Outlook.
 * Dispatches to user email with CC to course@novaedgeacademy.in
 */
exports.sendWelcomeEmail = async ({ name, email }) => {
  try {
    if (!email) return;

    const studentName = name || "Student";

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to NovaEdge Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 600px; max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header with Logo -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <img src="https://www.novaedgeacademy.in/Header_logo.webp" alt="NovaEdge Academy" width="180" style="display: block; margin: 0 auto; border: 0; outline: none; max-width: 180px; height: auto;" />
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                NovaEdge Digital Labs
              </div>
            </td>
          </tr>

          <!-- Welcome Message -->
          <tr>
            <td style="padding: 32px 36px 20px 36px;">
              <div style="font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                Welcome to NovaEdge Academy, ${studentName}.
              </div>
              <div style="font-size: 14px; color: #475569; margin-top: 10px; line-height: 1.6;">
                We are glad to have you with us. Your account is active, and you can now access your courses, track your learning, and build skills at your own pace.
              </div>
            </td>
          </tr>

          <!-- Next Steps -->
          <tr>
            <td style="padding: 0 36px 28px 36px;">
              <div style="font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 14px;">
                Next Steps
              </div>

              <!-- Step 1 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px;">
                <tr>
                  <td width="28" align="left" valign="top" style="font-size: 13px; font-weight: 700; color: #0f172a;">
                    1.
                  </td>
                  <td align="left" valign="top">
                    <div style="font-size: 14px; font-weight: 600; color: #0f172a;">
                      Your Dashboard
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px; line-height: 1.5;">
                      View your enrolled courses, lesson progress, and account details in one place.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Step 2 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 10px; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px;">
                <tr>
                  <td width="28" align="left" valign="top" style="font-size: 13px; font-weight: 700; color: #0f172a;">
                    2.
                  </td>
                  <td align="left" valign="top">
                    <div style="font-size: 14px; font-weight: 600; color: #0f172a;">
                      Lessons and Practice
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px; line-height: 1.5;">
                      Watch video lessons, complete practice quizzes, and work on course projects.
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Step 3 -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 14px 16px;">
                <tr>
                  <td width="28" align="left" valign="top" style="font-size: 13px; font-weight: 700; color: #0f172a;">
                    3.
                  </td>
                  <td align="left" valign="top">
                    <div style="font-size: 14px; font-weight: 600; color: #0f172a;">
                      Course Certificates
                    </div>
                    <div style="font-size: 13px; color: #64748b; margin-top: 2px; line-height: 1.5;">
                      Earn a verified certificate upon completing all lectures and assignments for a course.
                    </div>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- CTA Button -->
          <tr>
            <td align="center" style="padding: 0 36px 32px 36px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #0f172a; border-radius: 6px; padding: 12px 28px;">
                    <a href="https://www.novaedgeacademy.in/profile" target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; display: inline-block;">
                      Go to Dashboard
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 13px; color: #334155;">
                Thank you for joining NovaEdge Academy.
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                If you need any assistance, write to us at <a href="mailto:course@novaedgeacademy.in" style="color: #0f172a; font-weight: 600; text-decoration: underline;">course@novaedgeacademy.in</a>
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
Welcome to NovaEdge Academy, ${studentName}.

We are glad to have you with us.
Go to your dashboard: https://www.novaedgeacademy.in/profile

If you need any assistance, write to: course@novaedgeacademy.in
    `.trim();

    await sendEmail({
      email,
      cc: "course@novaedgeacademy.in",
      subject: `Welcome to NovaEdge Academy, ${studentName}`,
      message: plainText,
      html: htmlContent,
    });

    console.log(`Welcome email sent successfully to ${email} (CC: course@novaedgeacademy.in)`);
  } catch (err) {
    console.error("Failed to send welcome email:", err.message);
  }
};
