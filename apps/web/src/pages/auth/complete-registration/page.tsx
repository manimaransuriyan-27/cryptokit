import { observer } from 'mobx-react-lite';
import React, { Suspense } from 'react';
import SuspenseLoader from '@/components/ui/suspense-loader';

const CompleteRegistrationForm = React.lazy(
  () => import('@repo/shared/forms/complete-registration.form')
);

const CompleteRegistrationPage = observer(() => {
  // const { notificationContextHolder, isSubmitting, onCompleteRegistration } =
  //   useCompleteRegistrationInteractor();

  return (
    <Suspense fallback={<SuspenseLoader />}>
      {/* {notificationContextHolder}
      <CompleteRegistrationForm
        onSubmit={onCompleteRegistration}
        isSubmitting={isSubmitting}
      /> */}
      <h1>Complete Registration Page</h1>
    </Suspense>
  );
});

CompleteRegistrationPage.displayName = 'CompleteRegistrationPage';

export default CompleteRegistrationPage;
