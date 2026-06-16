import Spinner4 from '@repo/shared/components/spinner4';
import { memo } from 'react';

const SuspenseLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <Spinner4 className="h-6 w-6 animate-spin text-emerald-300" />
    </div>
  );
};

SuspenseLoader.displayName = 'SuspenseLoader';

export default memo(SuspenseLoader);
