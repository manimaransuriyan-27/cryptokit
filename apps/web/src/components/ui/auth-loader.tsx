import Spinner4 from '@repo/shared/components/spinner4';

interface AuthPageLoaderProps {
  message?: string;
}

const AuthPageLoader = ({
  message = 'Authenticating...',
}: AuthPageLoaderProps) => {
  return (
    <div className="fixed inset-0 z-[9999] flex h-screen w-screen flex-col items-center justify-center bg-background">
      <div className="relative flex items-center justify-center">
        <div className="absolute h-14 w-14 animate-ping rounded-full border border-emerald-500/30 bg-emerald-500/10" />
        <Spinner4 className="relative h-8 w-8 animate-spin text-emerald-500" />
      </div>

      {message && (
        <p className="animate-pulse mt-6 text-sm font-bold tracking-wider uppercase pt-5">
          {message}
        </p>
      )}
    </div>
  );
};

AuthPageLoader.displayName = 'AuthPageLoader';

export default AuthPageLoader;
