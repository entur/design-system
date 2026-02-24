import React from 'react';
import { render } from '@testing-library/react';
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  DataCell,
  HeaderCell,
  useSortableData,
} from '.';

test('creates a nice looking table', () => {
  const { container } = render(
    <Table>
      <TableHead>
        <TableRow>
          <HeaderCell>Heading</HeaderCell>
          <HeaderCell>Enda en heading</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <DataCell>Hei på deg</DataCell>
          <DataCell>Du er grei</DataCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  expect(container.querySelector('.eds-table')).toBeInTheDocument();
  expect(container.querySelector('.eds-table__body')).toBeInTheDocument();
  expect(container.querySelector('.eds-table__row')).toBeInTheDocument();
  expect(container.querySelector('.eds-table__data-cell')).toBeInTheDocument();
  expect(
    container.querySelector('.eds-table__header-cell'),
  ).toBeInTheDocument();
});

function SortableTable() {
  const { sortedData, getSortableHeaderProps, getSortableTableProps } =
    useSortableData([{ name: 'B' }, { name: 'A' }]);
  return (
    <Table {...getSortableTableProps()}>
      <TableHead>
        <TableRow>
          <HeaderCell {...getSortableHeaderProps({ name: 'name' })}>
            Name
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedData.map(item => (
          <TableRow key={item.name}>
            <DataCell>{item.name}</DataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

test('does not spread sortConfig onto the DOM element', () => {
  const { container } = render(<SortableTable />);
  const tableElement = container.querySelector('table');
  expect(tableElement).not.toHaveAttribute('sortConfig');
  expect(tableElement).not.toHaveAttribute('sortconfig');
});
