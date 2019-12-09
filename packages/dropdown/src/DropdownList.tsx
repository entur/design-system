import React from 'react';
import classNames from 'classnames';
import { NormalizedDropdownItemType } from './useNormalizedItems';
import { useDownshift } from './DownshiftProvider';
import './DropdownList.scss';

export type DropdownListProps = {
  items: NormalizedDropdownItemType[];
  [key: string]: any;
};

export const DropdownList: React.FC<DropdownListProps> = ({
  items,
  ...rest
}) => {
  const {
    highlightedIndex,
    isOpen,
    selectedItem,
    getItemProps,
  } = useDownshift();

  if (!isOpen) {
    return null;
  }
  return (
    <ul className="eds-dropdown-list" {...rest}>
      {items.map((item, index) => (
        <li
          className={classNames('eds-dropdown-list__item', {
            'eds-dropdown-list__item--highlighted': highlightedIndex === index,
            'eds-dropdown-list__item--selected': selectedItem === item,
          })}
          {...getItemProps({ key: item.value, item, index })}
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
      ))}
    </ul>
  );
};
