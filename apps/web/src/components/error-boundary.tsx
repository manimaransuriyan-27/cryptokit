import { Component, type ErrorInfo, type ReactNode } from 'react';
import { useRouteError, isRouteErrorResponse } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }
      return (
        <DefaultErrorFallback error={this.state.error} reset={this.reset} />
      );
    }
    return this.props.children;
  }
}

import { AlertTriangle, RotateCcw } from 'lucide-react';

function DefaultErrorFallback({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-xl rounded-2xl border bg-background p-10 shadow-sm">
        <div className="mb-5 inline-flex items-center gap-1.5 rounded-md border border-red-500/30 bg-red-500/10 px-2.5 py-1 text-[12px] font-bold tracking-widest text-red-600 uppercase">
          <AlertTriangle className="h-4 w-4" />
          Application Error
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Something went wrong
          </h1>

          <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
            An unexpected error prevented this page from loading correctly.
          </p>
        </div>

        <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
          You can try again using the action below. If the problem persists,
          please contact support or refresh the application.
        </p>

        {import.meta.env.DEV && (
          <div className="mt-6 overflow-auto rounded-lg border bg-muted/40 p-4">
            <pre className="text-xs whitespace-pre-wrap text-muted-foreground">
              {error.message}
            </pre>
          </div>
        )}

        <button
          onClick={reset}
          className="group mt-8 inline-flex items-center gap-2 font-semibold text-primary/70 transition-colors hover:text-primary"
        >
          <RotateCcw className="h-4 w-4 transition-transform group-hover:rotate-[-45deg]" />
          Try again
        </button>
      </div>
    </div>
  );
}

export function RouteErrorFallback() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-4xl font-bold text-foreground">{error.status}</p>
        <p className="text-sm text-muted-foreground">{error.statusText}</p>
      </div>
    );
  }

  if (error instanceof Error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-lg text-xl text-destructive">Loader error</p>
        <p className="max-w-lg text-sm text-muted-foreground">
          {error.message}
        </p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-sm text-muted-foreground">
        An unexpected error occurred.
      </p>
    </div>
  );
}
