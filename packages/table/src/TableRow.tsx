import React from 'react';
import classNames from 'classnames';

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Tabellceller */
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ className, ...rest }) => (
  <tr className={classNames('eds-table__row', className)} {...rest} />
);
