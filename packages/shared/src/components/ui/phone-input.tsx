import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { Input } from './input';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { cn } from '@repo/shared/lib/utils';

type PhoneInputProps = Omit<
  React.ComponentProps<'input'>,
  'onChange' | 'value'
> &
  Omit<RPNInput.Props<typeof RPNInput.default>, 'onChange'> & {
    onChange?: (value: RPNInput.Value) => void;
  };

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, onChange, value, ...props }, ref) => {
    return (
      <RPNInput.default
        ref={ref as any}
        className={cn('flex gap-2 rounded-xl', className)}
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={InputComponent}
        value={value}
        onChange={(v) => onChange?.(v || ('' as RPNInput.Value))}
        {...props}
      />
    );
  }
);
PhoneInput.displayName = 'PhoneInput';

const InputComponent = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<'input'>
>(({ className, ...props }, ref) => (
  <Input
    className={cn(
      'h-11 rounded-xl border-slate-200 bg-slate-50/50 px-4 transition-all duration-200 focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:focus-visible:bg-background',
      className
    )}
    ref={ref}
    {...props}
  />
));
InputComponent.displayName = 'InputComponent';

type CountrySelectOption = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: CountrySelectOption[];
};

const CountrySelect = ({
  disabled,
  value,
  onChange,
  options,
}: CountrySelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={true}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="flex h-11 shrink-0 gap-1.5 rounded-xl border-slate-200 bg-slate-50/50 px-3 shadow-none hover:bg-slate-100 focus:ring-2 focus:ring-primary/20 dark:border-zinc-800 dark:bg-zinc-900/30 dark:hover:bg-zinc-900"
        >
          <FlagComponent country={value} countryName={value} />
          <ChevronsUpDown
            className={cn('-mr-1 size-3.5 text-slate-400 opacity-50')}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-[300px] rounded-xl p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList className="max-h-[250px]">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {options
                .filter((x) => x.value)
                .map((option) => (
                  <CommandItem
                    className="cursor-pointer gap-2 text-sm"
                    key={option.value}
                    onSelect={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                  >
                    <FlagComponent
                      country={option.value}
                      countryName={option.label}
                    />
                    <span className="flex-1 font-medium">{option.label}</span>
                    {option.value && (
                      <span className="text-xs text-muted-foreground">
                        {`+${RPNInput.getCountryCallingCode(option.value)}`}
                      </span>
                    )}
                    <Check
                      className={cn(
                        'ml-auto size-4 transition-opacity',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

const FlagComponent = ({
  country,
  countryName,
}: {
  country: RPNInput.Country;
  countryName: string;
}) => {
  const Flag = flags[country];
  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-xs bg-muted">
      {Flag ? (
        <Flag title={countryName} />
      ) : (
        <span className="text-xs">🏳️</span>
      )}
    </span>
  );
};

export { PhoneInput };
