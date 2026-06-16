import { useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiMailLine,
} from '@remixicon/react';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../components/ui/field';
import { Input } from '../components/ui/input';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import { cn } from '../lib/utils';
import {
  type LoginSchemaType,
  loginSchema,
} from '../validators/auth.validator';

type LoginFormProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  onSubmit: (data: LoginSchemaType) => Promise<void> | void;
  isSubmitting?: boolean;
};

function LoginForm({
  className,
  onSubmit,
  isSubmitting = false,
  ...props
}: LoginFormProps) {
  const emailId = useId();
  const passwordId = useId();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
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
      {/* Dynamic Header Block */}
      <div className="space-y-2 text-left">
        <FieldLabel className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back
        </FieldLabel>
        <FieldDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
          Don&apos;t have an account?{' '}
          <Link
            to="/auth/gz/register/initiate-registration"
            className="pl-0.5 font-semibold text-slate-500 !no-underline transition-colors hover:text-primary dark:text-zinc-500"
          >
            Sign up
          </Link>
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          {/* Corporate Identifier Field */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel
              htmlFor={emailId}
              className="mb-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
            >
              Email Address
            </FieldLabel>
            <div className="group relative w-full">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiMailLine className="size-4" />
              </span>
              <Input
                id={emailId}
                type="email"
                placeholder="Enter your email address"
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                {...register('email')}
              />
            </div>
            <FieldError errors={[errors.email]} />
          </Field>

          {/* Core Security Passphrase Field */}
          <Field data-invalid={!!errors.password}>
            <div className="mb-1 flex items-center justify-between">
              <FieldLabel
                htmlFor={passwordId}
                className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
              >
                Password
              </FieldLabel>
              <Link
                to="/auth/gz/forgot-password"
                className="text-xs font-semibold text-slate-400 transition-colors hover:text-primary dark:text-zinc-500 dark:hover:text-white"
              >
                Forgot Password?
              </Link>
            </div>
            <div className="group relative w-full">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiLockLine className="size-4" />
              </span>
              <Input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pr-10 pl-10 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                disabled={isSubmitting}
                {...register('password')}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-900 focus:outline-none dark:text-zinc-500 dark:hover:text-white"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <RiEyeOffLine className="size-4" />
                ) : (
                  <RiEyeLine className="size-4" />
                )}
              </button>
            </div>
            <FieldError errors={[errors.password]} />
          </Field>

          {/* Form Action Submitter */}
          <Field className="pt-2">
            <InteractiveHoverButton
              className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide shadow-sm shadow-primary/5 transition-all active:scale-[0.995]"
              disabled={isSubmitting}
              type="submit"
            >
              <span className="transition-all duration-300">
                {isSubmitting ? 'Verifying Credentials...' : 'Sign in'}
              </span>
            </InteractiveHoverButton>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default LoginForm;
