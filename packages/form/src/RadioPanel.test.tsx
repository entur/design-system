import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RadioPanel, RadioGroup } from './';
import { toHaveNoViolations, axe } from 'jest-axe';

test('RadioPanels works nicely', () => {
  const spy = jest.fn();

  const { getByDisplayValue, rerender } = render(
    <RadioGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo">
        Oslo
      </RadioPanel>
      <RadioPanel title={<div>Bergen</div>} value="Bergen">
        Bergen
      </RadioPanel>
    </RadioGroup>,
  );

  const firstOption = getByDisplayValue('Oslo');
  const secondOption = getByDisplayValue('Bergen');

  expect(firstOption).toHaveProperty('checked', true);
  expect(secondOption).toHaveProperty('checked', false);

  fireEvent.click(secondOption);

  expect(spy).toHaveBeenCalled();

  rerender(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo">
        Oslo
      </RadioPanel>
      <RadioPanel title="Bergen" value="Bergen">
        Bergen
      </RadioPanel>
    </RadioGroup>,
  );

  expect(firstOption).toHaveProperty('checked', false);
  expect(secondOption).toHaveProperty('checked', true);
});

expect.extend(toHaveNoViolations);
const spy = jest.fn();
test('RadioPanel to be accessible', async () => {
  const { container } = render(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <RadioPanel title="Bergen" value="Bergen" />)
    </RadioGroup>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
