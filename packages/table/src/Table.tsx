import React from 'react';
import classNames from 'classnames';

export type TableProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Setter tettheten mellom rader og kolonner. Bruk gjerne middle og small for for sider med høy informasjonstetthet
   * @default "default"
   */
  density?: 'default' | 'middle' | 'small';
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
  density = 'default',
  sortable = false,
  ...rest
}) => {
  return (
    <table
      className={classNames(
        'eds-table',
        { 'eds-table--fixed': fixed },
        { 'eds-table--middle': density === 'middle' },
        { 'eds-table--small': density === 'small' },
        { 'eds-table--sortable': sortable },
        className,
      )}
      {...rest}
    />
  );
};
