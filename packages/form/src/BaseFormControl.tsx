import React from 'react';
import classNames from 'classnames';
import { VariantType } from './variants';
import { useVariant } from './InputGroup';
import './BaseFormControl.scss';

type Props = {
  /** Et skjemaelement med `entur-form-control`-klassen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
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
  className,
  dark = false,
  disabled = false,
  variant,
  prepend,
  append,
  ...rest
}) => {
  const variantFromInputGroup = useVariant();
  const currentVariant = variant || variantFromInputGroup;
  return (
    <div
      className={classNames('entur-form-control-wrapper', className, {
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
