interface Send {
  to: string;
  subject: string;
  html: string;
}

async function send(props: Send) {
  let targetEmail = props.to;
  console.log('\n==================================================');
  console.log('🔄 [DEV EMAIL REDIRECT & LOG]');
  console.log(`   ├─ Original Request To: ${props.to}`);
  console.log(`   ├─ Routed Instead To:   ${targetEmail}`);
  console.log(`   └─ Subject:             ${props.subject}`);
  console.log('--------------------------------------------------');
  console.log('📄 [HTML TEMPLATE CONTENT]:');
  console.log(props.html);
  console.log('==================================================\n');
}

export async function sendVerificationEmail(email: string, link: string) {
  const htmlContent = `<p>Click the link below to verify your email. It expires in <b>24 hours</b>.</p>
     <a href="${link}" style="padding:10px 20px;background:#6c47ff;color:#fff;border-radius:6px;text-decoration:none">
       Verify Email
     </a>`;

  await send({
    to: email,
    subject: 'Verify your email address',
    html: htmlContent,
  });
}

export async function sendLoginOtpEmail(email: string, otp: string) {
  const htmlContent = `<p>Your one-time password is:</p>
     <h1 style="letter-spacing:8px;font-size:36px;font-family:monospace">${otp}</h1>
     <p>Expires in <b>10 minutes</b>. Do not share this with anyone.</p>`;

  await send({
    to: email,
    subject: 'Your login OTP',
    html: htmlContent,
  });
}