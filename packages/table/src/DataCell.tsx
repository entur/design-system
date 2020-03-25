import React from 'react';
import classNames from 'classnames';

export type DataCellProps = {
  /** Innholdet i tabellcellen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  padding?: 'default' | 'checkbox' | 'radio';
  [key: string]: any;
};

export const DataCell: React.FC<DataCellProps> = ({
  className,
  padding = 'default',
  ...rest
}) => (
  <td
    className={classNames('eds-table__data-cell', className, {
      'eds-table__data-cell--padding-checkbox': padding === 'checkbox',
      'eds-table__data-cell--padding-radio': padding === 'radio',
    })}
    {...rest}
  />
);
