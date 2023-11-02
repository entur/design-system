import { useState, DetailedHTMLProps, ButtonHTMLAttributes } from 'react';
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
  tableData: T[],
  externalSortConfig: ExternalSortConfig = { key: '', order: 'none' },
): {
  sortedData: T[];
  getSortableHeaderProps: (
    args: SortableHeaderProps,
  ) => SortableHeaderReturnProps;
  getSortableTableProps: (
    args?: SortableTableProps,
  ) => SortableTableReturnProps;
} {
  const [sortConfig, setSortConfig] = useState(externalSortConfig);

  const onSortRequested = (key: string) => {
    const sortingNewColumn = key !== sortConfig.key;
    if (sortingNewColumn || sortConfig.order === 'none')
      return setSortConfig({ key, order: 'ascending' });
    if (sortConfig.order === 'ascending')
      return setSortConfig({ key, order: 'descending' });
    if (sortConfig.order === 'descending')
      return setSortConfig({ key, order: 'none' });
  };

  const tableSortedAscending = [...tableData].sort((a: any, b: any) => {
    const valueOfA: string = get(a, sortConfig.key, a)?.toString() ?? '';
    const valueOfB: string = get(b, sortConfig.key, b)?.toString() ?? '';

    const stringComparator = new Intl.Collator(['no', 'en'], {
      numeric: true,
      sensitivity: 'base',
    });

    return stringComparator.compare(valueOfA, valueOfB);
  });

  const getSortedData: () => T[] = () => {
    if (sortConfig.order === 'none') {
      return tableData;
    }
    if (sortConfig.order === 'descending') {
      return [...tableSortedAscending].reverse();
    }
    return tableSortedAscending;
  };

  const sortedData = getSortedData();

  const getSortableHeaderProps = ({
    name,
    sortable = true,
    buttonProps,
    ...props
  }: SortableHeaderProps): SortableHeaderReturnProps => {
    return {
      name,
      sortable,
      sortConfig: sortConfig,
      sortableButtonProps: {
        onClick: () => onSortRequested(name),
        ...buttonProps,
      },
      ...props,
    };
  };

  const getSortableTableProps = ({
    sortable = true,
    ...props
  }: SortableTableProps = {}): SortableTableReturnProps => {
    return {
      sortable,
      sortConfig: sortConfig,
      ...props,
    };
  };

  return { sortedData, getSortableHeaderProps, getSortableTableProps };
}

export type SortableHeaderProps = {
  /** Navnet headeren skal se etter i forhold til sortering av items */
  name: string;
  /** Om headeren skal være sorterbar eller ikke
   * @default true */
  sortable?: boolean;
  /** Props som sendes til knapp-elementet  */
  buttonProps?: Omit<
    DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'type' | 'onClick'
  >;
  [key: string]: any;
};

export type SortableHeaderReturnProps = {
  name: string;
  sortable: boolean;
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
