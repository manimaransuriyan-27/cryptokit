import { delay } from '@repo/hooks';
import Spinner4 from '@repo/shared/components/spinner4';
import { observer } from 'mobx-react-lite';
import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useVerifyEmailInteractor } from './interactor';

const VerifyEmailPage = observer(() => {
  const hasTriggered = useRef(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const { onVerifyEmail } = useVerifyEmailInteractor();

  useEffect(() => {
    if (token && !hasTriggered.current) {
      hasTriggered.current = true;
      delay(2000).then(() => {
        onVerifyEmail({ token });
      });
    }
  }, [token, onVerifyEmail]);

  return (
    <div className="flex min-h-[80vh] animate-in flex-col items-center justify-center px-4 py-12 duration-1000 ease-out fade-in slide-in-from-right-8">
      <div className="flex w-full max-w-2xl flex-col items-center space-y-6 p-10 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/0 dark:bg-emerald-500/5">
          <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-emerald-500/10 opacity-50" />
          <Spinner4 className="text-primaryf h-6 w-6 animate-spin text-emerald-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Verifying Email Credentials
          </h1>
          <p className="text-sm font-medium text-muted-foreground/80">
            Securing your cryptographic access link.
          </p>
        </div>
        <p className="mx-auto mt-2 mb-6 text-sm leading-relaxed text-muted-foreground">
          Please wait while we securely verify your email address and activate
          your account. This process will complete automatically in a few
          moments.
        </p>
        <div className="flex items-center gap-2 pt-2 text-xs font-medium text-muted-foreground/60">
          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
          <span>Synchronizing registration session...</span>
        </div>
      </div>
    </div>
  );
});

VerifyEmailPage.displayName = 'VerifyEmailPage';

export default VerifyEmailPage;
