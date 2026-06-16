import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { RiMailLine } from '@remixicon/react';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from '../components/ui/field';
import { Input } from '../components/ui/input';
import { InteractiveHoverButton } from '../components/ui/interactive-hover-button';
import { cn } from '../lib/utils';
import {
  type RegisterInitiateSchemaType,
  registerInitiateSchema,
} from '../validators/auth.validator';

type RegisterFormProps = Omit<React.ComponentProps<'div'>, 'onSubmit'> & {
  onSubmit: (data: RegisterInitiateSchemaType) => Promise<void> | void;
  isSubmitting?: boolean;
};

function RegisterForm({
  className,
  onSubmit,
  isSubmitting = false,
  ...props
}: RegisterFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInitiateSchemaType>({
    resolver: zodResolver(registerInitiateSchema),
    defaultValues: {
      email: '',
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
      {/* Header */}
      <div className="space-y-2 text-left">
        <FieldLabel className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Create your account
        </FieldLabel>

        <FieldDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
          Already have an account?{' '}
          <Link
            to="/auth/gz/login"
            className="font-semibold text-slate-500 !no-underline transition-colors hover:text-primary dark:text-zinc-500"
          >
            Sign in
          </Link>
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
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiMailLine className="size-4" />
              </span>

              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                {...register('email')}
              />
            </div>

            <FieldError errors={[errors.email]} />
          </Field>

          {/* Submit */}
          <Field className="pt-2">
            <InteractiveHoverButton
              className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide shadow-sm shadow-primary/5 transition-all active:scale-[0.995]"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? 'Sending verification...' : 'Create Account'}
            </InteractiveHoverButton>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default RegisterForm;
