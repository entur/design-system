import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { RadioPanel } from './';
import { RadioGroup } from '../';
import { toHaveNoViolations, axe } from 'jest-axe';
expect.extend(toHaveNoViolations);

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

test('RadioPanel should not have basic accessibility issues', async () => {
  const spy = jest.fn();
  const { container } = render(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <RadioPanel title="Oslo" value="Oslo" />
      <RadioPanel title="Bergen" value="Bergen" />
    </RadioGroup>,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
