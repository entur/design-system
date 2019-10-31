import React from 'react';
import classNames from 'classnames';
import { VariantType } from './variants';
import { BaseFormControl } from './BaseFormControl';

type TextAreaProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Valideringsvariant */
  variant?: VariantType;
  /** Deaktiverer tekstområdet */
  disabled?: boolean;
  [key: string]: any;
};

export const TextArea: React.RefForwardingComponent<
  HTMLTextAreaElement,
  TextAreaProps
> = React.forwardRef(
  (
    { variant, disabled = false, className, ...rest },
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    return (
      <BaseFormControl disabled={disabled} variant={variant}>
        <textarea
          className={classNames(
            'entur-form-control',
            'entur-textarea',
            className,
          )}
          ref={ref}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);
