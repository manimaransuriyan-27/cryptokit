import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

interface UnexpectedErrorPageProps {
  error?: Error;
  resetErrorBoundary?: () => void;
}

const UnexpectedErrorPage = ({
  error,
  resetErrorBoundary,
}: UnexpectedErrorPageProps) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
  }, []);

  const handleRetry = () => {
    if (resetErrorBoundary) {
      resetErrorBoundary();
    } else {
      window.location.reload();
    }
  };

  return (
    <div
      className={`flex min-h-[80vh] flex-col justify-center px-4 py-12 transition-all duration-500 ease-out ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
      }`}
    >
      <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 text-center">
        {/* Warning Icon with amber tint */}
        <div className="mb-4 rounded-full bg-amber-50 p-3 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400">
          <AlertTriangle className="h-6 w-6" />
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>
          <h2 className="mt-2 text-base font-medium text-foreground/80">
            An unexpected error has occurred
          </h2>

          <p className="mt-2 max-w-lg text-sm text-gray-500 dark:text-gray-400">
            {error?.message ||
              "We're having trouble loading this page. Please try refreshing or head back to the dashboard."}
          </p>

          {/* Action Callouts */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-amber-500 dark:bg-amber-700 dark:hover:bg-amber-600"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>

            <a
              href="/"
              className="flex items-center gap-2 rounded-md border border-gray-200 bg-transparent px-4 py-2 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-900"
            >
              <Home className="h-4 w-4" />
              Go Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(UnexpectedErrorPage);
