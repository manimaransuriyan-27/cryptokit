import { useId, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  RiEyeLine,
  RiEyeOffLine,
  RiLockLine,
  RiUser3Line,
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
import { PhoneInput } from '../components/ui/phone-input';
import { cn } from '../lib/utils';
import {
  completeRegistrationSchema,
  type CompleteRegistrationSchemaType,
} from '../validators/auth.validator';

interface CompleteRegistrationFormProps {
  onSubmit: (data: CompleteRegistrationSchemaType) => Promise<void> | void;
  isSubmitting?: boolean;
}

function CompleteRegistrationForm({
  className,
  onSubmit,
  isSubmitting = false,
  ...props
}: Omit<React.ComponentProps<'div'>, 'onSubmit'> &
  CompleteRegistrationFormProps) {
  const nameId = useId();
  const phoneId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<CompleteRegistrationSchemaType>({
    resolver: zodResolver(completeRegistrationSchema),
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      password: '',
      confirmPassword: '',
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
          Complete your profile
        </FieldLabel>

        <FieldDescription className="text-sm font-medium text-slate-500 dark:text-zinc-400">
          Finish setting up your account to start trading cryptocurrencies.
        </FieldDescription>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <FieldGroup className="gap-5">
          {/* Last Name */}
          <Field data-invalid={!!errors.firstName}>
            <FieldLabel
              htmlFor={nameId}
              className="mb-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
            >
              First Name
            </FieldLabel>

            <div className="group relative w-full">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiUser3Line className="size-4" />
              </span>
              <Input
                id={nameId}
                type="text"
                placeholder="First name"
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                {...register('firstName')}
              />
            </div>

            <FieldError errors={[errors.firstName]} />
          </Field>

          {/* Last Name */}
          <Field data-invalid={!!errors.lastName}>
            <FieldLabel
              htmlFor={nameId}
              className="mb-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
            >
              Last Name
            </FieldLabel>

            <div className="group relative w-full">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiUser3Line className="size-4" />
              </span>

              <Input
                id={nameId}
                type="text"
                placeholder="Last name"
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pl-10 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                {...register('lastName')}
              />
            </div>

            <FieldError errors={[errors.lastName]} />
          </Field>
          {/* Phone */}
          <Field data-invalid={!!errors.phone}>
            <div className="mb-1 flex items-center justify-between">
              <FieldLabel
                htmlFor={phoneId}
                className="text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
              >
                Phone Number
              </FieldLabel>

              {/* <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
                Optional
              </span> */}
            </div>

            <div className="group relative w-full">
              <Controller
                name="phone"
                control={control}
                render={({ field: { onChange, ...fieldProps } }) => (
                  <PhoneInput
                    {...fieldProps}
                    id={phoneId}
                    defaultCountry="IN"
                    placeholder="Phone number"
                    disabled={isSubmitting}
                    onChange={(value) => onChange(value)}
                  />
                )}
              />
            </div>
            <FieldError errors={[errors.phone]} />
          </Field>

          {/* Password */}
          <Field data-invalid={!!errors.password}>
            <FieldLabel
              htmlFor={passwordId}
              className="mb-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
            >
              Password
            </FieldLabel>

            <div className="group relative w-full">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiLockLine className="size-4" />
              </span>

              <Input
                id={passwordId}
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pr-10 pl-10 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
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

          {/* Confirm Password */}
          <Field data-invalid={!!errors.confirmPassword}>
            <FieldLabel
              htmlFor={confirmPasswordId}
              className="mb-1 text-[11px] font-bold tracking-widest text-slate-400 uppercase dark:text-zinc-500"
            >
              Confirm Password
            </FieldLabel>

            <div className="group relative w-full">
              <span className="absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 transition-colors duration-200 group-focus-within:text-primary dark:text-zinc-500/70">
                <RiLockLine className="size-4" />
              </span>

              <Input
                id={confirmPasswordId}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm Password"
                disabled={isSubmitting}
                className="h-11 rounded-xl border-slate-200 bg-slate-50/50 pr-10 pl-10 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background"
                {...register('confirmPassword')}
              />

              <button
                type="button"
                onClick={() => setConfirmShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3.5 -translate-y-1/2 cursor-pointer text-slate-400 transition-colors hover:text-slate-900 focus:outline-none dark:text-zinc-500 dark:hover:text-white"
                tabIndex={-1}
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
          {/* Submit */}
          <Field className="pt-2">
            <InteractiveHoverButton
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full cursor-pointer rounded-xl text-sm font-semibold tracking-wide shadow-sm shadow-primary/5 transition-all active:scale-[0.995]"
            >
              {isSubmitting ? 'Creating Profile...' : 'Complete Registration'}
            </InteractiveHoverButton>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

export default CompleteRegistrationForm;
