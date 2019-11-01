import React from 'react';
import { VariantType } from './variants';
import { BaseFormControl } from './BaseFormControl';
import './TextArea.scss';

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
    { variant, disabled = false, className, style, ...rest },
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    return (
      <BaseFormControl
        className={className}
        disabled={disabled}
        variant={variant}
        style={style}
      >
        <textarea
          className="entur-form-control entur-textarea"
          ref={ref}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);
