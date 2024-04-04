import React from 'react';
import classNames from 'classnames';

import { BulletBadge } from '@entur/layout';
import { VariantType } from '@entur/utils';

/** @deprecated use variant="information" instead */
const info = 'info';
/** @deprecated use variant="negative" instead */
const danger = 'danger';

export type DataCellProps = {
  /** Innholdet i tabellcellen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /** Størrelse som settes for DataCell for ulikt innhold av komponenter */
  padding?: 'default' | 'checkbox' | 'radio' | 'overflow-menu';
  /** @deprecated bruk variant */
  status?: 'positive' | 'negative' | 'neutral';
  /** Hvilken type status man vil vise, info og danger er deprecated bruk information og negative istedenfor */
  variant?: 'primary' | 'neutral' | VariantType | typeof danger | typeof info;
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
      return 'negative';
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
