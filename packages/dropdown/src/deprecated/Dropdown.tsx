import React from 'react';
import { VariantType } from '@entur/form';
import { NormalizedDropdownItemType } from '../useNormalizedItems';
import { RegularDropdownDeprecated } from './RegularDropdown';
import { DownshiftProvider } from './DownshiftProvider';
import { SearchableDropdownDeprecated } from './SearchableDropdown';
import { DropdownInputGroupDeprecated } from './DropdownInputGroup';
import {
  useResolvedItems,
  PotentiallyAsyncDropdownItemType,
} from '../useResolvedItems';

export type DropdownDeprecatedProps = {
  /** Beskrivende tekst som forklarer feltet */
  label: string;
  /** Tilgjengelige valg i dropdownen */
  items: PotentiallyAsyncDropdownItemType;
  /** Valgt verdi. Bruk null for ingen verdi. */
  value?: string | null;
  /** Om man skal kunne søke i dropdownen eller ikke */
  searchable?: boolean;
  /** Tooltip for labelen */
  labelTooltip?: string;
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
  /** Om man skal vise items ved fokusering av input-feltet, før man skriver inn noe */
  openOnFocus?: boolean;
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon */
  debounceTimeout?: number;
  /** Om man skal ha muliget for å nullstille Dropdownen
   * @default false
   */
  clearable?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Marker første valgmulighet automatisk */
  highlightFirstItemOnOpen?: boolean;
  /** Styling som sendes ned til Dropdown-lista */
  listStyle?: { [key: string]: any };
  /** Filtreringen som blir brukt dersom man har en searchable Dropdown
   * @default Enkel tekstsammenligning
   */
  itemFilter?: (item: NormalizedDropdownItemType) => boolean;
  /** Plasserer labelen statisk på toppen av inputfeltet
   * @default false
   */
  disableLabelAnimation?: boolean;
  /** Alle ekstra props videresendes til Downshift */
  [key: string]: any;
};

/**
 * @deprecated
 * New Dropdown available
 *
 * migration guide to new dropdown:
 * - change import from 'DropdownDeprecated' to 'Dropdown'
 *  + if 'searchable', switch to 'SearchableDropdown'
 * - change from 'value' to 'selectedItem'
 *  + type of 'selectedItem' is 'NormalizedDropdownType' and does not include 'string'
 * - 'onChange' must update value of 'selectedItem'
 */
export const DropdownDeprecated: React.FC<DropdownDeprecatedProps> =
  React.forwardRef<
    HTMLInputElement | HTMLButtonElement,
    DropdownDeprecatedProps
  >(
    (
      {
        highlightFirstItemOnOpen,
        debounceTimeout,
        disabled,
        feedback,
        items,
        label,
        loadingText,
        onChange = () => undefined,
        placeholder,
        prepend,
        readOnly,
        searchable,
        selectOnTab,
        openOnFocus,
        variant,
        value,
        clearable = false,
        className,
        style,
        listStyle,
        itemFilter,
        disableLabelAnimation,
        ...rest
      },
      ref,
    ) => {
      const {
        items: normalizedItems,
        loading,
        fetchItems,
      } = useResolvedItems(items, debounceTimeout);

      const selectedItem =
        value === undefined
          ? undefined
          : normalizedItems.find(item => value === item.value) || null;

      const RenderedDropdown = searchable
        ? SearchableDropdownDeprecated
        : RegularDropdownDeprecated;
      const searchAbleProps = searchable
        ? {
            itemFilter: itemFilter,
            name: rest.name,
            'data-cy': rest['data-cy'],
          }
        : { name: rest.name, 'data-cy': rest['data-cy'] };
      return (
        <DownshiftProvider
          selectedItem={selectedItem}
          onInputValueChange={fetchItems}
          onChange={onChange}
          value={value}
          highlightFirstItemOnOpen={highlightFirstItemOnOpen}
          className={className}
          style={style}
          searchable={searchable}
          {...rest}
        >
          <DropdownInputGroupDeprecated feedback={feedback} variant={variant}>
            <RenderedDropdown
              label={label}
              items={normalizedItems}
              loading={loading}
              loadingText={loadingText}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              prepend={prepend}
              selectOnTab={selectOnTab}
              openOnFocus={openOnFocus}
              listStyle={listStyle}
              clearable={clearable}
              disableLabelAnimation={disableLabelAnimation}
              ref={ref}
              {...searchAbleProps}
            />
          </DropdownInputGroupDeprecated>
        </DownshiftProvider>
      );
    },
  );
