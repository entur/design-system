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

describe('DatePicker', () => {
  test('is rendered', () => {
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

    expect(getByRole('spinbutton', { name: 'year, test' })).toHaveTextContent(
      '1997',
    );
    expect(getByRole('spinbutton', { name: 'month, test' })).toHaveTextContent(
      '07',
    );
    expect(getByRole('spinbutton', { name: 'day, test' })).toHaveTextContent(
      '10',
    );
    expect(queryAllByLabelText('test')[0]).toBeInTheDocument();
    expect(openCalendarButton).toBeInTheDocument();
  });

  test('applies correct time zone', () => {
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

    expect(getByRole('spinbutton', { name: 'year, test' })).toHaveTextContent(
      '2022',
    );
    expect(getByRole('spinbutton', { name: 'month, test' })).toHaveTextContent(
      '08',
    );
    expect(getByRole('spinbutton', { name: 'day, test' })).toHaveTextContent(
      '25',
    );
    expect(getByRole('spinbutton', { name: 'hour, test' })).toHaveTextContent(
      '04',
    );
    expect(getByRole('spinbutton', { name: 'minute, test' })).toHaveTextContent(
      '35',
    );
  });

  test('applies correct locale', () => {
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
    expect(getByRole('spinbutton', { name: 'dag, dutch' })).toBeInTheDocument();
    expect(
      getByRole('spinbutton', { name: 'maand, dutch' }),
    ).toBeInTheDocument();
    expect(
      getByRole('spinbutton', { name: 'jaar, dutch' }),
    ).toBeInTheDocument();
  });

  test('sets focus to selected date on calendar button click', async () => {
    const user = userEvent.setup();
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

    await user.click(openCalendarButton);

    const selectedDateInCalendar = container.getElementsByClassName(
      'eds-datepicker__calendar__grid__cell--selected',
    )[0];
    expect(selectedDateInCalendar).toHaveFocus();
  });

  test('applies focus lock when popover calendar is active', async () => {
    const spy = jest.fn();
    const user = userEvent.setup();
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

    await user.click(openCalendarButton);

    await user.keyboard('{Tab}{Tab}{Tab}');

    const selectedDateInCalendar = container.getElementsByClassName(
      'eds-datepicker__calendar__grid__cell--selected',
    )[0];
    expect(selectedDateInCalendar).toHaveFocus();
  }, 10000);

  test('closes calendar popover on escape key', () => {
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

    fireEvent.keyDown(selectedDateInCalendar, {
      key: 'Escape',
      code: 'Escape',
    });
    expect(selectedDateInCalendar).not.toBeInTheDocument();
  });

  test("doesn't violate basic accessibility requirements", async () => {
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
});

test('Timezones should always be UTC', () => {
  expect(new Date().getTimezoneOffset()).toBe(0);
});
