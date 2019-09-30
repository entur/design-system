import React from 'react';
import cx from 'classnames';
import './styles.scss';

type TextFieldProps = {
  prepend?: React.ReactNode;
  variant?: 'success' | 'error' | 'warning' | 'info' | 'none';
  disabled: boolean;
  fluid: boolean;
  size: 'medium' | 'lagre';
  label: string;
  className?: string;
  required: boolean;
  id?: string;
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
      fluid = false,
      size,
      className,
      label,
      required = false,
      ...rest
    },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const classList = cx(
      'entur-textfield',
      {
        [`entur-textfield--variant-${variant}`]: variant,

        [`entur-textfield--disabled`]: disabled,
      },
      className,
    );

    return (
      <>
        <label
          className={cx('entur-textfield--wrapper', {
            [`entur-textfield--size-${size}`]: size,

            [`entur-textfield--fluid`]: fluid,
          })}
        >
          <div className="entur-textfield--label">
            {label}
            {required && '*'}
          </div>
          <div
            className={cx(classList, 'entur-textfield--container', className)}
          >
            {prepend && (
              <span className="entur-textfield--prepend">{prepend}</span>
            )}
            <input
              className="entur-textfield--input"
              disabled={disabled}
              ref={ref}
              required={required}
              {...rest}
            />
          </div>
        </label>
      </>
    );
  },
);
