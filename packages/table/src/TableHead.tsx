import React from 'react';

export type TableHeadProps = {
  /** Kolonneoverskrifter */
  children: React.ReactNode;
};

export const TableHead: React.FC<TableHeadProps> = props => (
  <thead {...props} />
);
