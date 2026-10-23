import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ActionChip } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('activates with mouse, Enter and Space without submitting a form', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  const onSubmit = jest.fn(event => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <ActionChip onClick={onClick}>Oppdater</ActionChip>
    </form>,
  );

  const button = screen.getByRole('button', { name: 'Oppdater' });
  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
  await user.click(button);
  expect(onClick).toHaveBeenCalledTimes(3);
  expect(onSubmit).not.toHaveBeenCalled();
});

test('disabled actions cannot be clicked and are skipped by keyboard navigation', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <>
      <ActionChip disabled onClick={onClick}>
        Oppdater
      </ActionChip>
      <button>Neste</button>
    </>,
  );

  const button = screen.getByRole('button', { name: 'Oppdater' });
  expect(button).toBeDisabled();
  await user.click(button);
  await user.tab();
  expect(screen.getByRole('button', { name: 'Neste' })).toHaveFocus();
  await user.keyboard('{Enter} ');
  expect(onClick).not.toHaveBeenCalled();
});

test('loading exposes busy state while preserving the action name', () => {
  const { rerender } = render(<ActionChip>Oppdater</ActionChip>);
  const button = screen.getByRole('button', { name: 'Oppdater' });
  expect(button).toHaveAttribute('aria-busy', 'false');

  rerender(<ActionChip loading>Oppdater</ActionChip>);
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toHaveAccessibleName('Oppdater');
  expect(screen.queryByText('Oppdater')).not.toBeInTheDocument();

  rerender(
    <ActionChip loading aria-label="Oppdater avganger">
      Oppdater
    </ActionChip>,
  );
  expect(button).toHaveAccessibleName('Oppdater avganger');

  rerender(<ActionChip>Oppdater</ActionChip>);
  expect(button).toHaveAttribute('aria-busy', 'false');
  expect(button).toHaveAccessibleName('Oppdater');
  expect(button).toHaveTextContent('Oppdater');
});

test('size and disabled select their modifier classes', () => {
  const { rerender } = render(<ActionChip>Del reise</ActionChip>);
  const chip = screen.getByRole('button', { name: 'Del reise' });
  expect(chip).toHaveClass('eds-action-chip', 'eds-chip--size-medium');
  expect(chip).not.toHaveClass('eds-chip--disabled');

  rerender(
    <ActionChip size="small" disabled>
      Del reise
    </ActionChip>,
  );
  expect(screen.getByRole('button', { name: 'Del reise' })).toHaveClass(
    'eds-chip--size-small',
    'eds-chip--disabled',
    'eds-action-chip--disabled',
  );
});

describeComponentContract('ActionChip', {
  render: props => <ActionChip {...props}>Del reise</ActionChip>,
  getElement: () => screen.getByRole('button', { name: 'Del reise' }),
  baseClassName: 'eds-action-chip',
  refElement: HTMLButtonElement,
});
