import React, { useState } from 'react';
import {
  useSelect,
  UseSelectProps,
  //   StateChangeOptions,
  //   UseSelectStateChangeOptions,
} from 'downshift';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { BaseFormControl, VariantType } from '@entur/form';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from './useResolvedItems';
import { DropdownLoadingDots } from './DropdownLoadingDots';
import { useRandomId } from '@entur/utils';
import classNames from 'classnames';
import { CloseIcon, DownArrowIcon } from '@entur/icons';
import { space } from '@entur/tokens';
import './MultiSelect.scss';
import './DropdownList.scss';

const MultiSelectContext = React.createContext<{
  isOpen: boolean;
  reset: () => void;
  getToggleButtonProps: any;
  openMenu: () => void;
  openOnFocus?: boolean;
} | null>(null);
const useMultiSelectContext = () => {
  const context = React.useContext(MultiSelectContext);
  if (!context) {
    throw new Error('You need to wrap your component in a DownshiftProvider');
  }
  return context;
};

function stateReducer(
  state: any, //StateChangeOptions<NormalizedDropdownItemType>,
  actionAndChanges: any, //UseSelectStateChangeOptions<NormalizedDropdownItemType>,
) {
  const { changes, type } = actionAndChanges;
  switch (type) {
    case useSelect.stateChangeTypes.MenuKeyDownEnter:
    case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
    case useSelect.stateChangeTypes.ItemClick:
      return {
        ...changes,
        isOpen: true, // keep menu open after selection.
        highlightedIndex: state.highlightedIndex,
      };
    default:
      return changes;
  }
}
type MultiSelectProps = {
  /** Tilgjengelige valg i MultiSelect */
  items: PotentiallyAsyncDropdownItemType;
  /** Tekst som vises i boksen når elementer er valgt */
  itemsSelectedLabel?: (
    selectedItems: NormalizedDropdownItemType[],
    numberOfItems?: number,
  ) => string;
  /** Beskrivende tekst som forklarer feltet */
  label?: string;
  /** Hvilken valideringsvariant som gjelder */
  variant?: VariantType;
  /** Valideringsmelding, brukes sammen med `variant` */
  feedback?: string;
  /** Tekst eller ikon som kommer før MultiSelect */
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
  onChange?: (e: any) => void;
  /** Om man skal vise items ved fokusering av input-feltet, før man skriver inn noe
   * @default false
   */
  openOnFocus?: boolean;
  /** Ekstra klassenavn */
  className?: string;
  /** Styling som sendes ned til MultiSelect-lista */
  listStyle?: { [key: string]: any };
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon
   * @default 250
   */
  debounceTimeout?: number;
  /** Om man skal ha muliget for å nullstille Dropdownen
   * @default false
   */
  clearable?: boolean;
  loading?: boolean;
  style?: React.CSSProperties;
  initialSelectedItems?: NormalizedDropdownItemType[];
} & Omit<UseSelectProps<NormalizedDropdownItemType>, 'initialSelectedItem'>;

export const MultiSelect: React.FC<MultiSelectProps> = ({
  items: input,
  itemsSelectedLabel = items => SelectedItemsLabel(items),
  label,
  feedback,
  variant,
  disabled,
  readOnly = false,
  onChange = () => undefined,
  className,
  clearable = false,
  loading = false,
  loadingText = '',
  openOnFocus = false,
  style,
  listStyle,
  initialSelectedItems = [],
  debounceTimeout,
  ...rest
}) => {
  const { items } = useResolvedItems(input, debounceTimeout);
  const [selectedItems, setSelectedItems] =
    useState<NormalizedDropdownItemType[]>(initialSelectedItems);

  const reset = React.useCallback(() => {
    setSelectedItems([]);
  }, []);
  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
    openMenu,
  } = useSelect<NormalizedDropdownItemType>({
    items,
    stateReducer,
    selectedItem: null,
    onSelectedItemChange: ({ selectedItem }) => {
      if (!selectedItem) {
        return;
      }
      const itemIsfound = selectedItems.some(
        item => item.value === selectedItem.value,
      );
      if (itemIsfound) {
        const slicedItemList = selectedItems.filter(
          item => item.value !== selectedItem.value,
        );
        setSelectedItems(slicedItemList);
        onChange(slicedItemList);
      } else {
        const slicedItemList = [...selectedItems, selectedItem];
        setSelectedItems(slicedItemList);
        onChange(slicedItemList);
      }
    },
    ...rest,
  });
  const buttonText = selectedItems.length
    ? itemsSelectedLabel(selectedItems)
    : '';
  const multiSelectId = useRandomId('eds-multiselect');

  return (
    <MultiSelectContext.Provider
      value={{ isOpen, reset, getToggleButtonProps, openMenu, openOnFocus }}
    >
      <div
        className={classNames(
          'eds-multiselect',
          'eds-dropdown-wrapper',
          className,
        )}
        style={style}
      >
        <BaseFormControl
          label={label}
          labelId={multiSelectId}
          labelProps={...getLabelProps()}
          feedback={feedback}
          variant={variant}
          isFilled={selectedItems.length > 0 || isOpen}
          disabled={disabled}
          readOnly={readOnly}
          append={
            <Appendix
              hasSelected={clearable && selectedItems.length > 0}
              loading={loading}
              loadingText={loadingText}
              readOnly={readOnly}
            />
          }
        >
          <button
            {...getToggleButtonProps({
              style: {
                textAlign: 'left',
              },
              type: 'button',
              className: 'eds-form-control eds-multiselect__button',
            })}
          >
            {buttonText}
          </button>
        </BaseFormControl>
        <ul
          className={classNames('eds-dropdown-list', {
            'eds-dropdown-list--open': isOpen,
          })}
          {...getMenuProps({
            style: {
              position: 'absolute',
              top: `${space.extraLarge3 + space.extraSmall}px`,
              ...listStyle,
            },
          })}
        >
          {isOpen &&
            items.map((item, index) => (
              <li
                className={classNames('eds-dropdown-list__item', {
                  'eds-dropdown-list__item--highlighted':
                    highlightedIndex === index,
                  'eds-dropdown-list__item--selected': selectedItems.some(
                    selected => selected.value === item.value,
                  ),
                })}
                key={`${item.value}${index}`}
                {...getItemProps({
                  item,
                  index,
                })}
                style={{ display: 'flex' }}
              >
                <span style={{ display: 'flex' }}>
                  <span
                    className={classNames('eds-multiselect-checkbox', {
                      'eds-multiselect-checkbox--checked': selectedItems.some(
                        selected => selected.value === item.value,
                      ),
                    })}
                  >
                    <CheckboxIcon />
                  </span>
                  <span className="eds-multiselect__item-label">
                    {item.label}
                  </span>
                </span>
                {item.icons && (
                  <span>
                    {item.icons.map((Icon, index) => (
                      <Icon
                        key={index}
                        inline
                        className="eds-dropdown-list__item-icon"
                      />
                    ))}
                  </span>
                )}
              </li>
            ))}
        </ul>
      </div>
    </MultiSelectContext.Provider>
  );
};

const ClearButton: React.FC<{ [key: string]: any }> = ({ ...props }) => {
  const { reset } = useMultiSelectContext();
  return (
    <>
      <button
        className="eds-dropdown__clear-button"
        type="button"
        tabIndex={-1}
        onClick={() => reset()}
        {...props}
      >
        <CloseIcon />
      </button>
      <div className="eds-dropdown__divider"></div>
    </>
  );
};

const Appendix: React.FC<{
  loading: boolean;
  loadingText: string;
  readOnly: boolean;
  hasSelected: boolean;
}> = ({ loading, loadingText, readOnly, hasSelected }) => {
  if (loading) {
    return <DropdownLoadingDots>{loadingText}</DropdownLoadingDots>;
  }
  if (readOnly) {
    return null;
  }
  return hasSelected ? (
    <>
      <ClearButton></ClearButton>
      <DropdownToggleButton />
    </>
  ) : (
    <DropdownToggleButton />
  );
};

const DropdownToggleButton = () => {
  const { getToggleButtonProps, isOpen, openMenu, openOnFocus } =
    useMultiSelectContext();
  return (
    <button
      {...getToggleButtonProps({
        className: classNames('eds-dropdown__toggle-button', {
          'eds-dropdown__toggle-button--open': isOpen,
        }),
        onFocus: () => {
          if (openOnFocus) {
            openMenu();
          }
        },
      })}
      type="button"
    >
      <DownArrowIcon />
    </button>
  );
};

const CheckboxIcon: React.FC = () => {
  return (
    <svg
      className="eds-checkbox-icon"
      width="11px"
      height="9px"
      viewBox="6 11 37 33"
    >
      <path
        className="eds-checkbox-icon__path"
        d="M14.1 27.2l7.1 7.2 14.6-14.8"
        fill="none"
      />
    </svg>
  );
};

function SelectedItemsLabel(items: NormalizedDropdownItemType[]) {
  return items.length < 3
    ? items.map(item => item.label).toString()
    : `${items.length} elementer valgt`;
}
