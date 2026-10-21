import React, { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { ChoiceChip, ChoiceChipGroup } from '.';

test('a named group reports the selected value but waits for the controlled value', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  const group = (value: string | null) => (
    <ChoiceChipGroup
      name="city"
      label="Velg by"
      value={value}
      onChange={onChange}
    >
      <ChoiceChip value="oslo">Oslo</ChoiceChip>
      <ChoiceChip value="bergen">Bergen</ChoiceChip>
    </ChoiceChipGroup>
  );
  const { rerender } = render(group(null));
  const options = within(screen.getByRole('group', { name: 'Velg by' }));
  const oslo = options.getByRole('radio', { name: 'Oslo' });
  const bergen = options.getByRole('radio', { name: 'Bergen' });
  expect(oslo).not.toBeChecked();
  expect(bergen).not.toBeChecked();

  await user.click(bergen);
  expect(onChange).toHaveBeenCalledTimes(1);
  expect(onChange).toHaveBeenLastCalledWith(
    expect.objectContaining({
      target: expect.objectContaining({ name: 'city', value: 'bergen' }),
    }),
  );
  expect(bergen).not.toBeChecked();

  rerender(group('bergen'));
  expect(bergen).toBeChecked();
  expect(oslo).not.toBeChecked();
  await user.click(bergen);
  expect(onChange).toHaveBeenCalledTimes(1);

  rerender(group('oslo'));
  expect(oslo).toBeChecked();
  expect(bergen).not.toBeChecked();
});

test('arrow keys select one option, skip disabled options and wrap within the group', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  function Cities() {
    const [value, setValue] = useState('oslo');
    return (
      <ChoiceChipGroup
        name="city"
        label="Velg by"
        value={value}
        onChange={event => {
          onChange(event.target.value);
          setValue(event.target.value);
        }}
      >
        <ChoiceChip value="oslo">Oslo</ChoiceChip>
        <ChoiceChip value="bergen" disabled>
          Bergen
        </ChoiceChip>
        <ChoiceChip value="trondheim">Trondheim</ChoiceChip>
      </ChoiceChipGroup>
    );
  }
  render(<Cities />);
  const oslo = screen.getByRole('radio', { name: 'Oslo' });
  const bergen = screen.getByRole('radio', { name: 'Bergen' });
  const trondheim = screen.getByRole('radio', { name: 'Trondheim' });
  expect(bergen).toBeDisabled();
  expect(bergen).not.toHaveAttribute('aria-disabled');
  expect(oslo).not.toHaveAttribute('aria-disabled');
  await user.click(bergen);
  expect(onChange).not.toHaveBeenCalled();

  await user.tab();
  expect(oslo).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  expect(trondheim).toHaveFocus();
  expect(trondheim).toBeChecked();
  expect(oslo).not.toBeChecked();
  expect(bergen).not.toBeChecked();
  expect(onChange).toHaveBeenNthCalledWith(1, 'trondheim');

  await user.keyboard('{ArrowRight}');
  expect(oslo).toHaveFocus();
  expect(oslo).toBeChecked();
  expect(trondheim).not.toBeChecked();
  expect(onChange).toHaveBeenNthCalledWith(2, 'oslo');
  expect(onChange).toHaveBeenCalledTimes(2);
});

test('disabling the group prevents selection and removes its radios from tab order', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <>
      <ChoiceChipGroup
        name="city"
        label="Velg by"
        value="oslo"
        onChange={onChange}
        disabled
      >
        <ChoiceChip value="oslo">Oslo</ChoiceChip>
        <ChoiceChip value="bergen">Bergen</ChoiceChip>
      </ChoiceChipGroup>
      <button>Neste</button>
    </>,
  );
  const oslo = screen.getByRole('radio', { name: 'Oslo' });
  const bergen = screen.getByRole('radio', { name: 'Bergen' });
  expect(oslo).toBeDisabled();
  expect(bergen).toBeDisabled();
  await user.click(bergen);
  await user.tab();
  expect(screen.getByRole('button', { name: 'Neste' })).toHaveFocus();
  await user.keyboard('{ArrowRight} ');
  expect(oslo).toBeChecked();
  expect(bergen).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

test('forwards className and size to the chip, style to the label, and rest props and ref to the radio', () => {
  const ref = React.createRef<HTMLInputElement>();
  render(
    <ChoiceChipGroup
      name="city"
      label="Velg by"
      value="Oslo"
      onChange={jest.fn()}
    >
      <ChoiceChip
        value="Oslo"
        ref={ref}
        className="consumer-class"
        style={{ marginTop: '7px' }}
        size="small"
        data-consumer="value"
      >
        Oslo
      </ChoiceChip>
      <ChoiceChip value="Bergen" disabled>
        Bergen
      </ChoiceChip>
    </ChoiceChipGroup>,
  );
  const radio = screen.getByRole('radio', { name: 'Oslo' });
  expect(ref.current).toBe(radio);
  expect(radio).toHaveAttribute('data-consumer', 'value');
  expect(radio.closest('label')).toHaveStyle({ marginTop: '7px' });
  expect(screen.getByText('Oslo')).toHaveClass(
    'consumer-class',
    'eds-chip',
    'eds-chip--size-small',
  );
  expect(screen.getByText('Oslo')).not.toHaveClass('eds-chip--disabled');
  expect(screen.getByText('Bergen')).toHaveClass(
    'eds-chip--size-medium',
    'eds-chip--disabled',
  );
});
