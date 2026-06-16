import { ChevronRight } from 'lucide-react';
import { observer } from 'mobx-react-lite';
import { Navigate, useNavigate } from 'react-router-dom';
import { useTypedLocation } from '@/hooks/typed-hooks';
import { useAuthBroadcast } from '@/hooks/common/use-auth-broadcast';
import { useAuthStore } from '@/hooks/common/use-auth-store';
import type {
  InitiateRegistrationSuccessCode,
  InitiateRegistrationErrorCode,
} from '@/types';

const InitiateRegistrationFeedbackPage = observer(() => {
  const authStore = useAuthStore();
  const navigate = useNavigate();

  const location = useTypedLocation<{
    code: InitiateRegistrationSuccessCode | InitiateRegistrationErrorCode;
  }>();

  const code = location.state.code;

  useAuthBroadcast((data) => {
    if (data.event === 'EMAIL_VERIFIED') {
      navigate('/auth/gz/register/initiate-registration', { replace: true });
    }
  });

  if (!code) {
    return <Navigate to="/auth/gz/access-denied" replace />;
  }

  return (
    <div className="flex min-h-[80vh] w-full animate-in flex-col items-center justify-center px-4 py-12 duration-500 ease-out fade-in slide-in-from-right-4">
      {code === 'REGISTRATION_INITIATED' && authStore.emailId && (
        <div className="w-full p-10">
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Verify your email address
            </h1>
            <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
              A verification link has been sent to your email.
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
            Please click the link in the email to complete your registration. If
            you don't see it, check your spam folder or request a new link.
          </p>

          <div className="mt-8 flex w-full items-center gap-6">
            {/* Resend action */}
            <div
              className="group flex w-fit items-center gap-0.5 font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => {
                console.log('Resend verification email');
              }}
            >
              <span>Resend new verification link</span>
              <ChevronRight className="mb-[2px] size-4.5 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      )}
      {code === 'EMAIL_ALREADY_VERIFIED' && (
        <div className="w-full p-10">
          <div className="space-y-3">
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
              Account setup incomplete
            </h1>
            <p className="text-sm font-medium tracking-wide text-muted-foreground/80">
              Your email is verified, but your profile setup is not complete.
            </p>
          </div>

          <p className="mt-5 text-sm leading-6 tracking-wide text-muted-foreground">
            Click below to continue setting up your password and complete your
            registration.
          </p>

          <div className="mt-8 flex w-full items-center">
            <div
              className="group flex w-fit items-center font-semibold text-primary/60 transition-colors duration-200 hover:cursor-pointer hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              onClick={() => {}}
            >
              <span className="pt-[1.4px]">Complete your registration</span>
              <ChevronRight className="size-4.5 transition-all duration-200 group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

InitiateRegistrationFeedbackPage.displayName =
  'InitiateRegistrationFeedbackPage';

export default InitiateRegistrationFeedbackPage;
