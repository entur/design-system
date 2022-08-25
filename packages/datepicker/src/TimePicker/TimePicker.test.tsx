import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { Time, ZonedDateTime } from '@internationalized/date';
import { toHaveNoViolations, axe } from 'jest-axe';
import { TimePicker } from '.';

expect.extend(toHaveNoViolations);

// Locale is added on all tests to ensure a static testing basis

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
