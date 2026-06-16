import { LoaderIcon } from 'lucide-react';

import { cn } from '@repo/shared/lib/utils';

function Spinner4({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn('size-4 animate-spin', className)}
      {...props}
    />
  );
}

export default Spinner4;
