import React from 'react';
import { render } from '@testing-library/react';
import { Table, TableHead, TableBody, TableRow, DataCell, HeaderCell } from '.';

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
