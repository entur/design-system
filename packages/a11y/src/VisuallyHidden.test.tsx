import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VisuallyHidden } from './VisuallyHidden';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('hidden text names an icon-only button that can be activated by keyboard', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  render(
    <button type="button" onClick={onClose}>
      <svg aria-hidden="true" />
      <VisuallyHidden>Close journey details</VisuallyHidden>
    </button>,
  );
  const button = screen.getByRole('button', { name: 'Close journey details' });

  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('hidden help text describes a labelled input without replacing its name', async () => {
  const user = userEvent.setup();
  render(
    <>
      <label htmlFor="departure">Departure</label>
      <input id="departure" aria-describedby="departure-help" />
      <VisuallyHidden as="p" id="departure-help">
        Enter a stop or address.
      </VisuallyHidden>
    </>,
  );
  const input = screen.getByRole('textbox', { name: 'Departure' });
  expect(input).toHaveAccessibleDescription('Enter a stop or address.');

  await user.tab();
  expect(input).toHaveFocus();
  await user.type(input, 'Oslo S');
  expect(input).toHaveValue('Oslo S');
});

describeComponentContract('VisuallyHidden', {
  render: props => <VisuallyHidden {...props}>Skjult tekst</VisuallyHidden>,
  getElement: () => screen.getByText('Skjult tekst'),
  as: 'p',
});

// Bug: a consumer className replaces eds-visually-hidden, so the text becomes visible.
test.failing('keeps its hiding class when given a consumer className', () => {
  render(
    <VisuallyHidden className="consumer-class">Skjult tekst</VisuallyHidden>,
  );
  expect(screen.getByText('Skjult tekst')).toHaveClass(
    'consumer-class',
    'eds-visually-hidden',
  );
});
