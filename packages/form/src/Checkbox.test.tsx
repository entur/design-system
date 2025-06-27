import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toHaveNoViolations, axe } from 'jest-axe';
import { Checkbox, Fieldset } from './';
expect.extend(toHaveNoViolations);

test('Checkbox renders with appropriate label and is clickable, and state is set on click.', () => {
  const spy = jest.fn();
  const { getByLabelText } = render(
    <Checkbox onClick={spy}>Accept terms</Checkbox>,
  );

  const checkbox = getByLabelText('Accept terms');
  expect(checkbox).toHaveProperty('checked', false);
  fireEvent.click(checkbox);
  expect(spy).toHaveBeenCalled();
  expect(checkbox).toHaveProperty('checked', true);
  fireEvent.click(checkbox);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(checkbox).toHaveProperty('checked', false);
});

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

test('readonly checked Checkbox with `checked` prop is included in form submission', () => {
  const handleSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = Object.fromEntries(data.entries());
    (handleSubmit as any).submittedData = result;
  });

  const { getByRole } = render(
    <form onSubmit={handleSubmit}>
      <Checkbox name="terms" checked={true} readOnly onChange={() => undefined}>
        Godta vilkår
      </Checkbox>
      <button type="submit">Send</button>
    </form>,
  );

  fireEvent.click(getByRole('button', { name: /send/i }));

  expect(handleSubmit).toHaveBeenCalled();
  expect((handleSubmit as any).submittedData).toEqual({
    terms: 'on',
  });
});
