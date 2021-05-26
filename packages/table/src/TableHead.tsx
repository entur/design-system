import React from 'react';
import classNames from 'classnames';

export type TableHeadProps = {
  /** Kolonneoverskrifter */
  children: React.ReactNode;
  /** Esktra klassenavn */
  className?: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export const TableHead = React.forwardRef<
  HTMLTableSectionElement,
  TableHeadProps
>(({ className, ...props }, ref) => (
  <thead
    className={classNames('eds-table__head', className)}
    ref={ref}
    {...props}
  />
));
