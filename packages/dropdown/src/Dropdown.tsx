import React from 'react';
import { useSelect } from 'downshift';
import { BaseFormControl } from '@entur/form';
import { DownArrowIcon, CheckIcon } from '@entur/icons';
import classNames from 'classNames';
import './styles.scss';

type DropdownItem =
  | {
      label: string;
      value: string;
    }
  | string;

type DropdownProps = {
  items: DropdownItem[];
  disabled?: boolean;
  placeholder?: string;
  className?: string;
};

function stateReducer(state: any, actionAndChanges: any) {
  // this prevents the menu from being closed when the user selects an item with 'Enter' or mouse
  console.log(actionAndChanges);
  switch (actionAndChanges.type) {
    case '__item__click__':
      return {
        ...actionAndChanges.changes, // default Downshift new state changes on item selection.
        isOpen: false, // but keep menu open.
        highlightedIndex: state.highlightedIndex, // with the item highlighted.
      };
    default:
      return actionAndChanges.changes; // otherwise business as usual.
  }
}

export const Dropdown: React.FC<DropdownProps> = ({
  items,
  disabled = false,
  placeholder,
  className,
}) => {
  const normalizedItems = items.map(item => {
    if (typeof item == 'string') {
      return { value: item, label: item };
    }
    return item;
  });

  const {
    isOpen,
    selectedItem,
    getToggleButtonProps,
    getMenuProps,
    highlightedIndex,
    getItemProps,
  } = useSelect({
    items: normalizedItems,
    itemToString: item => item.label,
    stateReducer,
  });

  console.log(isOpen);

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <BaseFormControl
        style={{ display: 'flex', flexDirection: 'column' }}
        disabled={disabled}
        className={className}
        dark
      >
        <button
          className="eds-form-control"
          {...getToggleButtonProps({ disabled })}
        >
          {(selectedItem && selectedItem.label) ||
            placeholder ||
            normalizedItems[0].label ||
            'Velg'}
          <DownArrowIcon />
        </button>
      </BaseFormControl>
      <ul className="eds-dropdown-option" {...getMenuProps()}>
        {isOpen &&
          normalizedItems.map((option: any, index: any) => (
            <li
              className={classNames(
                'eds-dropdown-option__item',
                highlightedIndex === index &&
                  'eds-dropdown-option__item--highlighted',
              )}
              key={`${option.label}${index}`}
              {...getItemProps({
                item: option,
                index,
                onClick: e => e.stopPropagation(),
              })}
            >
              {option.label}
              {option === selectedItem && <CheckIcon inline />}
            </li>
          ))}
      </ul>
    </div>
  );
};
