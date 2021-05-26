import React from 'react';

export type TableFooterProps = {
  /** Tabellrader */
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ ...props }, ref) => <tfoot ref={ref} {...props} />);
