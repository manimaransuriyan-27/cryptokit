import { useNavigate } from 'react-router-dom';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { memo } from 'react';

export const AccountBannedFeedbackPage = memo(() => {
  const navigate = useNavigate();
  return (
    <div className="w-full p-10">
      <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-red-600 uppercase">
        <AlertCircle className="h-4 w-4" />
        Account Banned
      </div>
      <div className="space-y-3">
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          Administrative Termination
        </h1>
        <p className="text-sm font-medium text-muted-foreground/80">
          Your account has been permanently restricted
        </p>
      </div>
      <p className="mt-5 mb-6 text-sm leading-relaxed text-muted-foreground">
        Your profile is permanently restricted from accessing our services due
        to a severe violation of our Terms of Service or community guidelines.
        If you believe this action was taken in error, you may file an appeal by
        contacting support.
      </p>

      <div className="mt-8 flex w-full items-center">
        <div
          className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
          onClick={() => navigate('/auth/gz/login', { replace: true })}
        >
          <span>Return to Login In</span>
          <ChevronRight className="mb-[2px] size-4.5 transition-all duration-200 group-hover:translate-x-1" />
        </div>
      </div>
    </div>
  );
});

AccountBannedFeedbackPage.displayName = 'AccountBannedFeedbackPage';
