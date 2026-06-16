import { ChevronRight, Mail } from 'lucide-react';
import { memo } from 'react';

export const RegistrationInitiatedFeedbackPage = memo(() => {
  return (
    <div className="w-full p-10">
      <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-emerald-600 uppercase">
        <Mail className="h-4 w-4" />
        Registration Initiated
      </div>

      <div className="space-y-3">
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Verify your email address
        </h1>

        <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
          A verification link has been sent to your email.
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
        Please open the email and click the verification link to continue
        creating your account. If you can't find the email, check your spam
        folder or request a new verification link.
      </p>

      <div className="mt-8 flex w-full items-center">
        <div
          className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-300 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
          onClick={() => {
            console.log('Resend verification email');
          }}
        >
          <span className="pt-[1.5px]">Resend verification link</span>
          <ChevronRight className="size-4.5 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
});

RegistrationInitiatedFeedbackPage.displayName =
  'RegistrationInitiatedFeedbackPage';
