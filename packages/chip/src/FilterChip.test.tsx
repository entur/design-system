import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { FilterChip } from '.';

test('filters toggle independently with mouse and Space and hide decorative icons', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn(event => ({
    value: event.target.value,
    checked: event.target.checked,
  }));
  const { container } = render(
    <>
      <FilterChip value="train" onChange={onChange}>
        Tog
      </FilterChip>
      <FilterChip value="bus" defaultChecked>
        Buss
      </FilterChip>
    </>,
  );
  const train = screen.getByRole('checkbox', { name: 'Tog' });
  const bus = screen.getByRole('checkbox', { name: 'Buss' });
  expect(train).not.toBeChecked();
  expect(bus).toBeChecked();
  const icons = container.querySelectorAll('svg');
  expect(icons).toHaveLength(2);
  for (const icon of Array.from(icons)) {
    expect(icon).toHaveAttribute('aria-hidden', 'true');
  }

  await user.tab();
  expect(train).toHaveFocus();
  await user.keyboard(' ');
  expect(train).toBeChecked();
  expect(bus).toBeChecked();
  expect(onChange).toHaveNthReturnedWith(1, { value: 'train', checked: true });

  await user.click(train);
  expect(train).not.toBeChecked();
  expect(bus).toBeChecked();
  expect(onChange).toHaveNthReturnedWith(2, { value: 'train', checked: false });
  expect(onChange).toHaveBeenCalledTimes(2);
});

test('a controlled filter waits for its parent to update checked', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn(event => event.target.checked);
  const { rerender } = render(
    <FilterChip value="train" checked={false} onChange={onChange}>
      Tog
    </FilterChip>,
  );
  const train = screen.getByRole('checkbox', { name: 'Tog' });
  await user.click(train);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveLastReturnedWith(true);
  expect(train).not.toBeChecked();

  rerender(
    <FilterChip value="train" checked onChange={onChange}>
      Tog
    </FilterChip>,
  );
  expect(train).toBeChecked();
  await user.keyboard(' ');
  expect(onChange).toHaveBeenCalledTimes(2);
  expect(onChange).toHaveLastReturnedWith(false);
  expect(train).toBeChecked();

  rerender(
    <FilterChip value="train" checked={false} onChange={onChange}>
      Tog
    </FilterChip>,
  );
  expect(train).not.toBeChecked();
});

test('a disabled filter preserves selection and is skipped by keyboard navigation', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <>
      <FilterChip value="train" disabled defaultChecked onChange={onChange}>
        Tog
      </FilterChip>
      <FilterChip value="bus">Buss</FilterChip>
    </>,
  );
  const train = screen.getByRole('checkbox', { name: 'Tog' });
  const bus = screen.getByRole('checkbox', { name: 'Buss' });
  expect(train).toBeDisabled();
  expect(train).not.toHaveAttribute('aria-disabled');
  expect(bus).not.toBeDisabled();
  expect(bus).not.toHaveAttribute('aria-disabled');
  await user.click(train);
  await user.tab();
  expect(bus).toHaveFocus();
  await user.keyboard(' ');
  expect(bus).toBeChecked();
  expect(train).toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('forwards className and style to the label, rest props and ref to the checkbox, and selects size classes', () => {
  const ref = React.createRef<HTMLInputElement>();
  const { rerender } = render(
    <FilterChip
      value="bus"
      ref={ref}
      className="consumer-class"
      style={{ marginTop: '7px' }}
      data-consumer="value"
    >
      Buss
    </FilterChip>,
  );
  const checkbox = screen.getByRole('checkbox', { name: 'Buss' });
  expect(ref.current).toBe(checkbox);
  expect(checkbox).toHaveAttribute('data-consumer', 'value');
  const label = checkbox.closest('label');
  expect(label).toHaveClass('consumer-class', 'eds-filter-chip');
  expect(label).toHaveStyle({ marginTop: '7px' });
  expect(screen.getByText('Buss')).toHaveClass('eds-chip--size-medium');
  expect(screen.getByText('Buss')).not.toHaveClass('eds-chip--disabled');

  rerender(
    <FilterChip value="bus" size="small" disabled>
      Buss
    </FilterChip>,
  );
  expect(screen.getByText('Buss')).toHaveClass(
    'eds-chip--size-small',
    'eds-chip--disabled',
  );
});
