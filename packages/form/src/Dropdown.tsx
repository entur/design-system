import React from 'react';
import { DownArrowIcon } from '@entur/icons';
import { VariantType } from './variants';
import { BaseFormControl } from './BaseFormControl';
import './Dropdown.scss';

export type DropdownProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Settes for å style komponenten basert på state/validering */
  variant?: VariantType;
  /** For å deaktivere dropdownen */
  disabled?: boolean;
  /** Setter dropdownen i read-only modus */
  readOnly?: boolean;
  /** Den valgte verdien */
  value: string;
  /** En callback for endringer av value */
  onChange: (e: React.ChangeEvent) => void;
  /** Alle mulige valg for dropdownen å ha */
  children: React.ReactNode;
  /** Tekst eller ikon som kommer før dropdownen */
  prepend?: React.ReactNode;
  [key: string]: any;
};

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  variant,
  disabled = false,
  readOnly = false,
  children,
  prepend,
  style,
  ...rest
}) => {
  return (
    <BaseFormControl
      dark={true}
      disabled={disabled}
      readOnly={readOnly}
      prepend={prepend}
      append={disabled || readOnly ? null : <DownArrowIcon inline={true} />}
      variant={variant}
      className={className}
      style={style}
    >
      <select
        aria-invalid={variant === 'error'}
        className="eds-form-control eds-dropdown"
        disabled={disabled || readOnly}
        {...rest}
      >
        {children}
      </select>
    </BaseFormControl>
  );
};

export type DropdownItemProps = {
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
