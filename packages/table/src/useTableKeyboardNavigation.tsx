import React, { useState } from 'react';

// https://www.w3.org/TR/wai-aria-practices/examples/grid/dataGrids.html

function onTableKeypress(
  event: React.KeyboardEvent,
  currentCell: number[],
  row?: number,
  col?: number,
  maxRow?: number,
  maxCol?: number,
  allowWrap?: boolean,
) {
  const keyPress = event.key;
  console.log(keyPress);

  console.log(row, col, maxRow, maxCol, allowWrap);

  switch (keyPress) {
    case 'ArrowUp':
      if (allowWrap) {
        return [currentCell[0] - 1, currentCell[1]];
      } else {
        return currentCell[0] > 0
          ? [currentCell[0] - 1, currentCell[1]]
          : currentCell;
      }
    case 'ArrowDown':
      return [currentCell[0] + 1, currentCell[1]];
    case 'ArrowLeft':
      return [currentCell[0], currentCell[1] - 1];
    case 'ArrowRight':
      return [currentCell[0], currentCell[1] + 1];
    default:
      break;
  }
  return [0, 0];
}

type useTableKeyboardNavigationProps = {
  /**Antall rader i tabellen */
  numberOfRows: number;
  /** Antall kolonner */
  numberOfColumns: number;
  allowWrap?: boolean;
};

export const useTableKeyboardNavigation: (
  e: useTableKeyboardNavigationProps,
) => any = ({ numberOfRows, numberOfColumns, allowWrap = true }) => {
  const [currentCell, setCurrentCell] = useState([0, 0]); // row, column
  const tableBodyRef = React.useRef<HTMLTableElement>();
  const tableHasFocus = tableBodyRef?.current?.contains(document.activeElement);
  console.log(numberOfRows);

  React.useEffect(() => {
    tableBodyRef &&
      tableBodyRef.current &&
      tableHasFocus &&
      tableBodyRef.current.childNodes[currentCell[0]].childNodes[
        currentCell[1]
      ].childNodes[0].parentElement?.focus();
  }, [currentCell]);

  function getTableBodyNavigationProps() {
    return { ref: tableBodyRef };
  }

  function getDataCellNavigationProps(
    row: number,
    column: number,
  ): Partial<
    React.DetailedHTMLProps<
      React.TdHTMLAttributes<HTMLTableDataCellElement>,
      HTMLTableDataCellElement
    >
  > {
    let tabIndex = -1;
    row === currentCell[0] && column === currentCell[1]
      ? (tabIndex = 0)
      : undefined;
    return {
      tabIndex,
      onClick: () => setCurrentCell([row, column]),
      onKeyDown: (e: React.KeyboardEvent) => {
        const newCell = onTableKeypress(
          e,
          currentCell,
          row,
          column,
          numberOfRows,
          numberOfColumns,
          allowWrap,
        );
        setCurrentCell(newCell);
      },
    };
  }

  return { getDataCellNavigationProps, getTableBodyNavigationProps };
};
