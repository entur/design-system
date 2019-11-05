import React from 'react';
import { DownArrowIcon } from '@entur/icons';
import { VariantType } from './variants';
import { BaseFormControl } from './BaseFormControl';

type DropdownProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Settes for å style komponenten basert på state/validering */
  variant?: VariantType;
  /** For å deaktivere dropdownen */
  disabled?: boolean;
  /** Den valgte verdien */
  value: string;
  /** En callback for endringer av value */
  onChange: (e: React.ChangeEvent) => void;
  /** Alle mulige valg for dropdownen å ha */
  children: React.ReactNode;
  /** Tekst eller ikon som kommer før dropdownen */
  prepend?: React.ReactNode;
  [key: string]: any;
} & React.HTMLProps<HTMLSelectElement>;

export const Dropdown: React.FC<DropdownProps> = ({
  className,
  variant,
  disabled = false,
  children,
  prepend,
  style,
  ...rest
}) => {
  return (
    <BaseFormControl
      dark={true}
      disabled={disabled}
      prepend={prepend}
      append={<DownArrowIcon inline={true} />}
      variant={variant}
      className={className}
      style={style}
    >
      <select
        aria-invalid={variant === 'error'}
        className="entur-form-control"
        disabled={disabled}
        {...rest}
      >
        {children}
      </select>
    </BaseFormControl>
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
