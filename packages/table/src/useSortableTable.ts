import React from 'react';
import get from 'lodash.get';

export type ExternalSortConfig = {
  /**
   * @default ""
   */
  key: string;
  /** @default "none" */
  order: 'ascending' | 'descending' | 'none';
};

export function useSortableData<T>(
  rawData: T[],
  externalSortConfig: ExternalSortConfig = { key: '', order: 'none' },
): {
  sortedData: T[];
  getSortableHeaderProps: (
    args: SortableHeaderProps,
  ) => SortableHeaderReturnProps;
  getSortableTableProps: (args: SortableTableProps) => SortableTableReturnProps;
} {
  const [sortConfig, setSortConfig] = React.useState(externalSortConfig);
  const tableCopy = rawData.slice();

  React.useEffect(() => {
    setSortConfig({
      key: externalSortConfig.key,
      order: externalSortConfig.order,
    });
  }, [externalSortConfig.key, externalSortConfig.order]);

  const sortedData: T[] = React.useMemo(() => {
    if (sortConfig.order === 'none') {
      return tableCopy;
    }
    return [...rawData].sort((a: any, b: any) => {
      if (get(a, sortConfig.key) < get(b, sortConfig.key)) {
        return sortConfig.order === 'ascending' ? -1 : 1;
      } else if (get(a, sortConfig.key) > get(b, sortConfig.key)) {
        return sortConfig.order === 'ascending' ? 1 : -1;
      } else {
        return 0;
      }
    });
  }, [rawData, tableCopy, sortConfig]);

  const onSortRequested = (key: string) => {
    let order: 'ascending' | 'descending' | 'none' = 'ascending';
    if (sortConfig.key === key && sortConfig.order === 'ascending') {
      order = 'descending';
    } else if (sortConfig.key === key && sortConfig.order === 'descending') {
      order = 'none';
    }

    setSortConfig({ key, order });
  };

  function getSortableHeaderProps({
    name,
    sortable = true,
    ...props
  }: SortableHeaderProps): SortableHeaderReturnProps {
    return {
      name,
      sortable,
      onClick: () => onSortRequested(name),
      sortConfig: sortConfig,
      ...props,
    };
  }

  function getSortableTableProps({
    sortable = true,
    ...props
  }: SortableTableProps): SortableTableReturnProps {
    return {
      sortable,
      sortConfig: sortConfig,
      ...props,
    };
  }

  return { sortedData, getSortableHeaderProps, getSortableTableProps };
}

export type SortableHeaderProps = {
  /** Navnet headeren skal se etter i forhold til sortering av items */
  name: string;
  /** Om headeren skal være sorterbar eller ikke
   * @default true */
  sortable?: boolean;
  [key: string]: any;
};

export type SortableHeaderReturnProps = {
  name: string;
  sortable: boolean;
  onClick: () => void;
  sortConfig: ExternalSortConfig;
  [key: string]: any;
};

export type SortableTableProps = {
  /** @default true */
  sortable?: boolean;
  [key: string]: any;
};

export type SortableTableReturnProps = {
  /** @default true */
  sortable?: boolean;
  sortConfig: ExternalSortConfig;
  [key: string]: any;
};
