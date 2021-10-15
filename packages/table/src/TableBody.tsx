import React from 'react';
import classNames from 'classnames';

export type TableBodyProps = {
  /** Tabellrader */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  ref?: React.ForwardedRef<HTMLTableSectionElement>;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableSectionElement>,
  HTMLTableSectionElement
>;

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...rest }, ref) => (
  <tbody
    className={classNames('eds-table__body', className)}
    ref={ref}
    {...rest}
  />
));
