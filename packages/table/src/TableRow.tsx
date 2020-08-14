import React from 'react';
import classNames from 'classnames';

type TableRowProps = {
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
  [key: string]: any;
};

export const TableRow: React.FC<TableRowProps> = ({
  className,
  hover = false,
  active = false,
  error = false,
  ...rest
}) => (
  <tr
    className={classNames('eds-table__row', className, {
      'eds-table__row--hover': hover,
      'eds-table__row--active': active,
      'eds-table__row--error': error,
    })}
    {...rest}
  />
);
