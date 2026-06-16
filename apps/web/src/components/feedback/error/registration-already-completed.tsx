import { useTypedNavigate } from '@/hooks/typed-hooks';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { memo } from 'react';

export const RegistrationAlreadyCompletedFeedbackPage = memo(() => {
  const navigate = useTypedNavigate();

  return (
    <div className="w-full p-10">
      <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-emerald-600 uppercase">
        <CheckCircle2 className="h-4 w-4" />
        Registration Complete
      </div>

      <div className="space-y-3">
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Account already active
        </h1>

        <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
          Your registration has already been completed successfully.
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
        Your email has been verified and your account setup is complete. You can
        sign in using your credentials and start using the platform.
      </p>

      <div className="mt-8 flex w-full items-center">
        <div
          className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-300 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
          onClick={() => navigate('/auth/gz/login')}
        >
          <span className="pt-[1.4px]">Back to Sign In</span>
          <ChevronRight className="size-4 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
});

RegistrationAlreadyCompletedFeedbackPage.displayName =
  'RegistrationAlreadyCompletedFeedbackPage';

