import { ChevronRight, Clock3 } from 'lucide-react';
import { memo } from 'react';

export const ResumeRegistrationCompletionFeedbackPage = memo(() => {
  return (
    <div className="w-full p-10">
  <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-indigo-600 uppercase">
  <Clock3 className="h-4 w-4" />
  Registration In Progress
</div>

      <div className="space-y-3">
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Complete your registration
        </h1>

        <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
          Your account setup has been started but is not yet complete.
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
        Continue where you left off by creating your password and completing the
        remaining steps required to activate your account.
      </p>

      <div className="mt-8 flex w-full items-center">
        <div
          className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-300 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
          onClick={() => {}}
        >
          <span className="pt-[1.5px]">Resume registration</span>
          <ChevronRight className="size-4.5 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
});

ResumeRegistrationCompletionFeedbackPage.displayName =
  'ResumeRegistrationCompletionFeedbackPage';

