import { AlertCircle, ChevronRight } from 'lucide-react';
import { memo } from 'react';

export const LinkExpiredFeedbackPage = memo(() => {
  return (
    <div className="w-full p-10">
      <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-amber-600 uppercase">
        <AlertCircle className="h-4 w-4" />
        Link Expired
      </div>

      <div className="space-y-3">
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Verification link expired
        </h1>

        <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
          This verification link is no longer valid.
        </p>
      </div>

      <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
        For security reasons, verification links expire after a limited time. To
        continue creating your account, request a new verification email and use
        the latest link sent to your inbox.
      </p>

      <div className="mt-8 flex w-full items-center">
        <div
          className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-300 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
          onClick={() => {}}
        >
          <span className="pt-[1.4px]">Resend verification email</span>
          <ChevronRight className="size-4 transition-all duration-300 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
});

LinkExpiredFeedbackPage.displayName = 'LinkExpiredFeedbackPage';
