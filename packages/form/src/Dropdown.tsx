import React from 'react';
import { VariantType } from './variants';
import { useFormComponentClasses } from './FormComponentClasses';
import './Dropdown.scss';

type DropdownProps = {
  /** Klasse som sendes til komponenten. Bruk denne om du vil endre style */
  className?: string;
  /** Settes til 'fluid' for flytende dropdown */
  width?: 'fluid';
  /** Settes for å style komponenten basert på state/validering */
  variant?: VariantType;
  /** For å deaktivere dropdownen */
  disabled?: boolean;
  /** Den valgte verdien */
  value: string;
  /** Alle mulige valg for dropdownen å ha */
  children: React.ReactNode;
  [key: string]: any;
} & React.HTMLProps<HTMLSelectElement>;

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  width,
  variant = 'none',
  disabled = false,
  children,
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
      {children}
    </select>
  );
};

type DropdownItemProps = {
  /** Labelen/children for en option */
  children: React.ReactNode;
  [key: string]: any;
};

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  ...rest
}) => {
  return <option {...rest}>{children}</option>;
};
