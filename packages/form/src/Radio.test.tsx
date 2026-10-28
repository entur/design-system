import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Radio, RadioGroup } from './';
expect.extend(toHaveNoViolations);

test('label clicks report the selected value and respect controlled state', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();

  const { getByLabelText, rerender } = render(
    <RadioGroup
      name="city"
      label="Velg by"
      value="Oslo"
      onChange={e => onChange(e.target.value)}
    >
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );

  const firstOption = getByLabelText('Oslo');
  const secondOption = getByLabelText('Bergen');

  expect(firstOption).toHaveProperty('checked', true);
  expect(secondOption).toHaveProperty('checked', false);

  await user.click(screen.getByText('Bergen'));

  expect(onChange.mock.calls).toEqual([['Bergen']]);
  expect(firstOption).toBeChecked();
  expect(secondOption).not.toBeChecked();

  rerender(
    <RadioGroup
      name="city"
      label="Velg by"
      value="Bergen"
      onChange={e => onChange(e.target.value)}
    >
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );

  expect(firstOption).toHaveProperty('checked', false);
  expect(secondOption).toHaveProperty('checked', true);
});

test('label supplies an accessible group name without adding an unnamed group when absent', () => {
  const spy = jest.fn();

  const { rerender } = render(
    <RadioGroup name="city" value="Oslo" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );
  expect(screen.queryByRole('group')).not.toBeInTheDocument();
  expect(screen.getAllByRole('radio')).toHaveLength(2);
  rerender(
    <RadioGroup name="city" label="Velg by" value="Bergen" onChange={spy}>
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );
  expect(screen.getByRole('group', { name: 'Velg by' })).toContainElement(
    screen.getByRole('radio', { name: 'Bergen' }),
  );
});

test('arrow navigation skips disabled radios, wraps, and leaves the group with Tab', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  function Cities() {
    const [city, setCity] = React.useState('Oslo');
    return (
      <>
        <RadioGroup
          name="city"
          label="Velg by"
          value={city}
          onChange={e => {
            onChange(e.target.value);
            setCity(e.target.value);
          }}
        >
          <Radio value="Oslo">Oslo</Radio>
          <Radio value="Bergen" disabled>
            Bergen
          </Radio>
          <Radio value="Voss">Voss</Radio>
        </RadioGroup>
        <button>Continue</button>
      </>
    );
  }
  render(<Cities />);
  const oslo = screen.getByRole('radio', { name: 'Oslo' });
  const voss = screen.getByRole('radio', { name: 'Voss' });
  await user.tab();
  expect(oslo).toHaveFocus();
  await user.keyboard('{ArrowRight}');
  expect(voss).toHaveFocus();
  expect(voss).toBeChecked();
  expect(oslo).not.toBeChecked();
  await user.keyboard('{ArrowDown}');
  expect(oslo).toHaveFocus();
  expect(oslo).toBeChecked();
  await user.keyboard('{ArrowLeft}');
  expect(voss).toHaveFocus();
  expect(voss).toBeChecked();
  expect(onChange.mock.calls).toEqual([['Voss'], ['Oslo'], ['Voss']]);
  await user.tab();
  expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
});

test('readOnly group prevents mouse and keyboard selection changes', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <RadioGroup
      name="city"
      label="Velg by"
      value="Oslo"
      onChange={onChange}
      readOnly
    >
      <Radio value="Oslo">Oslo</Radio>
      <Radio value="Bergen">Bergen</Radio>
    </RadioGroup>,
  );
  await user.click(screen.getByText('Bergen'));
  await user.keyboard(' ');
  expect(screen.getByRole('radio', { name: /Oslo/ })).toBeChecked();
  expect(screen.getByRole('radio', { name: /Bergen/ })).not.toBeChecked();
  expect(onChange).not.toHaveBeenCalled();
});

// Bug: Radio ignores disabled from RadioGroup context.
test.failing('disabled RadioGroup disables its Radio children', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn();
  render(
    <>
      <RadioGroup
        name="city"
        label="Velg by"
        value="Oslo"
        onChange={onChange}
        disabled
      >
        <Radio value="Oslo">Oslo</Radio>
        <Radio value="Bergen">Bergen</Radio>
      </RadioGroup>
      <button>Continue</button>
    </>,
  );
  await user.tab();
  expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  await user.click(screen.getByText('Bergen'));
  expect(screen.getByRole('radio', { name: 'Bergen' })).toBeDisabled();
  expect(onChange).not.toHaveBeenCalled();
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

test('readonly checked Radio is included in form submission', async () => {
  const user = userEvent.setup();
  const handleSubmit = jest.fn();

  const { getByRole } = render(
    <form
      onSubmit={e => {
        e.preventDefault();
        handleSubmit(Object.fromEntries(new FormData(e.currentTarget)));
      }}
    >
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

  await user.click(getByRole('button', { name: /send/i }));

  expect(handleSubmit).toHaveBeenCalledWith({
    city: 'Oslo',
  });
});
