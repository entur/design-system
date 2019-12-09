import React from 'react';
import { InputGroup, VariantType } from '@entur/form';
import { SimpleDropdown } from './SimpleDropdown';
import { useScreenSize } from './useScreenSize';
import {
  useNormalizedItems,
  DropdownItemType,
  NormalizedDropdownItemType,
} from './useNormalizedItems';
import { RegularDropdown } from './RegularDropdown';
import { DownshiftProvider } from './DownshiftProvider';
import { SearchableDropdown } from './SearchableDropdown';
import { DropdownInputGroup } from './DropdownInputGroup';

type DropdownProps = {
  /** Tilgjengelige valg i dropdownen */
  items: DropdownItemType[];
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
  /** Callback når brukeren endrer valg */
  onChange?: (selectedItem: NormalizedDropdownItemType | null) => void;
  [key: string]: any;
};
export const Dropdown: React.FC<DropdownProps> = ({
  feedback,
  items,
  label,
  onChange = () => {},
  searchable,
  variant,
  value,
  ...rest
}) => {
  const screenSize = useScreenSize();
  const normalizedItems = useNormalizedItems(items);

  if (screenSize !== 'large') {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedItem =
        normalizedItems.find(item => item.value === e.target.value) || null;
      onChange(selectedItem);
    };
    return (
      <InputGroup label={label} feedback={feedback} variant={variant}>
        <SimpleDropdown
          onChange={handleChange}
          items={normalizedItems}
          value={value}
          {...rest}
        />
      </InputGroup>
    );
  }

  const initialSelectedItem = normalizedItems.find(
    item => value === item.value,
  );

  return (
    <DownshiftProvider
      onChange={onChange}
      initialSelectedItem={initialSelectedItem}
    >
      <DropdownInputGroup label={label} feedback={feedback} variant={variant}>
        {searchable ? (
          <SearchableDropdown items={normalizedItems} {...rest} />
        ) : (
          <RegularDropdown items={normalizedItems} {...rest} />
        )}
      </DropdownInputGroup>
    </DownshiftProvider>
  );
};
