import { useNavigate } from 'react-router-dom';
import { Button } from '@repo/shared/components/ui/button';
import { ArrowLeft, Home, Compass } from 'lucide-react';

interface PageNotFoundProps {
  title?: string;
  description?: string;
  homePath?: string;
}

export function PageNotFound({
  title = 'Page not found',
  description = "Sorry, we couldn't find the page you're looking for. It might have been moved, deleted, or perhaps it never existed in this dimension.",
  homePath = '/',
}: PageNotFoundProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 text-foreground sm:py-32 lg:px-8">
      {/* Decorative Background Grid (Matches your Auth layout continuity) */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:32px_32px]" />

      {/* Premium Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-[120px] dark:bg-primary/10" />

      <div className="relative z-10 max-w-md text-center">
        {/* Animated Icon Container */}
        <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl border border-border bg-muted text-primary shadow-sm ring-1 ring-border/5">
          <Compass className="h-8 w-8 stroke-[1.5]" />
        </div>

        {/* Status Code Header */}
        <p className="text-sm font-semibold tracking-widest text-primary uppercase">
          Error 404
        </p>

        {/* Title */}
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h1>

        {/* Description */}
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          {description}
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-full min-w-[130px] cursor-pointer shadow-sm sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>

          <Button
            onClick={() => navigate(homePath)}
            className="w-full min-w-[130px] cursor-pointer shadow-sm sm:w-auto"
          >
            <Home className="mr-1 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>

      {/* Subtle Footer branding matching your system style */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs font-medium tracking-wider text-muted-foreground/60">
        Cryptokit
      </div>
    </div>
  );
}
