import { env } from '@/config/env.config';
import { Resend } from 'resend';

interface Send {
  to: string;
  subject: string;
  html: string;
}

const { SMTP_FROM_EMAIL, RESEND_API_KEY } = env;

// 1. Updated display brand to match the template, and added a safe regex check for the fallback
const isValidEmail = SMTP_FROM_EMAIL && SMTP_FROM_EMAIL.includes('@');
const FROM = `"Cartovex" <${isValidEmail ? SMTP_FROM_EMAIL : 'onboarding@resend.dev'}>`;

// const resend = new Resend(RESEND_API_KEY);
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

async function send(props: Send) {
  // 2. Resend does not throw on API validation failures, we must evaluate the returned 'error' object
  if (resend) {
    const { data, error } = await resend.emails.send({
      from: FROM,
      ...props,
    });

    if (error) {
      console.error('❌ Resend API Error Dispatch Failure:', error);
      throw new Error(`Email dispatch failed: ${error.message}`);
    }

    return data;
  }
}

export async function sendVerificationEmail(email: string, link: string) {
  const htmlContent = `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Verify your email</title>
    <style>
      @media only screen and (max-width: 600px) {
        .hero-section { padding: 40px 24px !important; }
        .email-title { font-size: 24px !important; }
      }
    </style>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f3f4f6; font-family: 'Inter', Arial, sans-serif;">
    <div class="container" style="max-width: 640px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
      
      <!-- Hero Section -->
      <div class="hero-section" style="background-color: #f3f4f6; padding: 64px 40px; text-align: center;">
        <h1 class="email-title" style="font-size: 30px; font-weight: 700; color: #14171e; margin: 0 0 20px 0;">
          Verify your email address
        </h1>
  
        <p class="description" style="max-width: 420px; margin: 0 auto 32px; font-size: 16px; line-height: 1.6; color: #43454b; text-align: center;">
          Hello <strong>${email}</strong>,<br /><br />
          Thank you for creating your account with Cartovex. To complete your registration and activate your workspace, please verify your email address.
        </p>
  
        <a href="${link}" target="_blank" class="button" style="display: inline-block; background-color: #14171e; color: #ffffff !important; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-size: 16px; font-weight: 500; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          Verify Email
        </a>
        
        <p style="margin-top: 32px; color: #7b7d81; font-size: 13px; line-height: 1.6; margin-bottom: 0;">
          If you didn’t request this email, you can safely ignore it.
        </p>
      </div>
  
    </div>
  </body>
  </html>
    `;

  await send({
    to: email,
    subject: 'Verify your email address',
    html: htmlContent,
  });
}
