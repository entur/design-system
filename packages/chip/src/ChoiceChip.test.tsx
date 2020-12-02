import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ChoiceChip, ChoiceChipGroup } from './';

test('ChoiceChip and ChoiceChipGroup works together', () => {
  const spy = jest.fn();

  const { getByLabelText, rerender } = render(
    <ChoiceChipGroup name="city" label="Velg by" value="Oslo" onChange={spy}>
      <ChoiceChip value="Oslo">Oslo</ChoiceChip>
      <ChoiceChip value="Bergen">Bergen</ChoiceChip>
    </ChoiceChipGroup>,
  );

  const firstOption = getByLabelText('Oslo');
  const secondOption = getByLabelText('Bergen');

  expect(firstOption).toHaveProperty('checked', true);
  expect(secondOption).toHaveProperty('checked', false);

  fireEvent.click(secondOption);

  expect(spy).toHaveBeenCalled();

  rerender(
    <ChoiceChipGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <ChoiceChip value="Oslo">Oslo</ChoiceChip>
      <ChoiceChip value="Bergen">Bergen</ChoiceChip>
    </ChoiceChipGroup>,
  );

  expect(firstOption).toHaveProperty('checked', false);
  expect(secondOption).toHaveProperty('checked', true);
});
