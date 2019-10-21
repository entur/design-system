import React from 'react';

interface TableHeadProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Kolonneoverskrifter */
  children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = props => (
  <thead {...props} />
);
