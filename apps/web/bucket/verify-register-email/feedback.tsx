import { observer } from 'mobx-react-lite';
import { memo } from 'react';
import { Navigate } from 'react-router-dom';
import { useTypedLocation, useTypedNavigate } from '@/hooks/typed-hooks';
import type { VerifyRegisterEmailErrorCode } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const VerifyRegisterEmailFeedback = observer(() => {
  const navigate = useTypedNavigate();
  const location = useTypedLocation<{ code: VerifyRegisterEmailErrorCode }>();

  const code = location.state.code;

  if (!code) {
    return <Navigate to="/auth/gz/access-denied" replace />;
  }

  if (code === 'TOO_MANY_AUTH_REQUESTS') {
    return <Navigate to="/auth/gz/register/initiate-registration" />;
  }

  return (
    <div className="flex min-h-[80vh] animate-in flex-col justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'INVALID_VERIFICATION_LINK' && (
        <div className="w-full p-10">
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Invalid verification link
            </h1>
            <p className="text-sm font-medium text-muted-foreground/80">
              We couldn't verify your email address.
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            This verification link is invalid, expired, or no longer available.
            Please request a new verification email and use the latest link sent
            to your inbox.
          </p>
          <div className="mt-8 flex w-full items-center">
            <div
              className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => {}}
            >
              <span>Resend verification email</span>
              <ChevronRight className="mb-[2px] size-4.5 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      )}
      {code === 'LINK_ALREADY_USED' && (
        <div className="w-full p-10">
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Account setup incomplete
            </h1>
            <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
              Your email is validated, but your profile configuration is
              unfinished.
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
            This verification link was already clicked, but your password setup
            was left incomplete. Because secure security tokens are single-use,
            please request a fresh setup link to finalize your profile
            credentials.
          </p>

          <div className="mt-8 flex w-full items-center">
            <div className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-300 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white">
              <span>Complete your registration</span>
              <ChevronRight className="mb-[1px] size-4 transition-all duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      )}
      {code === 'REGISTRATION_ALREADY_COMPLETED' && (
        <div className="w-full p-10">
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Account already active
            </h1>

            <p className="text-sm font-medium text-muted-foreground/80">
              Your registration has already been completed successfully.
            </p>
          </div>

          <p className="mt-6 text-sm leading-6 text-muted-foreground">
            Your account has already been verified and fully configured. You can
            now return to the sign-in page to securely access the platform.
          </p>

          <div className="mt-8 flex w-full items-center">
            <div
              className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => navigate('/auth/gz/login')}
            >
              <ChevronLeft className="mb-[2px] size-4.5 transition-all duration-200 group-hover:-translate-x-2" />
              <span>Back to Sign In</span>
            </div>
          </div>
        </div>
      )}
      {code === 'LINK_EXPIRED' && (
        <div className="w-full p-10">
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Verification link expired
            </h1>
            <p className="text-sm font-medium text-muted-foreground/80">
              The authentication security window has lapsed.
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 text-muted-foreground">
            For data protection, email verification links remain active for only
            a short period. Since this link has timed out, please request a new
            email activation sequence to continue creating your account.
          </p>

          <div className="mt-8 flex w-full items-center">
            <div
              className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => {}}
            >
              <span>Resend verification email</span>
              <ChevronRight className="mb-[2px] size-4.5 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      )}
      {code === 'RESUME_REGISTRATION_COMPLETION' && (
        <div className="w-full p-10">
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Complete your registration
            </h1>

            <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
              Your account setup was started but hasn't been completed yet.
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
            Continue where you left off by setting your password and completing
            your account registration.
          </p>

          <div className="mt-8 flex w-full items-center">
            <div
              className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => {}}
            >
              <span>Resume registration</span>
              <ChevronRight className="mb-[2px] size-4.5 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

VerifyRegisterEmailFeedback.displayName = 'VerifyRegisterEmailFeedback';

export default memo(VerifyRegisterEmailFeedback);
