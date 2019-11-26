import React from 'react';
import classNames from 'classnames';

export type DataCellProps = {
  /** Innholdet i tabellcellen */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
};

export const DataCell: React.FC<DataCellProps> = ({ className, ...rest }) => (
  <td className={classNames('eds-table__data-cell', className)} {...rest} />
);
