import React from 'react';
import classNames from 'classnames';

export type TableProps = {
  /** Ekstra klassenavn */
  className?: string;
  /** Lager en mer kompakt tabell. Typisk for sider med høy informasjonstetthet */
  compact?: boolean;
  /** Setter kolonne-layout til å være uavhengig av innhold */
  fixed?: boolean;
  /** Innholdet i tabellen */
  children: React.ReactNode;
};
export const Table: React.FC<TableProps> = ({
  className,
  fixed = false,
  compact = false,
  ...rest
}) => (
  <table
    className={classNames(
      'eds-table',
      { 'eds-table--fixed': fixed },
      { 'eds-table--compact': compact },
      className,
    )}
    {...rest}
  />
);
