import { render } from '@testing-library/react';

import { FilterChip } from './';

test('FilterChip relies on the native disabled attribute without aria-disabled', () => {
  const { getByLabelText, rerender } = render(
    <FilterChip value="a">Enabled</FilterChip>,
  );
  const enabledInput = getByLabelText('Enabled');
  expect(enabledInput).toHaveProperty('disabled', false);
  expect(enabledInput).not.toHaveAttribute('aria-disabled');

  rerender(
    <FilterChip value="a" disabled>
      Disabled
    </FilterChip>,
  );
  const disabledInput = getByLabelText('Disabled');
  expect(disabledInput).toHaveProperty('disabled', true);
  expect(disabledInput).not.toHaveAttribute('aria-disabled');
});

test('FilterChip hides its decorative checkmark icon from assistive technology', () => {
  const { container } = render(<FilterChip value="a">Label</FilterChip>);
  const icon = container.querySelector('svg.eds-filter-chip-icon');
  expect(icon).toHaveAttribute('aria-hidden', 'true');
});
