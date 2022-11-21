import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarDate, ZonedDateTime } from '@internationalized/date';
import { toHaveNoViolations, axe } from 'jest-axe';
import { DatePicker } from '.';
jest.mock('@floating-ui/react-dom', () => ({
  useFloating: jest.fn(() => {
    return {
      x: 0,
      y: 0,
      reference: jest.fn(),
      floating: jest.fn(),
      strategy: 'absolute',
    };
  }),
  offset: jest.fn(),
  flip: jest.fn(),
  shift: jest.fn(),
}));

expect.extend(toHaveNoViolations);

// Locale is added on all tests to ensure a static testing basis
// Time zone is set globally for Jest as UTC in ~/global-setup.js

/* For some reason, locale='no-NO' does not change the aria-label language in jest tests. This works outside jest 
   and for other locals than no-NO in jest. Tests should be updated to use locale no-NO if the reason for this is solved.
   In the mean time, locale="en-GB" is used, as this one is correctly applied and ensures stability no mater where the
   test is run */

test('renders a DatePicker', () => {
  const spy = jest.fn();
  const currentDate = new CalendarDate(1997, 7, 10);
  const { container, getByRole, queryAllByLabelText } = render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
    />,
  );

  const openCalendarButton = container.getElementsByClassName(
    'eds-datepicker__open-calendar-button',
  )[0];

  expect(getByRole('spinbutton', { name: 'test year' })).toHaveTextContent(
    '1997',
  );
  expect(getByRole('spinbutton', { name: 'test month' })).toHaveTextContent(
    '07',
  );
  expect(getByRole('spinbutton', { name: 'test day' })).toHaveTextContent('10');
  expect(queryAllByLabelText('test')[0]).toBeInTheDocument();
  expect(openCalendarButton).toBeInTheDocument();
});

test('correct time zone is applied', () => {
  const spy = jest.fn();
  const currentDate =
    // should be 04:35 in Los Angeles
    new ZonedDateTime(2022, 8, 25, 'America/Los_Angeles', -28800, 11, 35);

  const { getByRole } = render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
      showTime
    />,
  );

  expect(getByRole('spinbutton', { name: 'test year' })).toHaveTextContent(
    '2022',
  );
  expect(getByRole('spinbutton', { name: 'test month' })).toHaveTextContent(
    '08',
  );
  expect(getByRole('spinbutton', { name: 'test day' })).toHaveTextContent('25');
  expect(getByRole('spinbutton', { name: 'test hour' })).toHaveTextContent(
    '04',
  );
  expect(getByRole('spinbutton', { name: 'test minute' })).toHaveTextContent(
    '35',
  );
});

test('locale is respected', () => {
  const spy = jest.fn();
  const currentDate = new CalendarDate(1997, 7, 10);

  const { getByRole } = render(
    <DatePicker
      label="dutch"
      selectedDate={currentDate}
      onChange={spy}
      locale="nl-NL"
    />,
  );
  expect(getByRole('spinbutton', { name: 'dutch dag' })).toBeInTheDocument();
  expect(getByRole('spinbutton', { name: 'dutch maand' })).toBeInTheDocument();
  expect(getByRole('spinbutton', { name: 'dutch jaar' })).toBeInTheDocument();
});

test('Focus is set to selected date on calendar button click', () => {
  const spy = jest.fn();
  const currentDate = new CalendarDate(1997, 7, 10);

  const { container } = render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
    />,
  );

  const openCalendarButton = container.getElementsByClassName(
    'eds-datepicker__open-calendar-button',
  )[0];

  fireEvent(
    openCalendarButton,
    new MouseEvent('click', {
      bubbles: true,
    }),
  );

  const selectedDateInCalendar = container.getElementsByClassName(
    'eds-datepicker__calendar__grid__cell--selected',
  )[0];
  expect(selectedDateInCalendar).toHaveFocus();
});

test('Focus lock is working on popover calendar', async () => {
  const spy = jest.fn();
  const currentDate = new CalendarDate(1997, 7, 10);

  const { container } = render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
    />,
  );

  const openCalendarButton = container.getElementsByClassName(
    'eds-datepicker__open-calendar-button',
  )[0];

  fireEvent(
    openCalendarButton,
    new MouseEvent('click', {
      bubbles: true,
    }),
  );

  await userEvent.tab();
  await userEvent.tab();
  await userEvent.tab();

  const selectedDateInCalendar = container.getElementsByClassName(
    'eds-datepicker__calendar__grid__cell--selected',
  )[0];
  expect(selectedDateInCalendar).toHaveFocus();
});

test('Escape closes calendar popover', () => {
  const spy = jest.fn();
  const currentDate = new CalendarDate(1997, 7, 10);

  const { container } = render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
    />,
  );

  const openCalendarButton = container.getElementsByClassName(
    'eds-datepicker__open-calendar-button',
  )[0];

  fireEvent(
    openCalendarButton,
    new MouseEvent('click', {
      bubbles: true,
    }),
  );

  const selectedDateInCalendar = container.getElementsByClassName(
    'eds-datepicker__calendar__grid__cell--selected',
  )[0];

  fireEvent.keyDown(selectedDateInCalendar, { key: 'Escape', code: 'Escape' });
  expect(selectedDateInCalendar).not.toBeInTheDocument();
});

test("Doesn't violate basic accessibility requirements", async () => {
  const spy = jest.fn();
  const currentDate = new CalendarDate(1997, 7, 10);
  const { container } = render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
    />,
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Timezones should always be UTC', () => {
  expect(new Date().getTimezoneOffset()).toBe(0);
});
