import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiShieldKeyholeLine } from '@remixicon/react';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../components/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '../components/ui/input-otp';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import { cn } from '../lib/utils';
import {
  type LoginOtpSchemaType,
  loginOtpSchema,
} from '../validators/auth.validator';

type LoginOtpFormProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  onSubmit: (data: LoginOtpSchemaType) => Promise<void> | void;
  onResendOtp?: () => Promise<void> | void;
  duration?: number;
  isSubmitting?: boolean;
  isResending?: boolean;
  email?: string;
};

function LoginOtpForm({
  className,
  onSubmit,
  onResendOtp,
  duration = 120,
  isSubmitting = false,
  isResending = false,
  email = 'your email',
  ...props
}: LoginOtpFormProps) {
  const [countdown, setCountdown] = useState(duration);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const handleResend = async () => {
    if (countdown > 0 || !onResendOtp) return;
    try {
      await onResendOtp();
      setCountdown(duration);
    } catch (error) {
      console.error('Failed to resend OTP:', error);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginOtpSchemaType>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: {
      otp: '',
    },
  });

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[450px] flex-col gap-8 space-y-6',
        className
      )}
      {...props}
    >
      <div className="space-y-2 text-left">
        <FieldLabel className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Security Verification
        </FieldLabel>
        <FieldDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
          We sent a 6-digit verification code to{' '}
          <span className="font-semibold text-slate-700 dark:text-zinc-200">
            {email}
          </span>
          .
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-6">
          {/* OTP Input Field */}
          <Field
            data-invalid={!!errors.otp}
            className="flex flex-col items-center justify-center"
          >
            <div className="mb-2 flex w-full items-center justify-between">
              <FieldLabel className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500">
                Verification Code
              </FieldLabel>

              {/* Contextual Icon Indicator */}
              <span className="text-slate-400 dark:text-zinc-500/70">
                <RiShieldKeyholeLine className="size-4" />
              </span>
            </div>

            <div className="flex w-full justify-center">
              <Controller
                control={control}
                name="otp"
                render={({ field }) => (
                  <InputOTP
                    maxLength={6}
                    disabled={isSubmitting}
                    disabled-container={isSubmitting.toString()}
                    {...field}
                  >
                    <InputOTPGroup className="gap-2.5">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <InputOTPSlot
                          key={index}
                          index={index}
                          className="h-12 w-12 rounded-xl border-slate-200 bg-slate-50/50 text-lg font-semibold transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 data-[active=true]:ring-2 data-[active=true]:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                        />
                      ))}
                    </InputOTPGroup>
                  </InputOTP>
                )}
              />
            </div>

            <FieldError
              errors={[errors.otp]}
              className="mt-2 w-full text-left"
            />
          </Field>

          {/* Action Submitter */}
          <Field className="pt-2">
            <InteractiveHoverButton
              className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide shadow-sm shadow-primary/5 transition-all active:scale-[0.995]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Verifying Code...' : 'Verify & Sign In'}
            </InteractiveHoverButton>
          </Field>

          {/* Resend Actions & Back Navigation */}
          <div className="flex flex-col items-center justify-center gap-4 pt-2 text-center">
            <button
              type="button"
              disabled={countdown > 0 || isResending || isSubmitting}
              onClick={handleResend}
              className={cn(
                'text-sm font-semibold transition-colors duration-200',
                countdown > 0
                  ? 'cursor-not-allowed text-slate-400 dark:text-zinc-500'
                  : 'cursor-pointer text-zinc-400 hover:text-primary'
              )}
            >
              {isResending
                ? 'Requesting new code...'
                : countdown > 0
                  ? `Resend code in ${countdown}s`
                  : 'Resend Verification Code'}
            </button>

            <Link
              to="/auth/gz/login"
              className="text-xs font-semibold text-slate-400 transition-colors hover:text-primary dark:text-zinc-500 dark:hover:text-white"
            >
              Back to Sign In
            </Link>
          </div>
        </FieldGroup>
      </form>
    </div>
  );
}

export default LoginOtpForm;
