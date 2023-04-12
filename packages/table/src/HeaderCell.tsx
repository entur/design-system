import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import { DownArrowIcon, UpArrowIcon, UnsortedIcon } from '@entur/icons';

import { ExternalSortConfig } from '.';

import './HeaderCell.scss';
import { VisuallyHidden } from '@entur/a11y';

export type HeaderCellProps = {
  /** Kolonneoverskrift */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse som settes for HeaderCell for ulikt innhold av komponenter */
  padding?: 'default' | 'checkbox' | 'radio' | 'overflow-menu';

  /** Ekstra props som kan sendes til sorteringsknappelementet. Benyttes via useSortableTable */
  sortableButtonProps?: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;

  /** Om komponenten brukes til sortering. Benytt via useSortableTable
   * @default false
   */
  sortable?: boolean;
  /** Konfigurering og rekkefølgen på sortering. Benyttes via useSortableTable */
  sortConfig?: ExternalSortConfig;
  /** Navnet det skal sorteres på. Benyttes via useSortableTable */
  name?: string;
  sortedAscendingAriaLabel?: string;
  sortedDescendingAriaLabel?: string;
} & React.DetailedHTMLProps<
  React.ThHTMLAttributes<HTMLTableCellElement>,
  HTMLTableCellElement
>;

export const HeaderCell = React.forwardRef<
  HTMLTableCellElement,
  HeaderCellProps
>(
  (
    {
      className,
      children,
      name,
      sortable = false,
      sortConfig,
      padding = 'default',
      sortableButtonProps,
      sortedAscendingAriaLabel = ', sortert stigende',
      sortedDescendingAriaLabel = ', sortert synkende',
      ...rest
    },
    ref,
  ) => {
    const [isCurrentlySorted, setIsCurrentlySorted] =
      React.useState<boolean>(false);
    React.useEffect(() => {
      sortConfig &&
        name &&
        setIsCurrentlySorted(sortConfig && name === sortConfig.key);
    }, [sortConfig, name]);
    const ariaSort = isCurrentlySorted
      ? sortConfig && sortConfig.order
      : undefined;

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
        {sortable && sortConfig && sortableButtonProps ? (
          <SortableHeaderCellButton
            sortableButtonProps={sortableButtonProps}
            sortConfig={sortConfig}
            isCurrentlySorted={isCurrentlySorted}
            ariaSort={ariaSort}
            sortedAscendingAriaLabel={sortedAscendingAriaLabel}
            sortedDescendingAriaLabel={sortedDescendingAriaLabel}
          >
            {children}
          </SortableHeaderCellButton>
        ) : (
          children
        )}
      </th>
    );
  },
);

type SortableHeaderCellButtonProps = {
  sortConfig: ExternalSortConfig;
  isCurrentlySorted: boolean;
  sortableButtonProps: React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  ariaSort?: 'none' | 'ascending' | 'descending' | 'other' | undefined;
  sortedAscendingAriaLabel?: string;
  sortedDescendingAriaLabel?: string;
};

const SortableHeaderCellButton: React.FC<SortableHeaderCellButtonProps> = ({
  sortConfig,
  sortableButtonProps,
  isCurrentlySorted,
  children,
  ariaSort,
  sortedAscendingAriaLabel,
  sortedDescendingAriaLabel,
}) => {
  const [sortedAriaInfo, setSortedAriaInfo] = useState<string | undefined>('');

  const { className, ...rest } = sortableButtonProps;

  const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

  useEffect(() => {
    const DISMISS_SORT_INFO_TIME = 3000;
    if (sortConfig.order == 'ascending') {
      setSortedAriaInfo(sortedAscendingAriaLabel);
    } else if (sortConfig.order == 'descending') {
      setSortedAriaInfo(sortedDescendingAriaLabel);
    }
    const dismissAriaTimer = setTimeout(() => {
      setSortedAriaInfo('');
      if (isFirefox) setSortedAriaInfo(', sort ' + sortConfig.order);
    }, DISMISS_SORT_INFO_TIME);

    return () => clearTimeout(dismissAriaTimer);
  }, [sortConfig.order]);

  return (
    <button
      className={classNames('eds-table__header-cell-button', className)}
      type="button"
      aria-sort={ariaSort}
      {...rest}
    >
      {children}
      {(!isCurrentlySorted || sortConfig.order === 'none') && (
        <UnsortedIcon
          size="1rem"
          className="eds-table__header-cell-button-icon"
          aria-hidden="true"
        />
      )}
      {isCurrentlySorted && sortConfig.order === 'ascending' && (
        <UpArrowIcon
          size="1rem"
          className="eds-table__header-cell-button-icon"
          aria-hidden="true"
        />
      )}
      {isCurrentlySorted && sortConfig.order === 'descending' && (
        <DownArrowIcon
          size="1rem"
          className="eds-table__header-cell-button-icon"
          aria-hidden="true"
        />
      )}
      <VisuallyHidden>{isCurrentlySorted && sortedAriaInfo}</VisuallyHidden>
    </button>
  );
};
