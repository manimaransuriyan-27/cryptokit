// import nodemailer from 'nodemailer';

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.GMAIL_USER,
//     pass: process.env.GMAIL_APP_PASSWORD,
//   },
// });

// const FROM = `"CryptoApp" <${process.env.GMAIL_USER}>`;
const BASE = process.env.CLIENT_URL ?? 'http://localhost:3000';

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function send(to: string, subject: string, html: string) {
  // await transporter.sendMail({ from: FROM, to, subject, html });
  await new Promise(() => {
    console.log('\n==================================================');
    console.log('📧 [MOCK EMAIL SENT] — Intercepted successfully');
    console.log(`📬 To:      ${to}`);
    console.log(`📋 Subject: ${subject}`);
    console.log('--------------------------------------------------');
    console.log(`📄 HTML Content:\n${html}`);
    console.log('==================================================\n');

    return;
  });
}

// ─── Email verification ───────────────────────────────────────────────────────

export async function sendVerificationEmail(to: string, token: string) {
  const link = `${BASE}/verify-email?token=${token}`;
  await send(
    to,
    'Verify your email — CryptoApp',
    `<p>Click the link below to verify your email. It expires in <b>24 hours</b>.</p>
     <a href="${link}" style="padding:10px 20px;background:#6c47ff;color:#fff;border-radius:6px;text-decoration:none">
       Verify Email
     </a>
     <p>Or copy: ${link}</p>`
  );
}

// ─── OTP (2FA / login verification) ──────────────────────────────────────────

export async function sendOtpEmail(to: string, otp: string) {
  await send(
    to,
    'Your login OTP — CryptoApp',
    `<p>Your one-time password is:</p>
     <h1 style="letter-spacing:8px;font-size:36px;font-family:monospace">${otp}</h1>
     <p>Expires in <b>10 minutes</b>. Do not share this with anyone.</p>`
  );
}

// ─── Password reset ───────────────────────────────────────────────────────────

export async function sendPasswordResetEmail(to: string, token: string) {
  const link = `${BASE}/reset-password?token=${token}`;
  await send(
    to,
    'Reset your password — CryptoApp',
    `<p>Click below to reset your password. Link expires in <b>1 hour</b>.</p>
     <a href="${link}" style="padding:10px 20px;background:#6c47ff;color:#fff;border-radius:6px;text-decoration:none">
       Reset Password
     </a>
     <p>If you didn't request this, ignore this email.</p>`
  );
}

// ─── Admin welcome ────────────────────────────────────────────────────────────

export async function sendAdminWelcomeEmail(
  to: string,
  password: string,
  role: string
) {
  const link = `${BASE}/login`;
  await send(
    to,
    `Welcome to CryptoApp — ${role} access`,
    `<p>Your <b>${role}</b> account has been created.</p>
     <p>Email: <b>${to}</b></p>
     <p>Temporary Password: <b>${password}</b></p>
     <p>Please <a href="${link}">login</a> and change your password immediately.</p>`
  );
}
