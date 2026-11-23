import { createRoot } from 'react-dom/client';
import {
  DataCell,
  Table,
  TableBody,
  TableRow,
  useTableKeyboardNavigation,
} from '@entur/table';

import '@entur/tokens/styles';
import '@entur/table/styles';
import '@entur/typography/styles';

const rows = ['Oslo', 'Bergen', 'Trondheim'];

function TableFixture() {
  const { getTableBodyNavigationProps, getTableRowNavigationProps } =
    useTableKeyboardNavigation(rows.length);
  return (
    <main>
      <button type="button">Before table</button>
      <Table>
        <TableBody {...getTableBodyNavigationProps()}>
          {rows.map((name, index) => (
            <TableRow key={name} {...getTableRowNavigationProps(index)}>
              <DataCell>{name}</DataCell>
              <DataCell>
                <button type="button">Edit {name}</button>
              </DataCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <button type="button">After table</button>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(<TableFixture />);
