import React from 'react';
import classNames from 'classnames';
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
    { prepend, append, variant, disabled = false, className, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    return (
      <BaseFormControl
        disabled={disabled}
        variant={variant}
        prepend={prepend}
        append={append}
      >
        <input
          aria-invalid={variant === 'error'}
          className={classNames('entur-form-control', className)}
          disabled={disabled}
          ref={ref}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);
