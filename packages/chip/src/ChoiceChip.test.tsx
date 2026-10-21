import { fireEvent, render } from '@testing-library/react';

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

test('ChoiceChip relies on the native disabled attribute without aria-disabled', () => {
  const { getByLabelText } = render(
    <ChoiceChipGroup
      name="city"
      label="Velg by"
      value="Oslo"
      onChange={jest.fn()}
    >
      <ChoiceChip value="Oslo">Oslo</ChoiceChip>
      <ChoiceChip value="Bergen" disabled>
        Bergen
      </ChoiceChip>
    </ChoiceChipGroup>,
  );

  const enabledOption = getByLabelText('Oslo');
  expect(enabledOption).toHaveProperty('disabled', false);
  expect(enabledOption).not.toHaveAttribute('aria-disabled');

  const disabledOption = getByLabelText('Bergen');
  expect(disabledOption).toHaveProperty('disabled', true);
  expect(disabledOption).not.toHaveAttribute('aria-disabled');
});
