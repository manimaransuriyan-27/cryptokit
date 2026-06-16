import SuspenseLoader from '@/components/ui/suspense-loader';
import { observer } from 'mobx-react-lite';
import React, { Suspense } from 'react';

const ResetPasswordForm = React.lazy(
  () => import('@repo/shared/forms/reset-password.form')
);

const ResetPasswordPage = observer(() => {
  return (
    <Suspense fallback={<SuspenseLoader />}>
      <ResetPasswordForm onSubmit={async () => {}} isSubmitting={false} />
    </Suspense>
  );
});

ResetPasswordPage.displayName = 'ResetPasswordPage';

export default ResetPasswordPage;
