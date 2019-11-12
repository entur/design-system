import React from 'react';
import classNames from 'classnames';

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Tabellrader */
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ className, ...rest }) => (
  <tbody className={classNames('eds-table__body', className)} {...rest} />
);
