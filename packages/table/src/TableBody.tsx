import React from 'react';
import classNames from 'classnames';

export type TableBodyProps = {
  /** Tabellrader */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
};

export const TableBody: React.FC<TableBodyProps> = ({ className, ...rest }) => (
  <tbody className={classNames('eds-table__body', className)} {...rest} />
);
