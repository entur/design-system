import React from 'react';

export type TableHeadProps = {
  /** Kolonneoverskrifter */
  children: React.ReactNode;
  [key: string]: any;
};

export const TableHead: React.FC<TableHeadProps> = props => (
  <thead {...props} />
);
