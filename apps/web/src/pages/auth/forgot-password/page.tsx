import { observer } from 'mobx-react-lite';
import React, { Suspense } from 'react';
import type { ForgotPasswordSchemaType } from '@repo/shared/validators/auth.validator';
import SuspenseLoader from '@/components/ui/suspense-loader';

const ForgotPasswordForm = React.lazy(
  () => import('@repo/shared/forms/forgot-password.form')
);

const ForgotPasswordPage = observer(() => {
  const handleSubmit = async (data: ForgotPasswordSchemaType) => {
    console.log('Login ', data);
  };

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <ForgotPasswordForm onSubmit={handleSubmit} isSubmitting={false} />
    </Suspense>
  );
});

ForgotPasswordPage.displayName = 'ForgotPasswordPage';

export default ForgotPasswordPage;
