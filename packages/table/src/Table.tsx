import React from 'react';
import classNames from 'classnames';

export type TableProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Setter tettheten mellom rader og kolonner. Bruk gjerne middle og small for for sider med høy informasjonstetthet
   * @default "default"
   */
  spacing?: 'default' | 'middle' | 'small';
  /** Setter kolonne-layout til å være uavhengig av innhold
   * @default false
   */
  fixed?: boolean;
  /** Innholdet i tabellen */
  children: React.ReactNode;
  [key: string]: any;
};
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      className,
      fixed = false,
      spacing = 'default',
      sortable = false,
      ...rest
    },
    ref,
  ) => {
    return (
      <table
        className={classNames(
          'eds-table',
          { 'eds-table--fixed': fixed },
          { 'eds-table--middle': spacing === 'middle' },
          { 'eds-table--small': spacing === 'small' },
          { 'eds-table--sortable': sortable },
          className,
        )}
        ref={ref}
        {...rest}
      />
    );
  },
);
