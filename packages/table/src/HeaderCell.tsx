import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon, UpArrowIcon } from '@entur/icons';
import './HeaderCell.scss';

export type HeaderCellProps = {
  /** Kolonneoverskrift */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  padding?: 'default' | 'checkbox' | 'radio';
  [key: string]: any;
};

export const HeaderCell: React.FC<HeaderCellProps> = ({
  className,
  children,
  onClick,
  name,
  sortable = false,
  sortConfig,
  padding = 'default',
  ...rest
}) => {
  const [isCurrentlySorted, setIsCurrentlySorted] = React.useState<boolean>(
    false,
  );
  React.useEffect(() => {
    setIsCurrentlySorted(sortConfig && name === sortConfig.key);
  }, [sortConfig, name]);
  let ariaSort = isCurrentlySorted ? sortConfig && sortConfig.order : 'none';
  return (
    <th
      className={classNames('eds-table__header-cell', className, {
        'eds-table__header-cell--sortable': sortable,
        'eds-table__header-cell--padding-radio': padding === 'radio',
        'eds-table__header-cell--padding-checkbox': padding === 'checkbox',
      })}
      aria-sort={ariaSort}
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
            <UpArrowIcon className="eds-table__header-cell-button-icon" />
          )}
          {isCurrentlySorted && sortConfig.order === 'descending' && (
            <DownArrowIcon className="eds-table__header-cell-button-icon" />
          )}
        </button>
      ) : (
        children
      )}
    </th>
  );
};
