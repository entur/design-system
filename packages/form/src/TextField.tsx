import React from 'react';
import cx from 'classnames';
import './TextField.scss';
import './GenericFormComponent.scss';
import { useFormComponent } from './GenericFormComponent';
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
    { prepend, append, variant, disabled = false, width, className, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = useFormComponent(variant, disabled, className, width);
    if (prepend || append) {
      return (
        <label className={cx(classList, 'entur-form-component--input')}>
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
          className={cx(classList, 'entur-form-component--input')}
          disabled={disabled}
          aria-invalid={variant === 'error'}
          ref={ref}
          {...rest}
        />
      );
    }
  },
);
