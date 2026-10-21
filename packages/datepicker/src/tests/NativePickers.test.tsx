import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NativeDatePicker } from '../DatePicker';
import { NativeTimePicker } from '../TimePicker';

describe.each([
  {
    name: 'NativeDatePicker',
    Picker: NativeDatePicker,
    initial: '2024-02-28',
    next: '2024-02-29',
    min: '2024-02-01',
    max: '2024-02-29',
    outside: '2024-03-01',
  },
  {
    name: 'NativeTimePicker',
    Picker: NativeTimePicker,
    initial: '09:30',
    next: '10:15',
    min: '09:00',
    max: '17:00',
    outside: '17:01',
  },
])('$name', ({ Picker, initial, next, min, max, outside }) => {
  test('updates a controlled value and clears the submitted value', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn<void, [string]>();
    const ref = React.createRef<HTMLInputElement>();
    function Consumer() {
      const [value, setValue] = React.useState(initial);
      return (
        <form aria-label="Booking">
          <Picker
            ref={ref}
            label="Departure"
            name="departure"
            value={value}
            onChange={event => {
              onChange(event.currentTarget.value);
              setValue(event.currentTarget.value);
            }}
          />
        </form>
      );
    }
    render(<Consumer />);
    const input = screen.getByLabelText('Departure');
    expect(ref.current).toBe(input);
    await user.tab();
    expect(input).toHaveFocus();
    // jsdom has no native picker UI; dispatch the browser's change event.
    fireEvent.change(input, { target: { value: next } });
    expect(onChange).toHaveBeenLastCalledWith(next);
    expect(input).toHaveValue(next);
    expect(new FormData(ref.current!.form!).get('departure')).toBe(next);

    await user.clear(input);
    expect(onChange).toHaveBeenLastCalledWith('');
    expect(input).toHaveValue('');
    expect(new FormData(ref.current!.form!).get('departure')).toBe('');
  });

  test('enforces inclusive native bounds and required validity', () => {
    render(<Picker label="Departure" min={min} max={max} required />);
    const input = screen.getByLabelText('Departure');
    expect(input).toBeInvalid();
    for (const value of [min, max]) {
      fireEvent.change(input, { target: { value } });
      expect(input).toBeValid();
    }
    fireEvent.change(input, { target: { value: outside } });
    expect(input).toBeInvalid();
  });

  test('skips disabled input but keeps readOnly input keyboard accessible', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <>
        <Picker
          label="Disabled"
          defaultValue={initial}
          disabled
          onChange={onChange}
        />
        <Picker
          label="Read only"
          defaultValue={initial}
          readOnly
          onChange={onChange}
        />
        <button>Continue</button>
      </>,
    );
    const disabled = screen.getByLabelText('Disabled');
    const readOnly = screen.getByLabelText('Read only');
    expect(disabled).toBeDisabled();
    expect(readOnly).toHaveAttribute('readonly');
    await user.click(disabled);
    expect(disabled).not.toHaveFocus();
    await user.tab();
    expect(readOnly).toHaveFocus();
    await user.keyboard('{Backspace}{Delete}');
    expect(readOnly).toHaveValue(initial);
    expect(onChange).not.toHaveBeenCalled();
    await user.tab();
    expect(screen.getByRole('button', { name: 'Continue' })).toHaveFocus();
  });
});
