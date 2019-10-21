import React from 'react';
import cx from 'classnames';
import './TextField.scss';
import './GenericFormComponent.scss';
import { useFormComponent } from './GenericFormComponent';
import { VariantType } from './variants';

type TextFieldProps = {
  /** Tekst eller ikoner som kommer før inputfeltet */
  prepend?: React.ReactNode;
  /** Tekst eller ikoner som kommer etter inputfeltet */
  append?: React.ReactNode;
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;
  /** Settes til 'fluid' for flytende inputfelt */
  width?: 'fluid';
  /** Settes for å style komponenten basert på state */
  variant?: VariantType;
  /** For å deaktivere inputfeltet */
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
