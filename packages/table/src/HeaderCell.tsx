import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon, UpArrowIcon } from '@entur/icons';
import './HeaderCell.scss';

export type HeaderCellProps = {
  /** Kolonneoverskrift */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse som settes for HeaderCell for ulikt innhold av komponenter */
  padding?: 'default' | 'checkbox' | 'radio' | 'overflow-menu';
  [key: string]: any;
};

export const HeaderCell = React.forwardRef<
  HTMLTableHeaderCellElement,
  HeaderCellProps
>(
  (
    {
      className,
      children,
      onClick,
      name,
      sortable = false,
      sortConfig,
      padding = 'default',
      ...rest
    },
    ref,
  ) => {
    const [isCurrentlySorted, setIsCurrentlySorted] =
      React.useState<boolean>(false);
    React.useEffect(() => {
      setIsCurrentlySorted(sortConfig && name === sortConfig.key);
    }, [sortConfig, name]);
    const ariaSort = isCurrentlySorted
      ? sortConfig && sortConfig.order
      : 'none';
    return (
      <th
        className={classNames('eds-table__header-cell', className, {
          'eds-table__header-cell--sortable': sortable,
          'eds-table__header-cell--padding-radio': padding === 'radio',
          'eds-table__header-cell--padding-checkbox': padding === 'checkbox',
          'eds-table__header-cell--padding-overflow-menu':
            padding === 'overflow-menu',
        })}
        aria-sort={ariaSort}
        ref={ref}
        {...rest}
      >
        {sortable ? (
          <button
            className="eds-table__header-cell-button"
            type="button"
            onClick={onClick}
          >
            {children}
            {isCurrentlySorted && sortConfig.order === 'ascending' && (
              <UpArrowIcon
                size="16px"
                className="eds-table__header-cell-button-icon"
              />
            )}
            {isCurrentlySorted && sortConfig.order === 'descending' && (
              <DownArrowIcon
                size="16px"
                className="eds-table__header-cell-button-icon"
              />
            )}
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);
