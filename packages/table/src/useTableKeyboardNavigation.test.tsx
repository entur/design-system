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
  withButtons = false,
}: {
  allowWrap: boolean;
  rows?: string[];
  withButtons?: boolean;
}) {
  const { getTableBodyNavigationProps, getTableRowNavigationProps } =
    useTableKeyboardNavigation(rows.length, allowWrap);
  return (
    <Table>
      <TableBody {...getTableBodyNavigationProps()}>
        {rows.map((name, index) => (
          <TableRow key={name} {...getTableRowNavigationProps(index)}>
            <DataCell>{name}</DataCell>
            {withButtons && (
              <DataCell>
                <button type="button">Edit {name}</button>
              </DataCell>
            )}
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

test('navigates from the row reached by Tab without requiring a mouse click', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap={false} />);
  const [first, second] = screen.getAllByRole('row');
  await user.tab();
  expect(first).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(second).toHaveFocus();
});

test('keeps only the current row in the tab order', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap={false} />);
  const [first, second, third] = screen.getAllByRole('row');
  expect(first).toHaveAttribute('tabindex', '0');
  expect(second).toHaveAttribute('tabindex', '-1');
  expect(third).toHaveAttribute('tabindex', '-1');
  await user.click(third);
  expect(first).toHaveAttribute('tabindex', '-1');
  expect(third).toHaveAttribute('tabindex', '0');
});

test('leaves focus on a control inside a row reached by Tab', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap={false} withButtons />);
  await user.tab();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Edit Oslo' })).toHaveFocus();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Edit Bergen' })).toHaveFocus();
});

test('moves from the row of a control reached by Tab', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap={false} withButtons />);
  await user.tab();
  await user.tab();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Edit Bergen' })).toHaveFocus();
  await user.keyboard('{ArrowDown}');
  expect(screen.getAllByRole('row')[2]).toHaveFocus();
});

test('leaves focus on a control inside a row that is clicked', async () => {
  const user = userEvent.setup();
  render(<NavigableTable allowWrap={false} withButtons />);
  const edit = screen.getByRole('button', { name: 'Edit Bergen' });
  await user.click(edit);
  expect(edit).toHaveFocus();
  expect(screen.getAllByRole('row')[1]).toHaveAttribute('tabindex', '0');
});

test('keeps a row tabbable after the current row is removed', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<NavigableTable allowWrap={false} />);
  await user.click(screen.getByRole('row', { name: 'Alta' }));
  rerender(<NavigableTable allowWrap={false} rows={['Oslo']} />);
  expect(screen.getByRole('row', { name: 'Oslo' })).toHaveAttribute(
    'tabindex',
    '0',
  );
});
