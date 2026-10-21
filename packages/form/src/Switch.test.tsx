import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Switch } from './';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('label click and Space toggle an uncontrolled Switch', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <Switch onChange={e => onChange(e.target.checked)}>Notifications</Switch>,
  );

  const input = screen.getByRole('checkbox', { name: 'Notifications' });
  await user.click(screen.getByText('Notifications'));
  expect(input).toBeChecked();
  expect(input).toHaveFocus();
  await user.keyboard(' ');
  expect(input).not.toBeChecked();
  expect(onChange.mock.calls).toEqual([[true], [false]]);
});

test('controlled Switch follows consumer state updates', async () => {
  const user = userEvent.setup();
  function Settings() {
    const [enabled, setEnabled] = React.useState(true);
    return (
      <Switch checked={enabled} onChange={e => setEnabled(e.target.checked)}>
        Notifications
      </Switch>
    );
  }
  render(<Settings />);
  const input = screen.getByRole('checkbox', { name: 'Notifications' });
  expect(input).toBeChecked();
  await user.tab();
  expect(input).toHaveFocus();
  await user.keyboard(' ');
  expect(input).not.toBeChecked();
});

test('disabled Switch cannot toggle and is skipped by Tab', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <>
      <Switch disabled defaultChecked onChange={onChange}>
        Notifications
      </Switch>
      <button>Continue</button>
    </>,
  );
  await user.click(screen.getByText('Notifications'));
  await user.tab();
  expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  expect(screen.getByRole('checkbox')).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('Switch should not have basic accessibility issues', async () => {
  const spy = jest.fn();
  const { container } = render(<Switch onClick={spy}>Accept terms</Switch>);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
