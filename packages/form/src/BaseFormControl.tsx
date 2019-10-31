import React from 'react';
import classNames from 'classnames';
import { VariantType } from './variants';
import { useVariant } from './FormGroup';
import './BaseFormControl.scss';

type Props = {
  /** Et skjemaelement med `entur-form-control`-klassen */
  children: React.ReactNode;
  /** Sett til true om skjema-elementet skal ha mørkt design i contrast mode */
  dark?: boolean;
  /** Sett til true om skjema-elementet er disabled */
  disabled?: boolean;
  /** Tekst eller ikon som vises foran skjema-elementet */
  prepend?: React.ReactNode;
  /** Tekst eller ikon som vises etter skjema-elementet */
  append?: React.ReactNode;
  /** Valideringsvariant */
  variant?: VariantType;
  [key: string]: any;
};

export const BaseFormControl: React.FC<Props> = ({
  children,
  dark = false,
  disabled = false,
  variant,
  prepend,
  append,
  ...rest
}) => {
  const variantFromFormGroup = useVariant();
  const currentVariant = variant || variantFromFormGroup;
  return (
    <div
      className={classNames('entur-form-control-wrapper', {
        'entur-form-control-wrapper--success': currentVariant === 'success',
        'entur-form-control-wrapper--error': currentVariant === 'error',
        'entur-form-control-wrapper--dark': dark,
        'entur-form-control-wrapper--disabled': disabled,
      })}
      {...rest}
    >
      {prepend && <div className="entur-form-control__prepend">{prepend}</div>}
      {children}
      {append && <div className="entur-form-control__append">{append}</div>}
    </div>
  );
};
