import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DataCell,
  ExternalSortConfig,
  HeaderCell,
  Table,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  useSortableData,
} from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('composes a named table with column headers, body rows and a footer', () => {
  render(
    <Table>
      <caption>Avganger</caption>
      <TableHead>
        <TableRow>
          <HeaderCell scope="col">Sted</HeaderCell>
          <HeaderCell scope="col">Antall</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <DataCell>Oslo</DataCell>
          <DataCell>2</DataCell>
        </TableRow>
      </TableBody>
      <TableFooter>
        <TableRow>
          <DataCell>Totalt</DataCell>
          <DataCell>2</DataCell>
        </TableRow>
      </TableFooter>
    </Table>,
  );
  const table = screen.getByRole('table', { name: 'Avganger' });
  const [head, body, footer] = within(table).getAllByRole('rowgroup');
  expect(
    within(head)
      .getAllByRole('columnheader')
      .map(cell => cell.textContent),
  ).toEqual(['Sted', 'Antall']);
  expect(within(body).getByRole('row', { name: 'Oslo 2' })).toBeInTheDocument();
  expect(
    within(footer).getByRole('row', { name: 'Totalt 2' }),
  ).toBeInTheDocument();
  expect(within(table).getAllByRole('cell')).toHaveLength(4);
});

const departures = [
  { name: 'Bergen', route: { number: 10 } },
  { name: 'Oslo', route: { number: 2 } },
  { name: 'Alta', route: { number: 1 } },
];

function SortableTable({
  data = departures,
  sortConfig,
}: {
  data?: typeof departures;
  sortConfig?: ExternalSortConfig;
}) {
  const { sortedData, getSortableHeaderProps, getSortableTableProps } =
    useSortableData(data, sortConfig);
  return (
    <Table {...getSortableTableProps()}>
      <TableHead>
        <TableRow>
          <HeaderCell {...getSortableHeaderProps({ name: 'name' })}>
            Sted
          </HeaderCell>
          <HeaderCell {...getSortableHeaderProps({ name: 'route.number' })}>
            Linje
          </HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sortedData.map(item => (
          <TableRow key={item.name}>
            <DataCell>{item.name}</DataCell>
            <DataCell>{item.route.number}</DataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

test('does not spread sortConfig onto the DOM element', () => {
  render(<SortableTable />);
  const tableElement = screen.getByRole('table');
  expect(tableElement).not.toHaveAttribute('sortConfig');
  expect(tableElement).not.toHaveAttribute('sortconfig');
});

function expectRowOrder(names: string[]) {
  const body = screen.getAllByRole('rowgroup')[1];
  expect(
    within(body)
      .getAllByRole('row')
      .map(row => within(row).getAllByRole('cell')[0].textContent),
  ).toEqual(names);
}

test('cycles mouse sorting through ascending, descending and original order', async () => {
  const user = userEvent.setup();
  render(<SortableTable />);
  const header = screen.getByRole('columnheader', { name: 'Sted' });
  const button = within(header).getByRole('button');
  expect(screen.getByRole('table')).toHaveAccessibleDescription(
    'Tabelloverskrifter med knapper kan trykkes på for å endre sortering,',
  );
  expectRowOrder(['Bergen', 'Oslo', 'Alta']);
  expect(header).not.toHaveAttribute('aria-sort');

  await user.click(button);
  expectRowOrder(['Alta', 'Bergen', 'Oslo']);
  expect(header).toHaveAttribute('aria-sort', 'ascending');
  await user.click(button);
  expectRowOrder(['Oslo', 'Bergen', 'Alta']);
  expect(header).toHaveAttribute('aria-sort', 'descending');
  await user.click(button);
  expectRowOrder(['Bergen', 'Oslo', 'Alta']);
  expect(header).toHaveAttribute('aria-sort', 'none');
  expect(departures.map(item => item.name)).toEqual(['Bergen', 'Oslo', 'Alta']);
});

test('sorts with Enter and Space while keeping focus on the header button', async () => {
  const user = userEvent.setup();
  render(<SortableTable />);
  const header = screen.getByRole('columnheader', { name: 'Sted' });
  const button = within(header).getByRole('button');
  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expectRowOrder(['Alta', 'Bergen', 'Oslo']);
  expect(header).toHaveAttribute('aria-sort', 'ascending');
  await user.keyboard(' ');
  expectRowOrder(['Oslo', 'Bergen', 'Alta']);
  expect(header).toHaveAttribute('aria-sort', 'descending');
  expect(button).toHaveFocus();
});

test('switches columns to ascending numeric sorting using a nested data key', async () => {
  const user = userEvent.setup();
  render(<SortableTable sortConfig={{ key: 'name', order: 'descending' }} />);
  const nameHeader = screen.getByRole('columnheader', { name: /^Sted/ });
  const routeHeader = screen.getByRole('columnheader', { name: 'Linje' });
  expect(nameHeader).toHaveAttribute('aria-sort', 'descending');
  await user.click(within(routeHeader).getByRole('button'));
  expectRowOrder(['Alta', 'Oslo', 'Bergen']);
  expect(routeHeader).toHaveAttribute('aria-sort', 'ascending');
  expect(nameHeader).not.toHaveAttribute('aria-sort');
});

test('reflects external sort configuration and refreshed data in rendered rows', () => {
  const { rerender } = render(
    <SortableTable sortConfig={{ key: 'name', order: 'ascending' }} />,
  );
  expectRowOrder(['Alta', 'Bergen', 'Oslo']);
  rerender(
    <SortableTable
      data={[...departures, { name: 'Drammen', route: { number: 3 } }]}
      sortConfig={{ key: 'name', order: 'descending' }}
    />,
  );
  expectRowOrder(['Oslo', 'Drammen', 'Bergen', 'Alta']);
  expect(screen.getByRole('columnheader', { name: /^Sted/ })).toHaveAttribute(
    'aria-sort',
    'descending',
  );
});

test('table, row and cell props select their modifier classes', () => {
  render(
    <Table fixed spacing="small" sortable aria-label="Avganger">
      <TableHead>
        <TableRow>
          <HeaderCell padding="checkbox">Valgt</HeaderCell>
          <HeaderCell>Sted</HeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow hover active error>
          <DataCell padding="radio">Ja</DataCell>
          <DataCell padding="overflow-menu">Oslo</DataCell>
        </TableRow>
        <TableRow>
          <DataCell>Nei</DataCell>
          <DataCell>Bergen</DataCell>
        </TableRow>
      </TableBody>
    </Table>,
  );
  const table = screen.getByRole('table', { name: 'Avganger' });
  expect(table).toHaveClass(
    'eds-table',
    'eds-table--fixed',
    'eds-table--small',
    'eds-table--sortable',
  );
  expect(table).not.toHaveClass('eds-table--middle');
  expect(screen.getByRole('columnheader', { name: 'Valgt' })).toHaveClass(
    'eds-table__header-cell--padding-checkbox',
  );
  const [, highlighted, plain] = screen.getAllByRole('row');
  expect(highlighted).toHaveClass(
    'eds-table__row--hover',
    'eds-table__row--active',
    'eds-table__row--error',
  );
  expect(plain).not.toHaveClass(
    'eds-table__row--hover',
    'eds-table__row--active',
    'eds-table__row--error',
  );
  expect(screen.getByRole('cell', { name: 'Ja' })).toHaveClass(
    'eds-table__data-cell--padding-radio',
  );
  expect(screen.getByRole('cell', { name: 'Oslo' })).toHaveClass(
    'eds-table__data-cell--padding-overflow-menu',
  );
  expect(screen.getByRole('cell', { name: 'Bergen' }).className).toBe(
    'eds-table__data-cell',
  );
});

test('spacing="middle" selects the middle modifier class', () => {
  render(
    <Table spacing="middle" aria-label="Avganger">
      <TableBody>{null}</TableBody>
    </Table>,
  );
  expect(screen.getByRole('table')).toHaveClass('eds-table--middle');
});

describeComponentContract('Table', {
  render: props => (
    <Table aria-label="Avganger" {...props}>
      <TableBody>{null}</TableBody>
    </Table>
  ),
  getElement: () => screen.getByRole('table'),
  baseClassName: 'eds-table',
  refElement: HTMLTableElement,
});

describeComponentContract('TableHead', {
  render: props => (
    <table>
      <TableHead {...props}>{null}</TableHead>
    </table>
  ),
  getElement: () => screen.getByRole('rowgroup'),
  baseClassName: 'eds-table__head',
  refElement: HTMLTableSectionElement,
});

describeComponentContract('TableBody', {
  render: props => (
    <table>
      <TableBody {...props}>{null}</TableBody>
    </table>
  ),
  getElement: () => screen.getByRole('rowgroup'),
  baseClassName: 'eds-table__body',
  refElement: HTMLTableSectionElement,
});

describeComponentContract('TableFooter', {
  render: props => (
    <table>
      <TableFooter {...props}>{null}</TableFooter>
    </table>
  ),
  getElement: () => screen.getByRole('rowgroup'),
  refElement: HTMLTableSectionElement,
});

describeComponentContract('TableRow', {
  render: props => (
    <table>
      <tbody>
        <TableRow {...props}>
          <td>Oslo</td>
        </TableRow>
      </tbody>
    </table>
  ),
  getElement: () => screen.getByRole('row'),
  baseClassName: 'eds-table__row',
  refElement: HTMLTableRowElement,
});

describeComponentContract('HeaderCell', {
  render: props => (
    <table>
      <thead>
        <tr>
          <HeaderCell {...props}>Sted</HeaderCell>
        </tr>
      </thead>
    </table>
  ),
  getElement: () => screen.getByRole('columnheader'),
  baseClassName: 'eds-table__header-cell',
  refElement: HTMLTableCellElement,
});

describeComponentContract('DataCell', {
  render: props => (
    <table>
      <tbody>
        <tr>
          <DataCell {...props}>Oslo</DataCell>
        </tr>
      </tbody>
    </table>
  ),
  getElement: () => screen.getByRole('cell'),
  baseClassName: 'eds-table__data-cell',
  refElement: HTMLTableCellElement,
});
