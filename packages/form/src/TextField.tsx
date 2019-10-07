import React from 'react';
import cx from 'classnames';
import { useVariant } from './FormGroup';
import { VariantType } from './variants';
import './TextField.scss';

type TextFieldProps = {
  prepend?: React.ReactNode;
  variant?: VariantType;
  disabled?: boolean;
  width?: 'fluid';
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
      <label className={cx('entur-textfield', classList)}>
        {prepend && <span className="entur-textfield--prepend">{prepend}</span>}
        <input
          className="entur-textfield--input"
          disabled={disabled}
          ref={ref}
          {...rest}
        />
      </label>
    );
  },
);
