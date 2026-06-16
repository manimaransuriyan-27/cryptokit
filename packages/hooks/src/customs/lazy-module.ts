import React from 'react';

// Enforce that the imported file must at least have a default export React Component
interface LazyRouteModule {
  default: React.ComponentType<any>;
  loader?: (...args: any[]) => any;
  action?: (...args: any[]) => any;
  ErrorBoundary?: React.ComponentType<any>;
  [key: string]: any; // Allows other custom named exports
}

/**
 * Enhanced generic lazy loader for React Router data routers.
 * Automatically maps default exports to 'Component' and retains file loaders/actions.
 */
export const lazyModule = <T extends LazyRouteModule>(importFn: () => Promise<T>) => {
  return async () => {
    try {
      const module = await importFn();

      // Destructure 'default' as capital-C 'Component' (what React Router expects)
      const { default: Component, ...rest } = module;

      return {
        Component,
        ...rest, // Forwards loader, action, or ErrorBoundary if they exist in the file
      };
    } catch (error) {
      console.error('Failed to dynamically load route chunk:', error);

      /* * 🔥 CRITICAL PRODUCTION SAFEGUARD: ChunkLoadError Recovery
       * When you deploy a new version of your app, old JS chunk files are deleted from the server.
       * If an active user clicks a link, the browser crashes trying to download the missing old chunk.
       * This interceptor catches that specific error and forces a hard reload to pull the new deployment manifest.
       */
      if (typeof window !== 'undefined') {
        const errorText = String(error).toLowerCase();
        if (errorText.includes('chunk') || errorText.includes('loading')) {
          window.location.reload();
        }
      }

      throw error;
    }
  };
};
