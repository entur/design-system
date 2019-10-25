import React from 'react';
import { VariantType } from './variants';
import { useFormComponentClasses } from './FormComponentClasses';
import './Dropdown.scss';
type DropdownProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;
  /** Settes til 'fluid' for flytende textarea */
  width?: 'fluid';
  /** Settes for å style komponenten basert på state */
  variant?: VariantType;
  /** For å deaktivere inputfeltet */
  disabled?: boolean;
  [key: string]: any;
};

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  width,
  variant = 'none',
  disabled = false,
  ...rest
}) => {
  const classList = useFormComponentClasses({
    variant: variant as VariantType,
    disabled,
    className: ['entur-form-component--dropdown', className],
    width,
  });

  return (
    <select className={classList} {...rest}>
      <option value="1">Heisann</option>
    </select>
  );
};

type DropdownItemProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;
  [key: string]: any;
};

export const DropdownItem: React.FC<DropdownItemProps> = ({
  className,
  ...rest
}) => {
  return <option className={className} {...rest}></option>;
};
