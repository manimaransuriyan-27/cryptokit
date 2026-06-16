import { AlertCircle, ChevronRight } from 'lucide-react';
import { memo } from 'react';

export const LinkAlreadyUsedFeedbackPage = memo(() => {
  return (
    <div className="w-full p-10">
      <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-amber-600 uppercase">
        <AlertCircle className="h-4 w-4" />
        Link Already Used
      </div>

      <div className="space-y-3">
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Account setup incomplete
        </h1>

        <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
          Your email has already been verified, but your registration is not yet
          complete.
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
        This setup link has already been used. However, your password was not
        created and your account setup remains unfinished. Request a new setup
        link below to complete your registration.
      </p>

      <div className="mt-8 flex w-full items-center">
        <div className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-300 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white">
          <span className="pt-[1.4px]">Complete your registration</span>
          <ChevronRight className="size-4 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
});

LinkAlreadyUsedFeedbackPage.displayName = 'LinkAlreadyUsedFeedbackPage';

