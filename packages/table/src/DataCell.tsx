import React from 'react';
import classNames from 'classnames';

import { BulletBadge } from '@entur/layout';

export type DataCellProps = {
  /** Innholdet i tabellcellen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse som settes for DataCell for ulikt innhold av komponenter */
  padding?: 'default' | 'checkbox' | 'radio' | 'overflow-menu';
  /** @deprecated bruk variant */
  status?: 'positive' | 'negative' | 'neutral';
  /** Hvilken type status man vil vise */
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
} & React.DetailedHTMLProps<
  React.TdHTMLAttributes<HTMLTableDataCellElement>,
  HTMLTableDataCellElement
>;

function mapStatusToVariant(
  status: 'positive' | 'negative' | 'neutral',
): DataCellProps['variant'] {
  switch (status) {
    case 'positive':
      return 'success';
    case 'negative':
      return 'danger';
    case 'neutral':
      return 'neutral';
    default:
      return 'neutral';
  }
}

export const DataCell = React.forwardRef<
  HTMLTableDataCellElement,
  DataCellProps
>(
  (
    { className, padding = 'default', status, variant, children, ...rest },
    ref: React.Ref<HTMLTableDataCellElement>,
  ) => {
    // If variant is undefined and status is defined, map status to variant
    if (!variant && status) {
      variant = mapStatusToVariant(status);
    }
    return (
      <td
        ref={ref}
        className={classNames('eds-table__data-cell', className, {
          'eds-table__data-cell--padding-checkbox': padding === 'checkbox',
          'eds-table__data-cell--padding-radio': padding === 'radio',
          'eds-table__data-cell--padding-overflow-menu':
            padding === 'overflow-menu',
        })}
        {...rest}
      >
        {variant ? (
          <BulletBadge variant={variant}>{children}</BulletBadge>
        ) : (
          children
        )}
      </td>
    );
  },
);
