import React from 'react';
import cx from 'classnames';
import { useVariant } from './FormGroup';
import { VariantType } from './variants';
import './TextField.scss';

type TextFieldProps = {
  /** Ikon som kommer før tekstfeltet */
  prepend?: React.ReactNode;
  /** Hvilken valideringsfarge som vises. Hentes fra FormGroup om mulig */
  variant?: VariantType;
  /** Deaktiver tekstfeltet */
  disabled?: boolean;
  /** Sett bredden på feltet. Verdien "fluid" setter bredden til 100 % av containeren */
  width?: 'fluid';
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const TextField: React.RefForwardingComponent<
  HTMLInputElement,
  TextFieldProps
> = React.forwardRef(
  (
    { prepend, variant, disabled = false, width, className, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const formGroupVariant: any = useVariant();
    const prioritizedVariant: any = variant || formGroupVariant;
    const classList = cx(
      'entur-textfield',
      {
        [`entur-textfield--variant-${prioritizedVariant}`]: prioritizedVariant,
        [`entur-textfield--disabled`]: disabled,
        [`entur-textfield--width-${width}`]: width,
      },
      className,
    );
    return (
      <label className={classList}>
        {prepend && <span className="entur-textfield--prepend">{prepend}</span>}
        <input
          className="entur-textfield--input"
          disabled={disabled}
          aria-invalid={prioritizedVariant === 'error'}
          ref={ref}
          {...rest}
        />
      </label>
    );
  },
);
