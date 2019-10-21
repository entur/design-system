import React from 'react';
import './TextArea.scss';
import { useFormComponentClasses } from './FormComponentClasses';
import { VariantType } from './variants';

type TextAreaProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;
  /** Settes til 'fluid' for flytende textarea */
  width?: 'fluid';
  /** Settes for å style komponenten basert på state */
  variant?: VariantType;
  /** For å deaktivere inputfeltet */
  disabled?: boolean;
  /** true for å tillate resize horistontalt */
  resize?: boolean;
  [key: string]: any;
};

export const TextArea: React.RefForwardingComponent<
  HTMLTextAreaElement,
  TextAreaProps
> = React.forwardRef(
  (
    {
      variant = 'none',
      disabled = false,
      className,
      resize = false,
      width,
      ...rest
    },
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    const classList = useFormComponentClasses({
      variant: variant as VariantType,
      disabled,
      className: [
        'entur-form-component--textarea',
        className,
        { ['entur-form-component__textarea--resize']: resize },
      ],
      width,
    });

    return (
      <textarea
        disabled={disabled}
        aria-invalid={variant === 'error'}
        className={classList}
        ref={ref}
        {...rest}
      />
    );
  },
);
