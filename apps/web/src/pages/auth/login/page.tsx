import { observer } from 'mobx-react-lite';
import { lazy, Suspense } from 'react';
import SuspenseLoader from '@/components/ui/suspense-loader';
import { loginInteractor } from './interactor';

const LoginForm = lazy(() => import('@repo/shared/forms/login.form'));

const LoginPage = observer(() => {
  const { contextHolder, isSubmitting, onLogin } = loginInteractor();
  return (
    <Suspense fallback={<SuspenseLoader />}>
      {contextHolder}
      <div className="relative">
        {isSubmitting && (
          <div className="fixed inset-0 z-50 cursor-not-allowed bg-black/10 backdrop-blur-[0.5px]" />
        )}
        <LoginForm onSubmit={onLogin} isSubmitting={isSubmitting} />
      </div>
    </Suspense>
  );
});

LoginPage.displayName = 'LoginPage';

export default LoginPage;
