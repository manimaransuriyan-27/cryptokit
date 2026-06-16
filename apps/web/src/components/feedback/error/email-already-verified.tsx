import { AlertCircle, ChevronRight } from 'lucide-react';
import { memo } from 'react';

export const EmailAlreadyVerifiedFeedbackPage = memo(() => {
  return (
    <div className="w-full p-10">
      <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-amber-600 uppercase">
        <AlertCircle className="h-4 w-4" />
        Email Already Verified
      </div>
      <div className="space-y-3">
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Account setup incomplete
        </h1>
        <p className="text-sm font-medium text-muted-foreground/80">
          Your email is verified, but your profile setup is not complete.
        </p>
      </div>
      <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
        Click below to continue setting up your password and complete your
        registration.
      </p>

      <div className="mt-8 flex w-full items-center">
        <div
          className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
          onClick={() => {}}
        >
          <span className="pt-[1.4px]">Complete your registration</span>
          <ChevronRight className="size-4.5 transition-all duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
});

EmailAlreadyVerifiedFeedbackPage.displayName =
  'EmailAlreadyVerifiedFeedbackPage';