import React from 'react';
import { DownArrowIcon } from '@entur/icons';
import { BaseFormControl, useVariant } from '@entur/form';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import './SimpleDropdown.scss';

export type SimpleDropdownProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** For å deaktivere dropdownen */
  disabled?: boolean;
  /** Setter dropdownen i read-only modus */
  readOnly?: boolean;
  /** Den valgte verdien */
  value?: string;
  /** En callback for endringer av value */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Alle valg for dropdownen å ha */
  items: NormalizedDropdownItemType[];
  /** Tekst eller ikon som kommer før dropdownen */
  prepend?: React.ReactNode;
  [key: string]: any;
};

export const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  className,
  disabled = false,
  readOnly = false,
  items,
  prepend,
  style,
  ...rest
}) => {
  const variant = useVariant();
  return (
    <BaseFormControl
      dark={true}
      disabled={disabled}
      readOnly={readOnly}
      prepend={prepend}
      append={disabled || readOnly ? null : <DownArrowIcon inline={true} />}
      className={className}
      style={style}
    >
      <select
        aria-invalid={variant === 'error'}
        className="eds-form-control eds-dropdown"
        disabled={disabled || readOnly}
        {...rest}
      >
        {items.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </BaseFormControl>
  );
};
