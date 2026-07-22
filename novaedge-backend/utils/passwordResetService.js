const sendEmail = require("./sendEmail");

/**
 * Humanized & Clean Password Reset Email Template.
 * Single solid text colors, no emojis, human language, and no generic jargon.
 * Dispatches to user email with CC to course@novaedgeacademy.in
 */
exports.sendPasswordResetEmail = async ({ user, resetUrl }) => {
  try {
    if (!user || !user.email) return;

    const studentName = user.name || "Student";
    const studentEmail = user.email;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password — NovaEdge Academy</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f8fafc; padding: 40px 12px;">
    <tr>
      <td align="center">
        <!-- Main Container -->
        <table width="600" border="0" cellspacing="0" cellpadding="0" style="width: 600px; max-width: 600px; background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);">
          
          <!-- Header -->
          <tr>
            <td style="padding: 32px 36px 20px 36px; border-bottom: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 22px; font-weight: 700; color: #0f172a;">
                NovaEdge Academy
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 3px;">
                NovaEdge Digital Labs
              </div>
            </td>
          </tr>

          <!-- Password Reset Body -->
          <tr>
            <td style="padding: 32px 36px 20px 36px;">
              <div style="font-size: 20px; font-weight: 700; color: #0f172a; line-height: 1.4;">
                Password Reset Request
              </div>
              <div style="font-size: 14px; color: #475569; margin-top: 10px; line-height: 1.6;">
                Hello ${studentName}, we received a request to reset your password for your NovaEdge Academy account.
              </div>
              <div style="font-size: 14px; color: #475569; margin-top: 10px; line-height: 1.6;">
                Click the button below to set a new password. This reset link is valid for 10 minutes.
              </div>
            </td>
          </tr>

          <!-- Reset Button -->
          <tr>
            <td align="center" style="padding: 10px 36px 32px 36px;">
              <table border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center" style="background-color: #0f172a; border-radius: 6px; padding: 12px 28px;">
                    <a href="${resetUrl}" target="_blank" style="font-size: 14px; font-weight: 600; color: #ffffff; text-decoration: none; display: inline-block;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Link fallback -->
          <tr>
            <td style="padding: 0 36px 28px 36px;">
              <div style="font-size: 12px; color: #64748b; line-height: 1.5; background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 12px 14px;">
                If the button above does not work, copy and paste this link into your web browser:<br>
                <a href="${resetUrl}" style="color: #0f172a; font-weight: 600; word-break: break-all; text-decoration: underline;">${resetUrl}</a>
              </div>
              <div style="font-size: 13px; color: #64748b; margin-top: 14px; line-height: 1.5;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 36px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center;">
              <div style="font-size: 13px; color: #334155;">
                NovaEdge Academy Support
              </div>
              <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
                Need assistance? Contact us at <a href="mailto:course@novaedgeacademy.in" style="color: #0f172a; font-weight: 600; text-decoration: underline;">course@novaedgeacademy.in</a>
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
NovaEdge Academy — Password Reset Request

Hello ${studentName},

Use the link below to reset your password (valid for 10 minutes):
${resetUrl}

If you did not request a password reset, please ignore this email.
Questions? Contact: course@novaedgeacademy.in
    `.trim();

    await sendEmail({
      email: studentEmail,
      cc: "course@novaedgeacademy.in",
      subject: `Reset Your Password — NovaEdge Academy`,
      message: plainText,
      html: htmlContent,
    });

    console.log(`Password reset email sent successfully to ${studentEmail} (CC: course@novaedgeacademy.in)`);
  } catch (err) {
    console.error("Failed to send password reset email:", err.message);
  }
};
