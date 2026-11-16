import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { TableBodyProps, TableRowProps } from './index';

function onTableKeypress(
  event: KeyboardEvent,
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
  const [storedRow, setCurrentRow] = useState(0);
  const [maxRow, setMaxRow] = useState(0);
  // Keeps one row tabbable when filtering or paging removes the stored row
  const currentRow = Math.min(storedRow, Math.max(numberOfRows - 1, 0));

  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  // Only arrow keys move focus, so a click on a control in a row keeps it there
  const focusOnRowChange = useRef(false);

  useEffect(() => {
    if (!focusOnRowChange.current) return;
    focusOnRowChange.current = false;
    const row = tableBodyRef.current?.children[currentRow];
    if (row instanceof HTMLElement) row.focus();
  }, [currentRow]);

  function getTableBodyNavigationProps(...rest: any): Partial<TableBodyProps> {
    return {
      ref: tableBodyRef,
      ...rest,
    };
  }

  const tableRowRef = useRef<HTMLTableRowElement>(null);
  function getTableRowNavigationProps(
    row: number,
    ...rest: any
  ): Partial<TableRowProps> {
    if (row >= maxRow) {
      setMaxRow(row + 1);
    }
    return {
      tabIndex: row === currentRow ? 0 : -1,
      ref: tableRowRef,
      onClick: () => setCurrentRow(row),
      // Also for a control inside the row; only arrow keys move focus to the row
      onFocus: () => setCurrentRow(row),
      onKeyDown: (e: KeyboardEvent) => {
        const newCell = onTableKeypress(e, currentRow, numberOfRows, allowWrap);
        focusOnRowChange.current = newCell !== currentRow;
        setCurrentRow(newCell);
      },
      ...rest,
    };
  }
  return { getTableRowNavigationProps, getTableBodyNavigationProps };
};
