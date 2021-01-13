import React from 'react';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { useDownshift } from './DownshiftProvider';
import { BaseDropdown } from './BaseDropdown';

type RegularDropdownProps = {
  items: NormalizedDropdownItemType[];
  disabled?: boolean;
  placeholder?: string;
  loading?: boolean;
  loadingText?: string;
  className?: string;
  selectOnTab?: boolean;
  openOnFocus?: boolean;
  listStyle?: { [key: string]: any };
  labelId: string;
  disableLabelAnimation?: boolean;
  [key: string]: any;
};
export const RegularDropdown: React.FC<RegularDropdownProps> = ({
  disabled,
  placeholder = 'Vennligst velg',
  selectOnTab = false,
  openOnFocus = false,
  listStyle,
  items,
  label,
  labelId,
  disableLabelAnimation,
  ...rest
}) => {
  const {
    getToggleButtonProps,
    selectedItem,
    selectHighlightedItem,
    openMenu,
    isOpen,
    highlightedIndex,
    setHighlightedIndex,
  } = useDownshift();
  return (
    <BaseDropdown
      disabled={disabled}
      listStyle={listStyle}
      items={items}
      label={label}
      labelId={labelId}
      isFilled
      disableLabelAnimation={disableLabelAnimation}
      {...rest}
    >
      <button
        {...getToggleButtonProps({
          className: 'eds-form-control eds-dropdown__selected-item',
          style: { textAlign: 'left' },
          disabled,
          type: 'button',
          'aria-labelledby': labelId,
          onKeyDown: e => {
            if (selectOnTab && e.key === 'Tab') {
              selectHighlightedItem();
            }

            if (isOpen) {
              const keyDownValue = e.key;
              const matchedItems = items
                .map((item, index) => ({ ...item, index }))
                .filter(item => {
                  const firstCharacter = item.label
                    .trim()
                    .charAt(0)
                    .toLowerCase();
                  return firstCharacter === keyDownValue;
                });

              const nextHighlightItem = matchedItems.find(
                item => item.index > (highlightedIndex ?? 0),
              );

              if (nextHighlightItem) {
                setHighlightedIndex(nextHighlightItem.index);
              } else if (matchedItems.length > 0) {
                setHighlightedIndex(matchedItems[0].index);
              }
            }
          },
          onFocus: () => {
            if (openOnFocus) {
              !isOpen && openMenu();
            }
          },
        })}
      >
        {selectedItem ? selectedItem.label : placeholder}
      </button>
    </BaseDropdown>
  );
};
