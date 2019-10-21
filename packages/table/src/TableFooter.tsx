import React from 'react';

interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Tabellrader */
  children: React.ReactNode;
}

export const TableFooter: React.FC<TableFooterProps> = props => (
  <tfoot {...props} />
);
