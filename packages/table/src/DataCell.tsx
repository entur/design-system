import React from 'react';
import classNames from 'classnames';

export type DataCellProps = {
  /** Innholdet i tabellcellen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse som settes for DataCell for ulikt innhold av komponenter */
  padding?: 'default' | 'checkbox' | 'radio' | 'overflow-menu';
  /** Viser en status-sirkel for DataCell */
  status?: 'positive' | 'negative' | 'neutral';
  [key: string]: any;
};

export const DataCell = React.forwardRef<
  HTMLTableDataCellElement,
  DataCellProps
>(
  (
    { className, padding = 'default', status = undefined, ...rest },
    ref: React.Ref<HTMLTableDataCellElement>,
  ) => (
    <td
      ref={ref}
      className={classNames('eds-table__data-cell', className, {
        [`eds-table__data-cell--status-${status}`]: status,
        'eds-table__data-cell--padding-checkbox': padding === 'checkbox',
        'eds-table__data-cell--padding-radio': padding === 'radio',
        'eds-table__data-cell--padding-overflow-menu':
          padding === 'overflow-menu',
      })}
      {...rest}
    />
  ),
);
