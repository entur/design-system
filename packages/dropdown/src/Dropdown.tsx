import React from 'react';
import { VariantType } from '@entur/form';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { RegularDropdown } from './RegularDropdown';
import { DownshiftProvider } from './DownshiftProvider';
import { SearchableDropdown } from './SearchableDropdown';
import { DropdownInputGroup } from './DropdownInputGroup';
import {
  useResolvedItems,
  PotentiallyAsyncDropdownItemType,
} from './useResolvedItems';

type DropdownProps = {
  /** Tilgjengelige valg i dropdownen */
  items: PotentiallyAsyncDropdownItemType;
  /** Valgt verdi */
  value?: string;
  /** Om man skal kunne søke i dropdownen eller ikke */
  searchable?: boolean;
  /** Beskrivende tekst som forklarer feltet */
  label?: string;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Tekst eller ikon som kommer før dropdownen */
  prepend?: React.ReactNode;
  /** Deaktiver dropdownen */
  disabled?: boolean;
  /** Setter dropdownen i read-only modus */
  readOnly?: boolean;
  /** Placeholder-tekst når ingenting er satt */
  placeholder?: string;
  /** En tekst som beskriver hva som skjer når man venter på items */
  loadingText?: string;
  /** Callback når brukeren endrer valg */
  onChange?: (selectedItem: NormalizedDropdownItemType | null) => void;
  /** Lar brukeren velge ved å "tæbbe" seg ut av komponenten */
  selectOnTab?: boolean;
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon */
  debounceTimeout?: number;
  /** Alle ekstra props videresendes til Downshift */
  [key: string]: any;
};
export const Dropdown: React.FC<DropdownProps> = ({
  debounceTimeout,
  disabled,
  feedback,
  items,
  label,
  loadingText,
  onChange = () => {},
  placeholder,
  prepend,
  readOnly,
  searchable,
  selectOnTab,
  variant,
  value,
  ...rest
}) => {
  const { items: normalizedItems, loading, fetchItems } = useResolvedItems(
    items,
    !searchable, // only fetch initially if not searchable
    debounceTimeout,
  );

  const initialSelectedItem = normalizedItems.find(
    item => value === item.value,
  );

  const RenderedDropdown = searchable ? SearchableDropdown : RegularDropdown;

  return (
    <DownshiftProvider
      initialSelectedItem={initialSelectedItem}
      onInputValueChange={fetchItems}
      onChange={onChange}
      {...rest}
    >
      <DropdownInputGroup label={label} feedback={feedback} variant={variant}>
        <RenderedDropdown
          items={normalizedItems}
          loading={loading}
          loadingText={loadingText}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          prepend={prepend}
          selectOnTab={selectOnTab}
        />
      </DropdownInputGroup>
    </DownshiftProvider>
  );
};
