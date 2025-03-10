import React from 'react';
import classNames from 'classnames';

export type TableRowProps = {
  /** Tabellceller */
  children: React.ReactNode;
  /** Ekstra klassenavn */
  className?: string;
  /**Hvis satt, så vil tabellraden endre fargen ved hover
   * @default false
   */
  hover?: boolean;
  /** Om raden er klikkbar, så vil raden endre farge, og musepekeren vil symbolisere interaktivitet
   * @default false
   */
  active?: boolean;
  /**Signalisere om at det er en feil i tabellraden
   * @default false
   */
  error?: boolean;
  ref?: React.Ref<HTMLTableRowElement>;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLTableRowElement>,
  HTMLTableRowElement
>;

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  (
    { className, hover = false, active = false, error = false, ...rest },
    ref: React.Ref<HTMLTableRowElement>,
  ) => (
    <tr
      className={classNames('eds-table__row', className, {
        'eds-table__row--hover': hover,
        'eds-table__row--active': active,
        'eds-table__row--error': error,
      })}
      ref={ref}
      {...rest}
    />
  ),
);
