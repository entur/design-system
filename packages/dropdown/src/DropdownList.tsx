import React from 'react';
import classNames from 'classnames';
import { NormalizedDropdownItemType } from './beta/useNormalizedItems';
import { useDownshift } from './DownshiftProvider';
import { CheckIcon } from '@entur/icons';
import './DropdownList.scss';

export type DropdownListProps = {
  items: NormalizedDropdownItemType[];
  [key: string]: any;
};

export const DropdownList: React.FC<DropdownListProps> = ({
  items,
  ...rest
}) => {
  const { highlightedIndex, isOpen, selectedItem, getItemProps, getMenuProps } =
    useDownshift();

  return (
    <ul
      className={classNames('eds-dropdown-list', {
        'eds-dropdown-list--open': isOpen,
      })}
      {...getMenuProps()}
      {...rest}
    >
      {isOpen
        ? items.map((item, index) => (
            // eslint-disable-next-line react/jsx-key
            <li
              className={classNames('eds-dropdown-list__item', {
                'eds-dropdown-list__item--highlighted':
                  highlightedIndex === index,
                'eds-dropdown-list__item--selected': selectedItem === item,
              })}
              {...getItemProps({ key: `${index}${item.value}`, item, index })}
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
              {selectedItem === item && <CheckIcon />}
            </li>
          ))
        : null}
    </ul>
  );
};
