import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import {
  getLocalTimeZone,
  now,
  parseAbsolute,
  parseDateTime,
  parseTime,
  Time,
  ZonedDateTime,
} from '@internationalized/date';
import { toHaveNoViolations, axe } from 'jest-axe';
import { TimePicker, nativeDateToTimeValue, timeValueToNativeDate } from '.';
// import { TimePicker, nativeDateToTimeValue } from '.';

expect.extend(toHaveNoViolations);

// Locale is added on all tests to ensure a static testing basis
// Time zone is set globally for Jest as UTC in ~/global-setup.js

test('renders a timepicker', () => {
  const spy = jest.fn();
  const currentTime = new Time(19, 1);
  const { queryByText } = render(
    <TimePicker
      label="TestLabel"
      selectedTime={currentTime}
      onChange={spy}
      locale="no-NB"
    />,
  );
  expect(queryByText('19')).toBeInTheDocument();
  expect(queryByText('01')).toBeInTheDocument();
  expect(queryByText('TestLabel')).toBeInTheDocument();
});

test('correct time zone is applied', () => {
  const spy = jest.fn();
  const currentTime =
    // should be 04:35 in Los Angeles
    new ZonedDateTime(2022, 8, 25, 'America/Los_Angeles', -28800, 11, 35);

  const { queryByText } = render(
    <TimePicker
      label="TestLabel"
      selectedTime={currentTime}
      onChange={spy}
      locale="no-NB"
    />,
  );
  expect(queryByText('04')).toBeInTheDocument();
  expect(queryByText('35')).toBeInTheDocument();
});

test('locale is respected', () => {
  const spy = jest.fn();
  const currentTime = new Time(20, 15);

  const { queryByText } = render(
    <TimePicker
      label="TestLabel"
      selectedTime={currentTime}
      onChange={spy}
      locale="en-US"
    />,
  );
  expect(queryByText('8')).toBeInTheDocument();
  expect(queryByText('15')).toBeInTheDocument();
  expect(queryByText('PM')).toBeInTheDocument();
});

test('adds default minutes on button click', () => {
  const spy = jest.fn();
  const currentTime = new Time(20, 15);

  const { container } = render(
    <TimePicker
      label="TestLabel"
      selectedTime={currentTime}
      onChange={spy}
      locale="no-NB"
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

test('adds custom minutes on button click', () => {
  const spy = jest.fn();
  const currentTime = new Time(20, 15);

  const { container } = render(
    <TimePicker
      label="TestLabel"
      selectedTime={currentTime}
      onChange={spy}
      minuteIncrementForArrowButtons={500}
      locale="no-NB"
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

  expect(newHour === 4).toBeTruthy();
  expect(newMinute === 35).toBeTruthy();
});

test('sets time to current time on button click when selected time is undefined', () => {
  const spy = jest.fn();
  const currentTime = now(getLocalTimeZone());

  const { container } = render(
    <TimePicker
      label="TestLabel"
      selectedTime={undefined}
      onChange={spy}
      minuteIncrementForArrowButtons={500}
      locale="no-NB"
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

  expect(newHour).toEqual(
    currentTime.minute >= 30 ? currentTime.hour + 1 : currentTime.hour,
  );
  expect(newMinute).toEqual(0);
});

test("Doesn't violate basic accessibility requirements", async () => {
  const spy = jest.fn();
  const currentTime = new Time(20, 15);
  const { container } = render(
    <TimePicker
      label="TestLabel"
      selectedTime={currentTime}
      onChange={spy}
      locale="no-NB"
    />,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Timezones should always be UTC', () => {
  expect(new Date().getTimezoneOffset()).toBe(0);
});

test('Util function correctly converts JS Date to TimeVale', () => {
  const dateObject = new Date(1997, 6, 10, 10, 0);
  const timeZone = 'America/Los_Angeles';
  const customOffset = -14400000;

  const dateWithTimeZoneAndOffset = nativeDateToTimeValue(
    dateObject,
    false,
    timeZone,
    customOffset,
  );
  const dateWithTimeZoneOnly = nativeDateToTimeValue(
    dateObject,
    false,
    timeZone,
  );
  const withTimeOnly = nativeDateToTimeValue(dateObject, true);
  const dateWithoutTimeZone = nativeDateToTimeValue(dateObject);

  expect(dateWithTimeZoneAndOffset.toString()).toEqual(
    '1997-07-10T10:00:00-04:00[America/Los_Angeles]',
  );
  expect(dateWithTimeZoneOnly.toString()).toEqual(
    '1997-07-10T03:00:00-07:00[America/Los_Angeles]',
  );
  expect(withTimeOnly.toString()).toEqual('10:00:00');
  expect(dateWithoutTimeZone.toString()).toEqual('1997-07-10T10:00:00');
});

test('util function correctly converts from any TimeValue to JS Date', () => {
  const dateString = '1997-07-10';
  const timeString = '10:00:00';
  const timeZone = 'America/Los_Angeles';

  const zonedDateTime = parseAbsolute(`${dateString}T${timeString}Z`, timeZone);
  const calendarDateTime = parseDateTime(
    `${dateString}T${timeString.substring(0, 5)}`,
  );
  const time = parseTime(timeString.substring(0, 5));

  expect(timeValueToNativeDate(zonedDateTime).toISOString()).toEqual(
    '1997-07-10T10:00:00.000Z',
  );
  expect(timeValueToNativeDate(calendarDateTime).toISOString()).toEqual(
    '1997-07-10T10:00:00.000Z',
  );
  expect(
    timeValueToNativeDate(calendarDateTime, timeZone).toISOString(),
  ).toEqual('1997-07-10T17:00:00.000Z');
  expect(timeValueToNativeDate(time).toLocaleTimeString()).toEqual(
    '10:00:00 AM',
  );

  // timeZone should not impact result for ZonedDateTime and Time
  expect(timeValueToNativeDate(zonedDateTime, timeZone).toISOString()).toEqual(
    '1997-07-10T10:00:00.000Z',
  );
  expect(timeValueToNativeDate(time, timeZone).toLocaleTimeString()).toEqual(
    '10:00:00 AM',
  );
});

test('util function converts from Date to TimeValue and back again correctly', () => {
  const dateObject = new Date(1997, 6, 10, 10, 0);
  const timeZone = 'America/Los_Angeles';

  expect(
    timeValueToNativeDate(nativeDateToTimeValue(dateObject, false, timeZone)),
  ).toEqual(dateObject);
  expect(timeValueToNativeDate(nativeDateToTimeValue(dateObject))).toEqual(
    dateObject,
  );
  expect(
    timeValueToNativeDate(
      nativeDateToTimeValue(dateObject, true),
    ).toLocaleTimeString(),
  ).toEqual(dateObject.toLocaleTimeString());
});
