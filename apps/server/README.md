readme_content = """# Cryptokit Core Authentication Engine — Backend Documentation

Welcome to the **Cryptokit Backend Server** repository (`apps/server`). This service acts as a centralized, high-performance, production-grade identity management and security authentication gateway. It is meticulously engineered using **Express**, **TypeScript**, and **Prisma 7** to support high-security, multi-tenant interactions across your client web interfaces, administrative dashboards, and super-admin portals.

---

## 🏗️ Core Architecture & Tech Stack

The backend ecosystem is architected around security mitigation, strict type preservation, and absolute database state integrity.

* **Runtime Environment:** Node.js (v25+) with TypeScript compilation handled on-the-fly by `tsx`.
* **Database Access Layer:** Prisma v7.8.0 leveraging the specialized `@prisma/adapter-mariadb` JavaScript driver wrapper. This ensures high throughput by running connection pooling natively inside the JavaScript thread, eliminating heavy Rust binary overhead.
* **Payload Validation Layer:** Schema boundaries are fully enforced by `Zod`. No unvetted, raw request strings or structurally loose objects ever breach the controller gates or touch database services.
* **Security Controls:** Custom brute-force account lockout throttling (5 consecutive failures = 30-minute lockout), token-family replay-attack detection transactions, and localized dual-layer endpoint rate limiting using `express-rate-limit`.
* **Background Maintenance:** Automatic daily cron task executor powered by `node-cron` running database indexing cleanups at exactly midnight.
* **Logging Engine:** Isolated, centralized structured serialization system producing beautiful colorized diagnostic traces during local development and pure JSON streams for live aggregators (Datadog, AWS CloudWatch) in production.

---

## 📁 Repository Structure

```text
cryptokit/apps/server/
├── src/
│   ├── app.ts                 # Express lifecycle, secure headers, CORS, and global errors
│   ├── server.ts              # System bootstrap process, DB connection pools, and graceful shutdowns
│   ├── config/                # Centralized environment variables and workspace configuration maps
│   ├── controllers/           # HTTP Request handlers, Zod schema boundary invocation wrappers
│   ├── services/              # Core business domain logic, atomic Prisma database transactions
│   ├── middlewares/           # Authentication guards, authorization role checks, and rate-limiting blocks
│   ├── validations/           # Strict Zod schemas for all ingress data payloads
│   ├── jobs/                  # Background micro-cron schedulers and database pürgers
│   ├── prisma/                # Client configurations, driver adapter loaders, and database seeds
│   │   ├── client.ts          # Safe URL-parsing MariaDB driver initialization engine
│   │   └── seed.ts            # Idempotent Super Admin initialization bootstrap routine
│   ├── generated/             # Localized output path for compiled Prisma structural clients
│   └── utils/                 # Token builders, crypto hash utilities, and email delivery wrappers
├── prisma.config.ts           # Global configuration properties for Prisma migration pipelines
├── package.json               # Package manifests and script definitions
└── tsconfig.json              # System-wide TypeScript compiler parameters


Routes paths : 

==============================================================================
AUTH API ROUTES
Base URL: /api/v1/auth
==============================================================================

REGISTRATION
------------------------------------------------------------------------------

POST   /api/v1/auth/register/initiate
       -> Send registration verification email

POST   /api/v1/auth/register/verify-email
       -> Verify email from verification link

POST   /api/v1/auth/register/resume-completion
       -> Resume incomplete registration

GET    /api/v1/auth/register/completion-status
       -> Validate completion token and fetch status

POST   /api/v1/auth/register/complete
       -> Complete registration process

POST   /api/v1/auth/register/resend-verification
       -> Resend verification email


LOGIN & SESSION
------------------------------------------------------------------------------

POST   /api/v1/auth/login
       -> Login with email/password

GET    /api/v1/auth/login/session-status
       -> Check OTP session validity

POST   /api/v1/auth/login/verify-otp
       -> Verify login OTP

POST   /api/v1/auth/login/resend-otp
       -> Resend login OTP

POST   /api/v1/auth/refresh-token
       -> Refresh access token

POST   /api/v1/auth/logout
       -> Logout current session


PASSWORD RECOVERY
------------------------------------------------------------------------------

POST   /api/v1/auth/forgot-password
       -> Send password reset email

POST   /api/v1/auth/reset-password
       -> Reset password using token


PROFILE
------------------------------------------------------------------------------

GET    /api/v1/auth/me
       -> Get logged-in user profile

POST   /api/v1/auth/change-password
       -> Change account password


TWO FACTOR AUTHENTICATION
------------------------------------------------------------------------------

POST   /api/v1/auth/2fa/enable/request
       -> Send OTP to enable 2FA

POST   /api/v1/auth/2fa/enable/verify
       -> Verify OTP and enable 2FA

POST   /api/v1/auth/2fa/disable/request
       -> Send OTP to disable 2FA

POST   /api/v1/auth/2fa/disable/verify
       -> Verify OTP and disable 2FA


ADMIN
------------------------------------------------------------------------------

POST   /api/v1/auth/admin/create
       -> Create admin user (Super Admin only)

==============================================================================
TOTAL ROUTES: 18
==============================================================================