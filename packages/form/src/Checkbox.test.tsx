import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Checkbox, Fieldset } from './';
expect.extend(toHaveNoViolations);

test('toggles through its label and Space with the new checked value', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <Checkbox onChange={e => onChange(e.target.checked)}>
      Accept terms
    </Checkbox>,
  );

  const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
  expect(checkbox).not.toBeChecked();
  await user.click(screen.getByText('Accept terms'));
  expect(checkbox).toBeChecked();
  expect(checkbox).toHaveFocus();
  await user.keyboard(' ');
  expect(checkbox).not.toBeChecked();
  expect(onChange.mock.calls).toEqual([[true], [false]]);
});

test('controlled checked state changes only when the consumer updates it', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  const { rerender } = render(
    <Checkbox checked={false} onChange={e => onChange(e.target.checked)}>
      Accept terms
    </Checkbox>,
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Accept terms' });
  await user.click(checkbox);
  expect(onChange).toHaveBeenCalledWith(true);
  expect(checkbox).not.toBeChecked();
  rerender(
    <Checkbox checked onChange={onChange}>
      Accept terms
    </Checkbox>,
  );
  expect(checkbox).toBeChecked();
});

test('disabled checkbox ignores label clicks and is skipped by Tab', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <>
      <Checkbox disabled onChange={onChange}>
        Accept terms
      </Checkbox>
      <button>Continue</button>
    </>,
  );
  await user.click(screen.getByText('Accept terms'));
  await user.tab();
  expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  expect(screen.getByRole('checkbox')).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

// Bug: readOnly blocks keys but does not prevent the native checkbox click.
test.failing(
  'readOnly checkbox cannot be changed by clicking its label',
  async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Checkbox readOnly onChange={onChange}>
        Accept terms
      </Checkbox>,
    );
    await user.click(screen.getByText('Accept terms'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
    expect(onChange).not.toHaveBeenCalled();
  },
);

test('checkboxes can be indeterminate', () => {
  const { getByLabelText, rerender } = render(
    <Checkbox checked="indeterminate" onChange={() => undefined}>
      All
    </Checkbox>,
  );
  expect(getByLabelText('All')).toHaveProperty('indeterminate', true);
  expect(getByLabelText('All')).toHaveProperty('checked', false);

  rerender(
    <Checkbox checked={true} onChange={() => undefined}>
      All
    </Checkbox>,
  );

  expect(getByLabelText('All')).toHaveProperty('indeterminate', false);
  expect(getByLabelText('All')).toHaveProperty('checked', true);
});

test('Checkbox should not have basic accessibility issues', async () => {
  const { container } = render(
    <Fieldset label="Field with three checkboxes">
      <Checkbox reduceClickArea>1</Checkbox>
      <Checkbox>2</Checkbox>
      <Checkbox>3</Checkbox>
    </Fieldset>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('readonly checked Checkbox with `checked` prop is included in form submission', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();

  const { getByRole } = render(
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(Object.fromEntries(new FormData(e.currentTarget)));
      }}
    >
      <Checkbox name="terms" checked={true} readOnly onChange={() => undefined}>
        Godta vilkår
      </Checkbox>
      <button type="submit">Send</button>
    </form>,
  );

  await user.click(getByRole('button', { name: /send/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    terms: 'on',
  });
});
