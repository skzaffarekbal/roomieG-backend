/**
 * Generates an elegant, modern HTML email template for verification.
 * Follows modern responsive email design standards with RoomieG branding.
 */
function getVerificationEmailHtml({ firstName, verificationLink }) {
  const safeName = firstName ? firstName : 'there';

  return `
<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Verify your RoomieG email</title>
  <!--[if mso]>
  <style>
    body, table, td, a { font-family: Arial, Helvetica, sans-serif !important; }
  </style>
  <![endif]-->
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    td {
      padding: 0;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    .btn-verify {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff !important;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      display: inline-block;
      box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.35);
      letter-spacing: 0.2px;
    }
    @media only screen and (max-width: 620px) {
      .container-table {
        width: 100% !important;
        border-radius: 0 !important;
      }
      .content-cell {
        padding: 32px 24px !important;
      }
      .header-cell {
        padding: 32px 24px 24px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 40px 12px; background-color: #f1f5f9;">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center">
        <!-- Main Card Wrapper -->
        <table class="container-table" role="presentation" width="100%" style="max-width: 580px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04); border: 1px solid #e2e8f0;" border="0" cellspacing="0" cellpadding="0">
          
          <!-- Header / Brand Gradient Banner -->
          <tr>
            <td class="header-cell" style="background: linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #7c3aed 100%); padding: 40px 36px; text-align: center;">
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <div style="display: inline-block; width: 64px; height: 64px; background: rgba(255, 255, 255, 0.2); border-radius: 16px; line-height: 64px; font-size: 32px; backdrop-filter: blur(8px); margin-bottom: 12px; border: 1px solid rgba(255, 255, 255, 0.3);">
                      🏠
                    </div>
                    <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 800; letter-spacing: -0.5px;">RoomieG</h1>
                    <p style="margin: 6px 0 0; color: #e0e7ff; font-size: 14px; font-weight: 500; letter-spacing: 0.3px;">FIND YOUR PERFECT ROOMMATE</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content-cell" style="padding: 40px 36px; color: #1e293b; line-height: 1.6;">
              <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 22px; font-weight: 700; letter-spacing: -0.3px;">
                Welcome aboard, ${safeName}! 👋
              </h2>
              <p style="margin: 0 0 20px; font-size: 15px; color: #475569; line-height: 1.7;">
                Thank you for joining <strong>RoomieG</strong>. We're excited to help you find the best compatible roommates and shared living spaces.
              </p>
              <p style="margin: 0 0 28px; font-size: 15px; color: #475569; line-height: 1.7;">
                Please verify your email address by clicking the button below. This ensures your account remains secure and verified in our community.
              </p>

              <!-- CTA Button -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 32px 0;">
                <tr>
                  <td align="center">
                    <a href="${verificationLink}" target="_blank" class="btn-verify" style="display: inline-block; background: #4f46e5; background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: #ffffff; text-decoration: none; padding: 15px 38px; border-radius: 12px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.4);">
                      Verify Email Address
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Expiry Alert Callout -->
              <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="margin: 28px 0 0; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
                <tr>
                  <td style="padding: 16px 20px;">
                    <p style="margin: 0; font-size: 13px; color: #64748b; line-height: 1.5;">
                      ⏰ <strong>Security Note:</strong> This link is valid for <strong>24 hours</strong>. If you didn't create an account with RoomieG, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Fallback Link Section -->
              <div style="margin-top: 28px; padding-top: 24px; border-top: 1px solid #f1f5f9;">
                <p style="margin: 0 0 8px; font-size: 12px; color: #94a3b8; font-weight: 500;">
                  Button not working? Copy and paste this URL into your browser:
                </p>
                <p style="margin: 0; font-size: 12px; word-break: break-all;">
                  <a href="${verificationLink}" style="color: #4f46e5; text-decoration: underline;">
                    ${verificationLink}
                  </a>
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 24px 36px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #64748b; font-weight: 500;">
                © ${new Date().getFullYear()} RoomieG. All rights reserved.
              </p>
              <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                Connecting roommates, creating homes.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;
}

/**
 * Generates an interactive, modern standalone HTML page rendered when a user clicks the verification link in their email.
 */
function getVerificationResultPage({ success, message, loginUrl }) {
  const isSuccess = Boolean(success);

  const icon = isSuccess
    ? `
      <div class="icon-circle success">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>`
    : `
      <div class="icon-circle failure">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>`;

  const title = isSuccess ? 'Email Verified Successfully!' : 'Verification Failed';
  const subtitle = message
    ? message
    : isSuccess
      ? 'Your email has been confirmed. You now have full access to your RoomieG account.'
      : 'The verification link is invalid, expired, or has already been used.';

  const actionButton = isSuccess
    ? `<a href="${loginUrl}" class="action-btn primary-btn">Go to Login & Complete Profile</a>`
    : `<a href="${loginUrl}" class="action-btn secondary-btn">Back to Login</a>`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - RoomieG</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      min-height: 100vh;
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #f8fafc 0%, #eef2ff 50%, #f1f5f9 100%);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 24px 16px;
      color: #0f172a;
    }

    .background-decor {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 0;
      overflow: hidden;
    }

    .blob-1 {
      position: absolute;
      top: -10%;
      left: -10%;
      width: 500px;
      height: 500px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0) 70%);
    }

    .blob-2 {
      position: absolute;
      bottom: -10%;
      right: -10%;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(168, 85, 247, 0.12) 0%, rgba(168, 85, 247, 0) 70%);
    }

    .card {
      position: relative;
      z-index: 1;
      width: 100%;
      max-width: 480px;
      background: #ffffff;
      border-radius: 28px;
      padding: 48px 36px;
      box-shadow: 0 20px 40px -15px rgba(15, 23, 42, 0.08), 0 0 1px 1px rgba(15, 23, 42, 0.05);
      text-align: center;
      animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(24px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .brand-pill {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      background: #f1f5f9;
      border-radius: 100px;
      font-size: 14px;
      font-weight: 700;
      color: #4f46e5;
      margin-bottom: 32px;
      box-shadow: inset 0 1px 2px rgba(0,0,0,0.03);
    }

    .icon-container {
      margin-bottom: 24px;
      display: flex;
      justify-content: center;
    }

    .icon-circle {
      width: 88px;
      height: 88px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s both;
    }

    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .icon-circle svg {
      width: 44px;
      height: 44px;
    }

    .icon-circle.success {
      background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
      color: #059669;
      box-shadow: 0 10px 25px -5px rgba(16, 185, 129, 0.25);
    }

    .icon-circle.failure {
      background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
      color: #dc2626;
      box-shadow: 0 10px 25px -5px rgba(239, 68, 68, 0.25);
    }

    h1 {
      font-size: 24px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      margin-bottom: 12px;
    }

    .description {
      font-size: 15px;
      color: #64748b;
      line-height: 1.6;
      margin-bottom: 36px;
    }

    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .action-btn {
      display: inline-block;
      width: 100%;
      padding: 16px 24px;
      border-radius: 14px;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.2s ease;
      cursor: pointer;
    }

    .primary-btn {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
      color: #ffffff;
      box-shadow: 0 4px 14px 0 rgba(79, 70, 229, 0.35);
    }

    .primary-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px 0 rgba(79, 70, 229, 0.45);
    }

    .secondary-btn {
      background: #f1f5f9;
      color: #334155;
    }

    .secondary-btn:hover {
      background: #e2e8f0;
      color: #0f172a;
    }

    .footer {
      margin-top: 32px;
      font-size: 13px;
      color: #94a3b8;
    }
  </style>
</head>
<body>
  <div class="background-decor">
    <div class="blob-1"></div>
    <div class="blob-2"></div>
  </div>

  <div class="card">
    <div class="brand-pill">
      <span>🏠</span> RoomieG
    </div>

    <div class="icon-container">
      ${icon}
    </div>

    <h1>${title}</h1>
    <p class="description">${subtitle}</p>

    <div class="actions">
      ${actionButton}
    </div>

    <div class="footer">
      © ${new Date().getFullYear()} RoomieG. All rights reserved.
    </div>
  </div>
</body>
</html>
`;
}

module.exports = {
  getVerificationEmailHtml,
  getVerificationResultPage,
};
