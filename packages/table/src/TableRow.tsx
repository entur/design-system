import React from 'react';
import classNames from 'classnames';

type TableRowProps = {
  /** Tabellceller */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  [key: string]: any;
};

export const TableRow: React.FC<TableRowProps> = ({ className, ...rest }) => (
  <tr className={classNames('eds-table__row', className)} {...rest} />
);
