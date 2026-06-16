import { useTypedLocation, useTypedNavigate } from '@/hooks/typed-hooks';
import type {
  CompleteRegistrationErrorFeedbackState,
  CompleteRegistrationSuccessFeedbackState,
} from '@/types';
import { delay } from '@repo/hooks';
import Spinner4 from '@repo/shared/components/spinner4';
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const CompleteRegistrationFeedback = observer(() => {
  const navigate = useTypedNavigate();
  const location = useTypedLocation<
    | CompleteRegistrationErrorFeedbackState
    | CompleteRegistrationSuccessFeedbackState
  >();

  const code = location.state.code;

  if (!code) {
    return <Navigate to="/auth/access-denied" replace />;
  }

  useEffect(() => {
    if (code === 'REGISTRATION_COMPLETED') {
      delay(5000).then(() => navigate('/auth/login', { replace: true }));
    }
  }, [code, navigate]);

  return (
    <div className="flex min-h-[80vh] w-full animate-in flex-col items-center justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'INVALID_OR_EXPIRED_REGISTRATION_COMPLETION_TOKEN' ||
      code === 'LINK_EXPIRED' ? (
        <div className="w-full p-10">
          <div className="font-medum mb-5 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-amber-600 uppercase">
            <AlertCircle className="h-3 w-3" />
            Invalid Link or Expired
          </div>
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Invalid or Expired Security Token
            </h1>
            <p className="text-sm font-medium text-muted-foreground/80">
              The registration completion link has expired or is invalid.
            </p>
          </div>
          <p className="mt-5 mb-6 text-sm leading-relaxed text-muted-foreground">
            For your security, verification links are single-use and expire
            quickly. This signature token is no longer recognized by our
            authentication engine. Please return to the sign-in page to request
            a fresh activation link.
          </p>

          <div className="mt-8 flex w-full items-center">
            <div
              className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => navigate('/auth/login', { replace: true })}
            >
              <span>Back to Login</span>
              <ChevronRight className="mb-[1px] size-4.5 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      ) : code === 'REGISTRATION_ALREADY_COMPLETED' ? (
        <div className="w-full p-10">
          <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold tracking-widest text-blue-600 uppercase dark:border-blue-400/20 dark:bg-blue-500/5 dark:text-blue-400">
            <CheckCircle2 className="h-3 w-3" />
            Already Verified
          </div>
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Registration Already Complete
            </h1>
            <p className="text-sm font-medium text-muted-foreground/80">
              Your cryptographic profile is active and fully initialized.
            </p>
          </div>
          <p className="mt-5 mb-6 text-sm leading-relaxed text-muted-foreground">
            This secure activation link has already been processed. Your
            identity verification is complete, and no further action is
            required. You can proceed directly to the sign-in page to access
            your secure terminal workspace.
          </p>
          <div className="mt-8 flex w-full items-center">
            <div
              className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => navigate('/auth/login', { replace: true })}
            >
              <span>Back to Login</span>
              <ChevronRight className="mb-[1px] size-4.5 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      ) : code === 'REGISTRATION_COMPLETED' ? (
        <div className="max-w flex w-full flex-col items-center space-y-6 p-10 text-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 dark:bg-emerald-500/5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/10 opacity-75 duration-1000" />
            <CheckCircle2 className="h-7 w-7 text-emerald-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Account Setup Complete
            </h1>
            <p className="text-sm font-medium text-muted-foreground/80">
              Welcome to Cryptokit. Your environment is initialized.
            </p>
          </div>
          <p className="mx-auto mb-6 text-sm leading-relaxed text-muted-foreground">
            Your secure cryptographic profile has been successfully generated.
            Please wait while we redirect you to the main terminal to initialize
            your first asset position.
          </p>
          <div className="flex items-center gap-2 pt-2 text-xs font-medium text-muted-foreground/60">
            <Spinner4 className="h-4 w-4 animate-spin text-primary" />
            <span>Loading terminal workspace...</span>
          </div>
        </div>
      ) : (
        <Navigate to="/auth/access-denied" replace />
      )}
    </div>
  );
});

CompleteRegistrationFeedback.displayName = 'CompleteRegistrationFeedback';

export default CompleteRegistrationFeedback;
