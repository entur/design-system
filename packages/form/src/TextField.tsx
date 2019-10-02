import React from 'react';
import cx from 'classnames';
import { useVariant } from './FormGroup';
import './TextField.scss';

type variants = 'success' | 'error' | 'warning' | 'info' | 'none';
type TextFieldProps = {
  prepend?: React.ReactNode;
  variant?: variants;
  disabled?: boolean;
  width?: 'fluid';
  className?: string;
  required?: boolean;
  [key: string]: any;
};

export const TextField: React.RefForwardingComponent<
  HTMLInputElement,
  TextFieldProps
> = React.forwardRef(
  (
    {
      prepend,
      variant,
      disabled = false,
      width,
      className,
      required = false,
      ...rest
    },
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
      <label className={cx('entur-textfield--container', classList)}>
        {prepend && (
          <span className=" entur-textfield entur-textfield--prepend">
            {prepend}
          </span>
        )}
        <input
          className="entur-textfield entur-textfield--input"
          disabled={disabled}
          ref={ref}
          required={required}
          {...rest}
        />
      </label>
    );
  },
);
