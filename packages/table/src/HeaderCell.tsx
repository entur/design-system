import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon, UpArrowIcon } from '@entur/icons';
import './HeaderCell.scss';

export type HeaderCellProps = {
  /** Kolonneoverskrift */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const HeaderCell: React.FC<HeaderCellProps> = ({
  className,
  children,
  onClick,
  name,
  sortable = false,
  sortConfig,
  ...rest
}) => {
  const [isCurrentlySorted, setIsCurrentlySorted] = React.useState(false);
  React.useEffect(() => {
    setIsCurrentlySorted(sortConfig && name === sortConfig.key);
  }, [sortConfig, name]);
  let ariaSort = isCurrentlySorted ? sortConfig && sortConfig.order : 'none';
  return (
    <th
      className={classNames('eds-table__header-cell', className, {
        'eds-table__header-cell--sortable': sortable,
      })}
      aria-sort={ariaSort}
      {...rest}
    >
      <>
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
      </>
    </th>
  );
};
