import React, { useState } from 'react';
import { TableBodyProps, TableRowProps } from './index';

function onTableKeypress(
  event: React.KeyboardEvent,
  currentRow: number,
  maxRow: number,
  allowWrap?: boolean,
) {
  const keyPress = event.key;
  switch (keyPress) {
    case 'ArrowUp':
      event.preventDefault();
      if (allowWrap) {
        return currentRow === 0 ? maxRow - 1 : currentRow - 1;
      } else {
        return currentRow > 0 ? currentRow - 1 : 0;
      }
    case 'ArrowDown':
      event.preventDefault();
      if (allowWrap) {
        return currentRow === maxRow - 1 ? 0 : currentRow + 1;
      } else {
        return currentRow < maxRow - 1 ? currentRow + 1 : currentRow;
      }
    default:
      return currentRow;
  }
}

export type useTableKeyboardNavigationProps = (
  /** Antall rader i tabellen */
  numberOfRows: number,
  /** Tillate at man kan navigere sirkulært
   * @default false
   */
  allowWrap?: boolean,
) => {
  getTableRowNavigationProps: (
    /** Raden i tabellen (0-indeksert) */
    row: number,
  ) => Partial<TableRowProps>;
  getTableBodyNavigationProps: () => Partial<TableBodyProps>;
};

export const useTableKeyboardNavigation: useTableKeyboardNavigationProps = (
  numberOfRows = 0,
  allowWrap = true,
) => {
  const [currentRow, setCurrentRow] = useState(numberOfRows);
  const [maxRow, setMaxRow] = useState(0);

  const tableBodyRef = React.useRef<HTMLTableSectionElement>(null);
  const tableHasFocus = tableBodyRef?.current?.contains(document.activeElement);

  React.useEffect(() => {
    tableBodyRef &&
      tableBodyRef.current &&
      tableHasFocus &&
      tableBodyRef.current.childNodes[
        currentRow
      ].childNodes[0].parentElement?.focus();
  }, [currentRow, tableHasFocus]);

  function getTableBodyNavigationProps(...rest: any): Partial<TableBodyProps> {
    return {
      ref: tableBodyRef,
      ...rest,
    };
  }

  const tableRowRef = React.useRef<HTMLTableRowElement>(null);
  function getTableRowNavigationProps(
    row: number,
    ...rest: any
  ): Partial<TableRowProps> {
    if (row >= maxRow) {
      setMaxRow(row + 1);
    }
    const tabIndex = currentRow ? 0 : -1;
    return {
      tabIndex,
      ref: tableRowRef,
      onClick: () => setCurrentRow(row),
      onKeyDown: (e: React.KeyboardEvent) => {
        const newCell = onTableKeypress(e, currentRow, numberOfRows, allowWrap);
        setCurrentRow(newCell);
      },
      ...rest,
    };
  }
  return { getTableRowNavigationProps, getTableBodyNavigationProps };
};
