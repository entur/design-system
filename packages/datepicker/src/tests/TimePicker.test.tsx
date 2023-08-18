import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  getLocalTimeZone,
  now,
  Time,
  ZonedDateTime,
} from '@internationalized/date';
import { toHaveNoViolations, axe } from 'jest-axe';
import { TimePicker } from '../TimePicker';

expect.extend(toHaveNoViolations);

// Locale is added on all tests to ensure a static testing basis
// Time zone is set globally for Jest as UTC in ~/global-setup.js

/* For some reason, locale='no-NO' does not change the aria-label language in jest tests. This works outside jest 
   and for other locals than no-NO in jest. Tests should be updated to use locale no-NO if the reason for this is solved.
   In the mean time, locale="en-GB" is used, as this one is correctly applied and ensures stability no mater where the
   test is run */

describe('TimePicker', () => {
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
    const currentTime =
      // should be 04:35 in Los Angeles
      new ZonedDateTime(2022, 8, 25, 'America/Los_Angeles', -28800, 11, 35);

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

  test('adds default minutes on add time button click', () => {
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

    const addTimeButton = container.getElementsByClassName(
      'eds-timepicker__arrowbutton--right',
    )[0];
    fireEvent(
      addTimeButton,
      new MouseEvent('click', {
        bubbles: true,
      }),
    );

    const clickResult = spy.mock.calls;
    const newHour = clickResult[0][0].hour;
    const newMinute = clickResult[0][0].minute;

    expect(newHour === 20).toBeTruthy();
    expect(newMinute === 45).toBeTruthy();
  });

  test('adds custom minutes on add time button click', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentTime = new Time(20, 15);

    const { container } = render(
      <TimePicker
        label="test"
        selectedTime={currentTime}
        onChange={spy}
        minuteIncrementForArrowButtons={500}
        locale="en-GB"
      />,
    );

    const addTimeButton = container.getElementsByClassName(
      'eds-timepicker__arrowbutton--right',
    )[0];
    await user.click(addTimeButton);

    const clickResult = spy.mock.calls;
    const newHour = clickResult[0][0].hour;
    const newMinute = clickResult[0][0].minute;

    expect(newHour === 4).toBeTruthy();
    expect(newMinute === 35).toBeTruthy();
  });

  test('sets time to current time on add time button click when selected time is undefined', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentTime = now(getLocalTimeZone());
    const minuteIncrement = 15;

    const { container } = render(
      <TimePicker
        label="test"
        selectedTime={null}
        onChange={spy}
        minuteIncrementForArrowButtons={minuteIncrement}
        locale="en-GB"
      />,
    );

    const addTimeButton = container.getElementsByClassName(
      'eds-timepicker__arrowbutton--right',
    )[0];
    await user.click(addTimeButton);

    const clickResult = spy.mock.calls;
    const newHour = clickResult[0][0].hour;
    const newMinute = clickResult[0][0].minute;

    expect(newHour).toEqual(currentTime.hour);
    expect(newMinute).toEqual(
      Math.floor(currentTime.minute / minuteIncrement) * minuteIncrement,
    );
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
});

test('Timezones should always be UTC', () => {
  expect(new Date().getTimezoneOffset()).toBe(0);
});
