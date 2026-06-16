import SuspenseLoader from '@/components/ui/suspense-loader';
import { observer } from 'mobx-react-lite';
import { lazy, Suspense } from 'react';
import { useInitiateRegistrationInteractor } from './interactor';

const RegisterForm = lazy(() => import('@repo/shared/forms/register.form'));

const InitiateRegistrationPage = observer(() => {
  const { notificationContextHolder, isSubmitting, onInitiateRegistration } =
    useInitiateRegistrationInteractor();

  return (
    <Suspense fallback={<SuspenseLoader />}>
      {notificationContextHolder}
      <RegisterForm
        onSubmit={onInitiateRegistration}
        isSubmitting={isSubmitting}
      />
    </Suspense>
  );
});

InitiateRegistrationPage.displayName = 'InitiateRegistrationPage';

export default InitiateRegistrationPage;
