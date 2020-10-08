import React from 'react';
import { DownArrowIcon } from '@entur/icons';
import { BaseFormControl, VariantType } from '@entur/form';
import { InlineSpinner } from './InlineSpinner';
import {
  useResolvedItems,
  PotentiallyAsyncDropdownItemType,
} from './useResolvedItems';
import './NativeDropdown.scss';

export type NativeDropdownProps = {
  /** Ekstra klassenavn */
  className?: string;
  /**
   * For å deaktivere dropdownen
   * @default false
   **/
  disabled?: boolean;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Alle valg for dropdownen å ha */
  items: PotentiallyAsyncDropdownItemType;
  /** Beskrivende tekst som forklarer feltet */
  label?: string;
  /** En callback for endringer av value */
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Tekst eller ikon som kommer før dropdownen */
  prepend?: React.ReactNode;
  /**
   * Setter dropdownen i read-only modus
   * @default false
   **/
  readOnly?: boolean;
  /** Den valgte verdien */
  value?: string;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  [key: string]: any;
};

export const NativeDropdown: React.FC<NativeDropdownProps> = ({
  className,
  disabled = false,
  readOnly = false,
  items,
  loadingText,
  prepend,
  style,
  label,
  variant,
  feedback,
  ...rest
}) => {
  const { items: normalizedItems, loading } = useResolvedItems(items);

  let rightSideIcon: JSX.Element | null = <DownArrowIcon inline={true} />;
  if (disabled || readOnly) {
    rightSideIcon = null;
  } else if (loading) {
    rightSideIcon = <InlineSpinner>{loadingText}</InlineSpinner>;
  }

  return (
    <BaseFormControl
      dark={true}
      disabled={disabled}
      readOnly={readOnly}
      prepend={prepend}
      append={rightSideIcon}
      className={className}
      style={style}
      label={label}
      variant={variant}
      feedback={feedback}
    >
      <select
        aria-invalid={variant === 'error'}
        className="eds-form-control eds-dropdown"
        disabled={disabled || readOnly}
        {...rest}
      >
        {normalizedItems.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </BaseFormControl>
  );
};
