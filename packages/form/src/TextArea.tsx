import React from 'react';
import cx from 'classnames';
import './TextArea.scss';
import { useFormComponent } from './GenericFormComponent';
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
};

export const TextArea: React.RefForwardingComponent<
  HTMLAreaElement,
  TextAreaProps
> = React.forwardRef(
  (
    { variant, disabled = false, className, resize = false, width, ...rest },
    ref: React.Ref<HTMLTextAreaElement>,
  ) => {
    const cL = useFormComponent(variant, disabled, className, width);
    const classList = cx(cL, 'entur-form-component--textarea', {
      ['entur-form-component__textarea--resize']: resize,
    });
    return (
      <textarea disabled={disabled} className={classList} ref={ref} {...rest} />
    );
  },
);
