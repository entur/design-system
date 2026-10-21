import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DataCell,
  ExpandRowButton,
  ExpandableRow,
  Table,
  TableBody,
  TableRow,
} from '.';

function ExpandableTable({
  open,
  onToggle,
}: {
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <Table>
      <TableBody>
        <TableRow>
          <DataCell>Oslo</DataCell>
          <DataCell>
            <ExpandRowButton open={open} onClick={onToggle} />
          </DataCell>
        </TableRow>
        <ExpandableRow open={open} colSpan={2}>
          <a href="/avgang">Avgangsdetaljer</a>
        </ExpandableRow>
      </TableBody>
    </Table>
  );
}

test('requests expansion but waits for the parent to update open', async () => {
  const user = userEvent.setup();
  const onToggle = jest.fn();
  const { rerender } = render(
    <ExpandableTable open={false} onToggle={onToggle} />,
  );
  expect(
    screen.queryByRole('link', { name: 'Avgangsdetaljer' }),
  ).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Utvid tabellrad' }));
  expect(onToggle).toHaveBeenCalledTimes(1);
  expect(
    screen.queryByRole('link', { name: 'Avgangsdetaljer' }),
  ).not.toBeInTheDocument();
  rerender(<ExpandableTable open onToggle={onToggle} />);
  const link = await screen.findByRole('link', { name: 'Avgangsdetaljer' });
  expect(link.closest('td')).toHaveAttribute('colspan', '2');
  expect(
    screen.getByRole('button', { name: 'Lukk tabellrad' }),
  ).toBeInTheDocument();
});

test('opens and closes controlled details using the keyboard', async () => {
  function ControlledTable() {
    const [open, setOpen] = useState(false);
    return (
      <ExpandableTable open={open} onToggle={() => setOpen(value => !value)} />
    );
  }
  const user = userEvent.setup();
  render(<ControlledTable />);
  await user.tab();
  const toggle = screen.getByRole('button', { name: 'Utvid tabellrad' });
  expect(toggle).toHaveFocus();
  await user.keyboard('{Enter}');
  await screen.findByRole('link', { name: 'Avgangsdetaljer' });
  expect(toggle).toHaveAccessibleName('Lukk tabellrad');
  await user.keyboard(' ');
  // jsdom has no CSS grid transitions or inert focus handling; assert accessibility-tree exclusion.
  await waitFor(() =>
    expect(
      screen.queryByRole('link', { name: 'Avgangsdetaljer' }),
    ).not.toBeInTheDocument(),
  );
  expect(toggle).toHaveAccessibleName('Utvid tabellrad');
  expect(toggle).toHaveFocus();
});
