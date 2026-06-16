import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { RiEyeLine, RiEyeOffLine } from '@remixicon/react';
import { GlobalIcon } from 'hugeicons-react';
import { useForm } from 'react-hook-form';

import { Button } from '@repo/shared/components/ui/button';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '../components/ui/field';
import { Input } from '../components/ui/input';
import { cn } from '../lib/utils';

import {
  resetPasswordSchema,
  type ResetPasswordSchemaType,
} from '../validators/auth.validator';

type ResetPasswordFormProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  onSubmit: (data: ResetPasswordSchemaType) => Promise<void> | void;
  isSubmitting?: boolean;
};

function ResetPasswordForm({
  className,
  onSubmit,
  isSubmitting = false,
  ...props
}: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordSchemaType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  return (
    <div
      className={cn(
        'mx-auto flex max-w-[450px] flex-col gap-6 space-y-6',
        className
      )}
      {...props}
    >
      <form onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex size-8 items-center justify-center rounded-md">
              <GlobalIcon className="size-6" />
            </div>
            <h1 className="text-2xl font-semibold">Set New Password</h1>
          </div>

          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">New Password</FieldLabel>
            <div className="relative w-full">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                tabIndex={-1} // Keeps keyboard navigation native and unblocked
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

          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel htmlFor="confirmPassword">
              Confirm New Password
            </FieldLabel>
            <div className="relative w-full">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                disabled={isSubmitting}
                {...register('confirmPassword')}
              />
              <button
                type="button"
                onClick={() => setConfirmShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground focus:outline-none"
                tabIndex={-1} // Keeps keyboard navigation native and unblocked
                aria-label={
                  showConfirmPassword ? 'Hide password' : 'Show password'
                }
              >
                {showConfirmPassword ? (
                  <RiEyeOffLine className="size-4" />
                ) : (
                  <RiEyeLine className="size-4" />
                )}
              </button>
            </div>
            <FieldError errors={[errors.confirmPassword]} />
          </Field>
          <Field>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Reset Password'}
            </Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default ResetPasswordForm;
