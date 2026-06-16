import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { RiMailLine } from '@remixicon/react';
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
  forgotPasswordSchema,
  type ForgotPasswordSchemaType,
} from '@repo/shared/validators/auth.validator';
import { Link } from 'react-router-dom';

type ForgotPasswordFormProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  onSubmit: (data: ForgotPasswordSchemaType) => Promise<void> | void;
  isSubmitting?: boolean;
};

function ForgotPasswordForm({
  className,
  isSubmitting = false,
  onSubmit,
  ...props
}: ForgotPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordSchemaType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  return (
    <div
      className={cn(
        'mx-auto flex w-full max-w-[450px] flex-col gap-8 space-y-6',
        className
      )}
      {...props}
    >
      {/* Header */}
      <div className="space-y-2 text-left">
        <FieldLabel className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Forgot password
        </FieldLabel>

        <FieldDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
          Enter your email address and we'll send you a reset link.
        </FieldDescription>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          {/* Email */}
          <Field data-invalid={!!errors.email}>
            <FieldLabel
              htmlFor="email"
              className="mb-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
            >
              Email Address
            </FieldLabel>

            <div className="group relative w-full">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiMailLine className="size-4" />
              </span>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                {...register('email')}
              />
            </div>

            <FieldError errors={[errors.email]} />
          </Field>

          {/* Submit */}
          <Field className="pt-2">
            <InteractiveHoverButton
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide shadow-sm shadow-primary/5 transition-all active:scale-[0.995]"
            >
              {isSubmitting ? 'Sending reset link...' : 'Send Reset Link'}
            </InteractiveHoverButton>
          </Field>

          {/* Back Link */}
          <div className="pt-2 text-center">
            <Link
              to="/auth/login"
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

export default ForgotPasswordForm;
