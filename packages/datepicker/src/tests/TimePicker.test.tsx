import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Time, ZonedDateTime, parseAbsolute } from '@internationalized/date';
import { axe, toHaveNoViolations } from 'jest-axe';
import { SimpleTimePicker, TimePicker } from '../TimePicker';

expect.extend(toHaveNoViolations);

// Locale is added on all tests to ensure a static testing basis
// Time zone is set globally for Jest as UTC in ~/global-setup.js

/* For some reason, locale='no-NO' does not change the aria-label language in jest tests. This works outside jest 
   and for other locals than no-NO in jest. Tests should be updated to use locale no-NO if the reason for this is solved.
   In the mean time, locale="en-GB" is used, as this one is correctly applied and ensures stability no mater where the
   test is run */

describe('TimePicker', () => {
  afterEach(() => jest.restoreAllMocks());

  test('is rendered', () => {
    const spy = jest.fn();
    const currentTime = new Time(19, 1);
    const { getByRole, queryAllByLabelText } = render(
      <TimePicker
        label="test"
        selectedTime={currentTime}
        onChange={spy}
        locale="en-GB"
      />,
    );

    expect(getByRole('spinbutton', { name: 'hour, test' })).toHaveTextContent(
      '19',
    );
    expect(getByRole('spinbutton', { name: 'minute, test' })).toHaveTextContent(
      '01',
    );
    expect(queryAllByLabelText('test')[0]).toBeInTheDocument();
  });

  test('applies time zone correctly', () => {
    const spy = jest.fn();
    // UTC 11:35 → 04:35 in Los Angeles (PDT, UTC-7)
    const currentTime = parseAbsolute(
      '2022-08-25T11:35:00Z',
      'America/Los_Angeles',
    );

    const { getByRole } = render(
      <TimePicker
        label="test"
        selectedTime={currentTime}
        onChange={spy}
        locale="en-GB"
      />,
    );

    expect(getByRole('spinbutton', { name: 'hour, test' })).toHaveTextContent(
      '04',
    );
    expect(getByRole('spinbutton', { name: 'minute, test' })).toHaveTextContent(
      '35',
    );
  });

  test('applies locale correctly', () => {
    const spy = jest.fn();
    const currentTime = new Time(20, 15);

    const { getByRole } = render(
      <TimePicker
        label="test"
        selectedTime={currentTime}
        onChange={spy}
        locale="en-US"
      />,
    );
    expect(getByRole('spinbutton', { name: 'hour, test' })).toHaveTextContent(
      '8',
    );
    expect(getByRole('spinbutton', { name: 'minute, test' })).toHaveTextContent(
      '15',
    );
    expect(getByRole('spinbutton', { name: 'AM/PM, test' })).toHaveTextContent(
      'PM',
    );
  });

  test('adds default minutes on add time button click', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentTime = new Time(20, 15);

    render(
      <TimePicker
        label="test"
        selectedTime={currentTime}
        onChange={spy}
        locale="en-GB"
      />,
    );

    const addTimeButton = screen.getByRole('button', {
      name: 'Legg til 30 minutter',
    });
    await user.click(addTimeButton);

    const clickResult = spy.mock.calls;
    const newHour = clickResult[0][0].hour;
    const newMinute = clickResult[0][0].minute;

    expect(newHour).toEqual(20);
    expect(newMinute).toEqual(30);
  });

  test('adds custom minutes on add time button click', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentTime = new Time(20, 15);

    render(
      <TimePicker
        label="test"
        selectedTime={currentTime}
        onChange={spy}
        minuteIncrementForArrowButtons={60 * 8}
        locale="en-GB"
      />,
    );

    const addTimeButton = screen.getByRole('button', {
      name: 'Legg til 480 minutter',
    });
    await user.click(addTimeButton);

    const clickResult = spy.mock.calls;
    const newHour = clickResult[0][0].hour;
    const newMinute = clickResult[0][0].minute;

    expect(newHour).toEqual(4);
    expect(newMinute).toEqual(0);
  });

  test('sets time to current time on add time button click when selected time is null', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    jest.spyOn(Date, 'now').mockReturnValue(Date.parse('2024-02-29T12:34:00Z'));
    const currentTime = parseAbsolute('2024-02-29T12:34:00Z', 'Europe/Oslo');
    const minuteIncrement = 15;

    render(
      <TimePicker
        label="test"
        selectedTime={null}
        onChange={spy}
        minuteIncrementForArrowButtons={minuteIncrement}
        locale="en-GB"
      />,
    );

    const addTimeButton = screen.getByRole('button', {
      name: 'Legg til 15 minutter',
    });
    await user.click(addTimeButton);

    const clickResult = spy.mock.calls;
    const newHour = clickResult[0][0].hour;
    const newMinute = clickResult[0][0].minute;

    expect(newHour).toEqual(currentTime.hour);
    expect(newMinute).toEqual(currentTime.minute);
  });

  test("doesn't violate basic accessibility requirements", async () => {
    const spy = jest.fn();
    const currentTime = new Time(20, 15);
    const { container } = render(
      <TimePicker
        label="test"
        selectedTime={currentTime}
        onChange={spy}
        locale="en-GB"
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('subtracts across midnight and accepts keyboard minute wrapping', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn<void, [Time | null]>();
    function Consumer() {
      const [time, setTime] = React.useState<Time | null>(new Time(0, 0));
      return (
        <TimePicker
          label="Departure"
          selectedTime={time}
          onChange={value => {
            onChange(value);
            setTime(value);
          }}
          locale="en-GB"
          forcedReturnType="Time"
        />
      );
    }
    render(<Consumer />);
    await user.click(
      screen.getByRole('button', { name: 'Trekk fra 30 minutter' }),
    );
    expect(onChange).toHaveBeenLastCalledWith(new Time(23, 30));
    const minute = screen.getByRole('spinbutton', {
      name: 'minute, Departure',
    });
    await user.click(minute);
    await user.keyboard('{End}{ArrowUp}');
    expect(onChange).toHaveBeenLastCalledWith(new Time(23, 0));
    expect(minute).toHaveTextContent('00');
    await user.keyboard('{Backspace}');
    await user.keyboard('{ArrowLeft}{Backspace}{Backspace}');
    expect(onChange).toHaveBeenLastCalledWith(null);
  });

  test.each(['disabled', 'readOnly'] as const)(
    '%s prevents mouse and keyboard changes',
    async mode => {
      const user = userEvent.setup();
      const onChange = jest.fn<void, [Time | null]>();
      render(
        <TimePicker
          label="Departure"
          selectedTime={new Time(12, 30)}
          onChange={onChange}
          locale="en-GB"
          {...{ [mode]: true }}
        />,
      );
      for (const button of screen.getAllByRole('button')) {
        expect(button).toBeDisabled();
        await user.click(button);
      }
      await user.click(screen.getByText('12'));
      await user.keyboard('{ArrowUp}{Delete}');
      expect(screen.getByText('12')).toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    },
  );
});

describe('SimpleTimePicker', () => {
  test('handles all allowed string inputs', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const initialTime = new Time(20, 15);

    render(
      <SimpleTimePicker
        label="test"
        selectedTime={initialTime}
        onChange={spy}
      />,
    );

    const inputField = screen.getByDisplayValue('20:15');
    await user.click(inputField);
    await user.clear(inputField);
    await user.keyboard('{Enter}');
    const onChangeCallValue0 = spy.mock.calls[0][0];

    await user.type(inputField, '945');
    await user.keyboard('{Enter}');
    const onChangeCallValue1 = spy.mock.calls[1][0];

    await user.clear(inputField);
    await user.type(inputField, '0945');
    await user.keyboard('{Enter}');
    const onChangeCallValue2 = spy.mock.calls[2][0];

    await user.clear(inputField);
    await user.type(inputField, '9:45');
    await user.keyboard('{Enter}');
    const onChangeCallValue3 = spy.mock.calls[3][0];

    await user.clear(inputField);
    await user.type(inputField, '09:45');
    await user.keyboard('{Enter}');
    const onChangeCallValue4 = spy.mock.calls[4][0];

    await user.clear(inputField);
    await user.type(inputField, '94500');
    await user.keyboard('{Enter}');
    const onChangeCallValue5 = spy.mock.calls[5][0];

    await user.clear(inputField);
    await user.type(inputField, '094500');
    await user.keyboard('{Enter}');
    const onChangeCallValue6 = spy.mock.calls[6][0];

    await user.clear(inputField);
    await user.type(inputField, '9:45:00');
    await user.keyboard('{Enter}');
    const onChangeCallValue7 = spy.mock.calls[7][0];

    await user.clear(inputField);
    await user.type(inputField, '09:45:00');
    await user.keyboard('{Enter}');
    const onChangeCallValue8 = spy.mock.calls[8][0];

    expect(onChangeCallValue0).toEqual(null);
    expect(onChangeCallValue1).toEqual(new Time(9, 45));
    expect(onChangeCallValue2).toEqual(new Time(9, 45));
    expect(onChangeCallValue3).toEqual(new Time(9, 45));
    expect(onChangeCallValue4).toEqual(new Time(9, 45));
    expect(onChangeCallValue5).toEqual(new Time(9, 45));
    expect(onChangeCallValue6).toEqual(new Time(9, 45));
    expect(onChangeCallValue7).toEqual(new Time(9, 45));
    expect(onChangeCallValue8).toEqual(new Time(9, 45));
  });

  test.each(['invalid', '24:00', '12:60', '12:30:60'])(
    'restores the selected time for invalid input %s',
    async input => {
      const user = userEvent.setup();
      const spy = jest.fn();
      const initialTime = new Time(20, 15);

      render(
        <SimpleTimePicker
          label="test"
          selectedTime={initialTime}
          onChange={spy}
        />,
      );

      const inputField = screen.getByLabelText('test');
      await user.clear(inputField);
      await user.type(inputField, input);
      await user.keyboard('{Enter}');
      const numberOfOnChangeCalls = spy.mock.calls.length;

      expect(numberOfOnChangeCalls).toBe(0);
      expect(inputField).toHaveValue('20:15');
    },
  );

  test('does not fire onChange on unchanged value', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const initialTime = new Time(20, 15);

    render(
      <SimpleTimePicker
        label="test"
        selectedTime={initialTime}
        onChange={spy}
      />,
    );

    const inputField = screen.getByDisplayValue('20:15');
    await user.clear(inputField);
    await user.type(inputField, '20:15');
    await user.keyboard('{Enter}');
    const numberOfOnChangeCalls = spy.mock.calls.length;

    expect(numberOfOnChangeCalls).toBe(0);
  });

  test('commits seconds on blur while retaining date and timezone after clearing', async () => {
    const user = userEvent.setup();
    const initial = parseAbsolute('2024-02-29T12:30:45Z', 'Europe/Oslo');
    const onChange = jest.fn<void, [ZonedDateTime | null]>();
    function Consumer() {
      const [time, setTime] = React.useState<ZonedDateTime | null>(initial);
      return (
        <SimpleTimePicker
          label="Departure"
          selectedTime={time}
          showSeconds
          onChange={value => {
            onChange(value);
            setTime(value);
          }}
        />
      );
    }
    render(<Consumer />);
    const input = screen.getByLabelText('Departure');
    expect(input).toHaveValue('13:30:45');
    await user.clear(input);
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(null);
    await user.click(input);
    expect(input).toHaveValue('');
    await user.type(input, '094512');
    expect(onChange).toHaveBeenCalledTimes(1);
    await user.tab();
    expect(onChange).toHaveBeenLastCalledWith(
      initial.set({ hour: 9, minute: 45, second: 12 }),
    );
    expect(input).toHaveValue('09:45:12');
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  test.each(['disabled', 'readOnly'] as const)(
    '%s prevents editing and commits',
    async mode => {
      const user = userEvent.setup();
      const onChange = jest.fn<void, [Time | null]>();
      render(
        <SimpleTimePicker
          label="Departure"
          selectedTime={new Time(12, 30)}
          onChange={onChange}
          {...{ [mode]: true }}
        />,
      );
      const input = screen.getByLabelText('Departure');
      await user.click(input);
      await user.keyboard('0945{Enter}');
      await user.tab();
      expect(input).toHaveValue('12:30');
      expect(onChange).not.toHaveBeenCalled();
    },
  );

  // Bug: SimpleTimePicker spreads useTimeField's role="group" onto its text input.
  test.failing('exposes the editable input as a labelled textbox', () => {
    render(
      <SimpleTimePicker label="Departure" selectedTime={new Time(12, 30)} />,
    );
    expect(
      screen.getByRole('textbox', { name: 'Departure' }),
    ).toBeInTheDocument();
  });
});
