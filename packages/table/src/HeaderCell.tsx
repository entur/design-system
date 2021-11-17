import React from 'react';
import classNames from 'classnames';
import { DownArrowIcon, UpArrowIcon } from '@entur/icons';
import './HeaderCell.scss';
import { ExternalSortConfig } from '.';

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
        {sortable && sortConfig && sortableButtonProps ? (
          <SortableHeaderCellButton
            sortableButtonProps={sortableButtonProps}
            sortConfig={sortConfig}
            isCurrentlySorted={isCurrentlySorted}
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
};

const SortableHeaderCellButton: React.FC<SortableHeaderCellButtonProps> = ({
  sortConfig,
  sortableButtonProps,
  isCurrentlySorted,
  children,
}) => {
  const { className, ...rest } = sortableButtonProps;
  return (
    <button
      className={classNames('eds-table__header-cell-button', className)}
      type="button"
      {...rest}
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
  );
};
