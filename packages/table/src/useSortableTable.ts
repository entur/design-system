import React from 'react';

export type useSortableDataProps = {
  rawData: object[];
  externalSortConfig: {
    /**
     * @default ""
     */
    key: string;
    /** @default "none" */
    order: 'ascending' | 'descending' | 'none';
  };
};

export function useSortableData(
  rawData: object[],
  externalSortConfig: {
    key: string;
    order: 'ascending' | 'descending' | 'none';
  } = { key: '', order: 'none' },
) {
  const [sortConfig, setSortConfig] = React.useState(externalSortConfig);
  const tableCopy = rawData.slice();

  React.useEffect(() => {
    setSortConfig({
      key: externalSortConfig.key,
      order: externalSortConfig.order,
    });
  }, [externalSortConfig.key, externalSortConfig.order]);

  const sortedData = React.useMemo(() => {
    if (sortConfig.order === 'none') {
      return tableCopy;
    }
    return [...rawData].sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.order === 'ascending' ? -1 : 1;
      } else if (a[sortConfig.key] > b[sortConfig.key]) {
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

  const getSortableHeaderProps = ({
    name,
    sortable = true,
    ...props
  }: {
    name: string;
    sortable?: boolean;
    [key: string]: any;
  }) => ({
    onClick: () => onSortRequested(name),
    sortable,
    name,
    sortConfig: sortConfig,
    ...props,
  });

  const getSortableTableProps = ({
    sortable = true,
    ...props
  }: {
    sortable?: boolean;
    [key: string]: any;
  }) => ({
    sortable,
    sortConfig: sortConfig,
    ...props,
  });

  return { sortedData, getSortableHeaderProps, getSortableTableProps };
}
