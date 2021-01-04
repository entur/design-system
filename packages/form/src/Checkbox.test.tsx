import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { toHaveNoViolations, axe } from 'jest-axe';
import { Checkbox } from './';

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
    <Checkbox checked="indeterminate" onChange={() => {}}>
      All
    </Checkbox>,
  );
  expect(getByLabelText('All')).toHaveProperty('indeterminate', true);
  expect(getByLabelText('All')).toHaveProperty('checked', false);

  rerender(
    <Checkbox checked={true} onChange={() => {}}>
      All
    </Checkbox>,
  );

  expect(getByLabelText('All')).toHaveProperty('indeterminate', false);
  expect(getByLabelText('All')).toHaveProperty('checked', true);
});

expect.extend(toHaveNoViolations);
test('Checkbox is accessible', async () => {
  const { container, rerender } = render(<Checkbox>a11y</Checkbox>);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
  rerender(<Checkbox reduceClickArea></Checkbox>);

  expect(results).toHaveNoViolations();
});
