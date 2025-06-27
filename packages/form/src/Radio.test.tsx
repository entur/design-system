import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toHaveNoViolations, axe } from 'jest-axe';
import { Radio, RadioGroup } from './';
expect.extend(toHaveNoViolations);

test('Radio buttons works nicely', () => {
  const spy = jest.fn();

  const { getByLabelText, rerender } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );

  const firstOption = getByLabelText('Oslo');
  const secondOption = getByLabelText('Bergen');

  expect(firstOption).toHaveProperty('checked', true);
  expect(secondOption).toHaveProperty('checked', false);

  fireEvent.click(secondOption);

  expect(spy).toHaveBeenCalled();

  rerender(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );

  expect(firstOption).toHaveProperty('checked', false);
  expect(secondOption).toHaveProperty('checked', true);
});

test('Removes fieldset if label is not set', () => {
  const spy = jest.fn();

  const { getByLabelText, container, rerender } = render(
    <RadioGroup name="city" value="Oslo" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );
  expect(getByLabelText('Oslo')).toHaveProperty('checked', true);
  expect(container.nodeName).toBe('DIV');
  container.firstChild && expect(container.firstChild.nodeName).toBe('LABEL');
  rerender(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );
  container.firstChild &&
    expect(container.firstChild.nodeName).toBe('FIELDSET');
});

test('Radio and RadioGroup should not have basic accessibility issues', async () => {
  const spy = jest.fn();
  const { container } = render(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('readonly checked Radio is included in form submission', () => {
  const handleSubmit = jest.fn((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const result = Object.fromEntries(data.entries());
    (handleSubmit as any).submittedData = result;
  });

  const { getByRole } = render(
    <form onSubmit={handleSubmit}>
      <RadioGroup
        name="city"
        label="Velg by"
        value="Oslo"
        onChange={() => undefined}
      >
        <Radio value="Oslo" readOnly>
          Oslo
        </Radio>
        <Radio value="Bergen" readOnly>
          Bergen
        </Radio>
      </RadioGroup>
      <button type="submit">Send</button>
    </form>,
  );

  fireEvent.click(getByRole('button', { name: /send/i }));

  expect(handleSubmit).toHaveBeenCalled();
  expect((handleSubmit as any).submittedData).toEqual({
    city: 'Oslo',
  });
});
