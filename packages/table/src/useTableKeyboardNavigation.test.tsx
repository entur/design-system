import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DataCell,
  Table,
  TableBody,
  TableRow,
  useTableKeyboardNavigation,
} from '.';

function NavigableTable({
  allowWrap,
  rows = ['Oslo', 'Bergen', 'Alta'],
}: {
  allowWrap: boolean;
  rows?: string[];
}) {
  const { getTableBodyNavigationProps, getTableRowNavigationProps } =
    useTableKeyboardNavigation(rows.length, allowWrap);
  return (
    <Table>
      <TableBody {...getTableBodyNavigationProps()}>
        {rows.map((name, index) => (
          <TableRow key={name} {...getTableRowNavigationProps(index)}>
            <DataCell>{name}</DataCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

test('moves focus between clicked rows and stops at boundaries when wrapping is disabled', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap={false} />);
  const [first, middle, last] = screen.getAllByRole('row');
  await user.click(first);
  expect(first).toHaveFocus();
  await user.keyboard('{ArrowUp}');
  expect(first).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(middle).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(last).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(last).toHaveFocus();
  await user.keyboard('{ArrowUp}');
  expect(middle).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(middle).toHaveFocus();
});

test('wraps focus in both directions when enabled', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap />);
  const [first, , last] = screen.getAllByRole('row');
  await user.click(first);
  await user.keyboard('{ArrowUp}');
  expect(last).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(first).toHaveFocus();
});

test('keeps focus on the only row when wrapping a one-row table', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap rows={['Oslo']} />);
  const row = screen.getByRole('row', { name: 'Oslo' });
  await user.click(row);
  await user.keyboard('{ArrowDown}{ArrowUp}');
  expect(row).toHaveFocus();
});

// Bug: currentRow starts at rows.length and Tab focus never updates it.
test.failing(
  'navigates from the row reached by Tab without requiring a mouse click',
  async () => {
    const user = userEvent.setup();
    render(<NavigableTable allowWrap={false} />);
    const [first, second] = screen.getAllByRole('row');
    await user.tab();
    expect(first).toHaveFocus();
    await user.keyboard('{ArrowDown}');
    expect(second).toHaveFocus();
  },
);
