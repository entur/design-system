import React from 'react';
import classNames from 'classnames';
import {
  useSelect,
  useMultipleSelection,
  UseSelectStateChangeTypes,
  UseMultipleSelectionProps,
} from 'downshift';
import { Label } from '@entur/typography';
import { VariantType, FeedbackText, BaseFormControl } from '@entur/form';
import {
  PotentiallyAsyncDropdownItemType,
  useResolvedItems,
} from './useResolvedItems';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { TagChip } from '@entur/chip';
import { InlineSpinner } from './InlineSpinner';
import { CloseIcon, DownArrowIcon } from '@entur/icons';
import './MultiSelect.scss';

type MultiSelectProps = {
  /** Tilgjengelige valg i dropdownen */
  items: PotentiallyAsyncDropdownItemType;
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
  onChange?: (e: any) => void;
  /** Lar brukeren velge ved å "tæbbe" seg ut av komponenten */
  selectOnTab?: boolean;
  /** Om man skal vise items ved fokusering av input-feltet, før man skriver inn noe */
  openOnFocus?: boolean;
  /** Antall millisekunder man venter før man kaller en potensiell items-funksjon */
  debounceTimeout?: number;
  /** Ekstra klassenavn */
  className?: string;
  /** Styling som sendes ned til Dropdown-lista */
  listStyle?: { [key: string]: any };
  /** Alle ekstra props videresendes til Downshift */
  [key: string]: any;
};

const MultiSelectContext = React.createContext<{
  isOpen: boolean;
  reset: () => void;
  getToggleButtonProps: any;
} | null>(null);
const useMultiSelectContext = () => {
  const context = React.useContext(MultiSelectContext);
  if (!context) {
    throw new Error('You need to wrap your component in a DownshiftProvider');
  }
  return context;
};

export const MultiSelect: React.FC<
  MultiSelectProps & UseMultipleSelectionProps<NormalizedDropdownItemType>
> = ({
  label,
  className,
  debounceTimeout,
  items: input,
  feedback,
  variant,
  disabled,
  placeholder = 'Vennligst velg',
  selectOnTab = false,
  openOnFocus = false,
  onChange = () => {},
  loading,
  loadingText = 'Loading...',
  readOnly = false,
  prepend,
  listStyle,
  ...rest
}) => {
  const {
    getSelectedItemProps,
    getDropdownProps,
    // addSelectedItem,
    selectedItems,
    removeSelectedItem,
    reset,
    addSelectedItem,
  } = useMultipleSelection<NormalizedDropdownItemType>({
    ...rest,
  });

  const { items } = useResolvedItems(input, debounceTimeout);
  const getFilteredItems = () =>
    items.filter(item => selectedItems.indexOf(item) < 0);
  const {
    isOpen,
    openMenu,
    selectedItem,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    selectedItem: undefined,
    items: getFilteredItems(),
    onStateChange: ({
      type,
      selectedItem,
    }: {
      type?: UseSelectStateChangeTypes;
      selectedItem?: NormalizedDropdownItemType;
    }) => {
      switch (type) {
        case useSelect.stateChangeTypes.MenuKeyDownEnter:
        case useSelect.stateChangeTypes.MenuKeyDownSpaceButton:
        case useSelect.stateChangeTypes.ItemClick:
          if (selectedItem) {
            addSelectedItem(selectedItem);
          }
          break;
        default:
          break;
      }
    },
  });

  React.useEffect(() => {
    onChange(selectedItems);
  }, [selectedItems, onChange]);

  const areItemsSelected = selectedItems.length !== 0;

  return (
    <MultiSelectContext.Provider
      value={{ isOpen, reset, getToggleButtonProps }}
    >
      <div className={classNames('eds-dropdown-wrapper', className)}>
        {label && <Label {...getLabelProps()}>{label}</Label>}
        <BaseFormControl
          prepend={prepend}
          dark
          append={
            <Appendix
              loading={loading}
              loadingText={loadingText}
              readOnly={readOnly}
              hasSelected={areItemsSelected}
            />
          }
        >
          <div className="eds-multi-select__selected-items">
            {selectedItems.map((selectedItem, index) => (
              <TagChip
                className="eds-multi-select__selected-items-tag"
                key={`selected-item-${index}`}
                onClose={(e: React.MouseEvent) => {
                  e.stopPropagation();
                  removeSelectedItem(selectedItem);
                }}
                {...getSelectedItemProps({ selectedItem, index })}
              >
                {selectedItem.label}
              </TagChip>
            ))}
          </div>
          <button
            {...getToggleButtonProps(
              getDropdownProps({
                preventKeyAction: isOpen,
                style: { textAlign: 'left' },
                disabled,
                type: 'button',
                className: 'eds-form-control eds-dropdown___selectedItem',
                onFocus: () => {
                  if (openOnFocus) {
                    openMenu();
                  }
                },
              }),
            )}
          >
            {areItemsSelected ? '' : placeholder}
          </button>
        </BaseFormControl>

        <ul
          className={classNames('eds-dropdown-list', {
            'eds-dropdown-list--open': isOpen,
          })}
          {...getMenuProps({
            style: { position: 'absolute', top: '100%', ...listStyle },
          })}
        >
          {isOpen
            ? getFilteredItems().map((item, index) => (
                <li
                  className={classNames('eds-dropdown-list__item', {
                    'eds-dropdown-list__item--highlighted':
                      highlightedIndex === index,
                    'eds-dropdown-list__item--selected': selectedItem === item,
                  })}
                  {...getItemProps({
                    key: `${index}${item.value}`,
                    item,
                    index,
                  })}
                  {...listStyle}
                >
                  <span>{item.label}</span>
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
              ))
            : null}
        </ul>
        {feedback && variant && (
          <FeedbackText variant={variant}>{feedback}</FeedbackText>
        )}
      </div>
    </MultiSelectContext.Provider>
  );
};

const Appendix: React.FC<{
  loading: boolean;
  loadingText: string;
  readOnly: boolean;
  hasSelected: boolean;
}> = ({ loading, loadingText, readOnly, hasSelected }) => {
  if (loading) {
    return <InlineSpinner>{loadingText}</InlineSpinner>;
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

const DropdownToggleButton = () => {
  const { getToggleButtonProps, isOpen } = useMultiSelectContext();
  return (
    <button
      {...getToggleButtonProps({
        className: classNames('eds-dropdown__toggle-button', {
          'eds-dropdown__toggle-button--open': isOpen,
        }),
      })}
      tabIndex="-1"
    >
      <DownArrowIcon />
    </button>
  );
};
