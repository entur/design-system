import React from 'react';
import classNames from 'classnames';
import { VariantType } from './variants';
import { useVariant } from './InputGroup';
import './BaseFormControl.scss';

type Props = {
  /** Et skjemaelement med `eds-form-control`-klassen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Sett til true om skjema-elementet skal ha mørkt design i contrast mode */
  dark?: boolean;
  /** Sett til true om skjema-elementet er disabled */
  disabled?: boolean;
  /** Sett til true om skjema-elementet er i read-only modus */
  readOnly?: boolean;
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
  readOnly = false,
  variant,
  prepend,
  append,
  ...rest
}) => {
  const variantFromInputGroup = useVariant();
  const currentVariant = variant || variantFromInputGroup;
  return (
    <div
      className={classNames('eds-form-control-wrapper', className, {
        'eds-form-control-wrapper--success': currentVariant === 'success',
        'eds-form-control-wrapper--error': currentVariant === 'error',
        'eds-form-control-wrapper--dark': dark,
        'eds-form-control-wrapper--disabled': disabled,
        'eds-form-control-wrapper--readonly': readOnly,
      })}
      {...rest}
    >
      {prepend && <div className="eds-form-control__prepend">{prepend}</div>}
      {children}
      {append && <div className="eds-form-control__append">{append}</div>}
    </div>
  );
};
