import React from 'react';
import classNames from 'classnames';

export type TableProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Lager en mer kompakt tabell. Typisk for sider med høy informasjonstetthet
   * @default false
   */
  compact?: boolean;
  /** Setter kolonne-layout til å være uavhengig av innhold
   * @default false
   */
  fixed?: boolean;
  /** Innholdet i tabellen */
  children: React.ReactNode;
  [key: string]: any;
};
export const Table: React.FC<TableProps> = ({
  className,
  fixed = false,
  compact = false,
  sortable = false,
  ...rest
}) => {
  return (
    <table
      className={classNames(
        'eds-table',
        { 'eds-table--fixed': fixed },
        { 'eds-table--compact': compact },
        { 'eds-table--sortable': sortable },
        className,
      )}
      {...rest}
    />
  );
};
