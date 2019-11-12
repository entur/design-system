import React from 'react';
import classNames from 'classnames';

interface DataCellProps
  extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  /** Innholdet i tabellcellen */
  children: React.ReactNode;
}

export const DataCell: React.FC<DataCellProps> = ({ className, ...rest }) => (
  <td className={classNames('eds-table__data-cell', className)} {...rest} />
);
