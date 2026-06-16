import { ShieldAlert } from 'lucide-react';
import { memo } from 'react';

const UnauthorizedPage = () => {
  return (
    <div className="items- flex min-h-[80vh] animate-in flex-col justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        <div className="mb-4 rounded-full bg-red-50 p-3 text-red-600 dark:bg-red-950/30 dark:text-red-400">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Unauthorized Access
          </h1>
          <h2 className="mt-2 text-base font-medium text-foreground/80">
            Sorry, you can’t view this page right now
          </h2>
          <p className="mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
            You don’t have permission to access this content, or your session
            has expired.
          </p>
        </div>
      </div>
    </div>
  );
};

UnauthorizedPage.displayName = 'UnauthorizedPage';

export default memo(UnauthorizedPage);
