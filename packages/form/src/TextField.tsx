import React from 'react';
import { VariantType } from './variants';
import { BaseFormControl } from './BaseFormControl';

type TextFieldProps = {
  /** Tekst eller ikon som kommer før inputfeltet */
  prepend?: React.ReactNode;
  /** Tekst eller ikon som kommer etter inputfeltet */
  append?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Hvilken valideringsfarge som vises */
  variant?: VariantType;
  /** Deaktiver tekstfeltet */
  disabled?: boolean;
  [key: string]: any;
};

export const TextField: React.RefForwardingComponent<
  HTMLInputElement,
  TextFieldProps
> = React.forwardRef(
  (
    { prepend, append, variant, disabled = false, className, style, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    return (
      <BaseFormControl
        disabled={disabled}
        variant={variant}
        prepend={prepend}
        append={append}
        className={className}
        style={style}
      >
        <input
          aria-invalid={variant === 'error'}
          className="eds-form-control"
          disabled={disabled}
          ref={ref}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);
