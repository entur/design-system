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
  /** Setter tekstområdet i read-only modus */
  readOnly?: boolean;
  [key: string]: any;
};

export const TextArea: React.RefForwardingComponent<
  HTMLTextAreaElement,
  TextAreaProps
> = React.forwardRef(
  (
    { variant, disabled = false, readOnly = false, className, style, ...rest },
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    return (
      <BaseFormControl
        className={className}
        disabled={disabled}
        readOnly={readOnly}
        variant={variant}
        style={style}
      >
        <textarea
          className="eds-form-control eds-textarea"
          ref={ref}
          readOnly={readOnly}
          {...rest}
        />
      </BaseFormControl>
    );
  },
);
