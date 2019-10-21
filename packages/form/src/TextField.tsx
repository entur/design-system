import React from 'react';
import './TextField.scss';
import { useFormComponentClasses } from './FormComponentClasses';
import { VariantType } from './variants';

type TextFieldProps = {
  /** Tekst eller ikon som kommer før inputfeltet */
  prepend?: React.ReactNode;
  /** Tekst eller ikon som kommer etter inputfeltet */
  append?: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Sett bredden på feltet. Verdien "fluid" setter bredden til 100 % av containeren */
  width?: 'fluid';
  /** Hvilken valideringsfarge som vises. Hentes fra FormGroup om mulig */
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
    {
      prepend,
      append,
      variant = 'none',
      disabled = false,
      width,
      className,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = useFormComponentClasses({
      variant: variant as VariantType,
      disabled,
      className: ['entur-form-component--input', className],
      width,
    });
    if (prepend || append) {
      return (
        <label className={classList}>
          {prepend && (
            <span className="entur-form-component--input--prepend">
              {prepend}
            </span>
          )}
          <input
            disabled={disabled}
            aria-invalid={variant === 'error'}
            ref={ref}
            {...rest}
          />
          {append && (
            <span className="entur-form-component--input--append">
              {append}
            </span>
          )}
        </label>
      );
    } else {
      return (
        <input
          className={classList}
          disabled={disabled}
          aria-invalid={variant === 'error'}
          ref={ref}
          {...rest}
        />
      );
    }
  },
);
