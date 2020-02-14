import React from 'react';

export type TableFooterProps = {
  /** Tabellrader */
  children: React.ReactNode;
  [key: string]: any;
};

export const TableFooter: React.FC<TableFooterProps> = props => (
  <tfoot {...props} />
);
