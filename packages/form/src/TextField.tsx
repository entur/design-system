import React from 'react';
import './TextField.scss';
import {
  GenericFormComponent,
  GenericFormComponentProps,
} from './GenericFormComponent';
import cx from 'classnames';

type TextFieldPropsExtender = {
  /** Prepend icon or text inside the TextField */
  prepend?: React.ReactNode;
};

type TextFieldProps = TextFieldPropsExtender &
  Omit<GenericFormComponentProps, 'fieldType' | 'componentName'>;

export const TextField: React.RefForwardingComponent<
  HTMLInputElement,
  TextFieldProps
> = React.forwardRef(
  (
    { prepend, variant, disabled = false, className, ...rest },
    ref: React.Ref<HTMLInputElement>,
  ) => {
    const randId = 's';
    if (!prepend) {
      return (
        <GenericFormComponent
          id={randId}
          className={className}
          disabled={disabled}
          aria-invalid={variant === 'error'}
          ref={ref}
          componentName="input"
          inputType="input"
          variant={variant}
          {...rest}
        />
      );
    }
    return (
      <label className={cx(className, 'entur-form-component__input--wrapper')}>
        <span className="entur-form-component__input--prepend">{prepend}</span>
        <GenericFormComponent
          id={randId}
          disabled={disabled}
          aria-invalid={variant === 'error'}
          ref={ref}
          componentName="input"
          inputType="input"
          variant={variant}
          {...rest}
        />
      </label>
    );
  },
);
