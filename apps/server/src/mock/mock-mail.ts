const BASE = "http://localhost:3000"

export async function sendVerificationEmailMocks(to: string, token: string) {
    const link = `${BASE}/verify-email?token=${token}`
  
    const subject = 'Verify your email — CryptoApp'
  
    const html = `
      <p>Click the link below to verify your email. It expires in <b>24 hours</b>.</p>
  
      <a 
        href="${link}" 
        style="
          padding:10px 20px;
          background:#6c47ff;
          color:#fff;
          border-radius:6px;
          text-decoration:none;
          display:inline-block;
        "
      >
        Verify Email
      </a>
  
      <p>Or copy this link:</p>
      <p>${link}</p>
    `
  
    // MOCK MODE
    console.log(`
  ========================================
  📧 MOCK EMAIL
  ========================================
  To: ${to}
  Subject: ${subject}
  
  ${html}
  
  ========================================
  `)
  }