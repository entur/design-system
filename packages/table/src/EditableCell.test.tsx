import { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextField } from '@entur/form';
import { EditableCell, Table, TableBody, TableRow } from '.';

function EditableTable({ feedback }: { feedback?: string }) {
  const [value, setValue] = useState('Oslo');
  return (
    <>
      <Table>
        <TableBody>
          <TableRow>
            <EditableCell
              feedback={feedback}
              variant={feedback ? 'negative' : undefined}
            >
              <TextField
                label="Sted"
                value={value}
                onChange={event => setValue(event.target.value)}
              />
            </EditableCell>
          </TableRow>
        </TableBody>
      </Table>
      <button type="button">Lagre</button>
    </>
  );
}

test('edits the supplied input directly without opening an editor or an empty tooltip', async () => {
  const user = userEvent.setup();
  render(<EditableTable />);
  const input = within(screen.getByRole('cell')).getByRole('textbox', {
    name: 'Sted',
  });
  await user.tab();
  expect(input).toHaveFocus();
  await user.clear(input);
  await user.type(input, 'Bergen');
  expect(input).toHaveValue('Bergen');
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(input).not.toHaveAttribute('aria-describedby');
});

test('exposes cell feedback on input focus and hides it on blur', async () => {
  const user = userEvent.setup();
  render(<EditableTable feedback="Velg et gyldig sted" />);
  const input = screen.getByRole('textbox', { name: 'Sted' });
  expect(input).toBeInvalid();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  await user.tab();
  expect(screen.getByRole('tooltip')).toHaveTextContent('Velg et gyldig sted');
  expect(input).toHaveAccessibleDescription('Velg et gyldig sted');
  await user.tab();
  expect(screen.getByRole('button', { name: 'Lagre' })).toHaveFocus();
  expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  expect(input).not.toHaveAttribute('aria-describedby');
});
