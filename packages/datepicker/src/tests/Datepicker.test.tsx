import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Granularity } from '@react-types/datepicker';
import {
  CalendarDate,
  CalendarDateTime,
  parseAbsolute,
  parseDate,
  parseDateTime,
  toCalendarDate,
} from '@internationalized/date';
import { axe, toHaveNoViolations } from 'jest-axe';

import { DateField, DatePicker } from '../DatePicker';
import { ForcedReturnType } from '../shared/utils';

jest.mock('@floating-ui/react-dom', () => ({
  useFloating: jest.fn(() => {
    return {
      x: 0,
      y: 0,
      refs: {
        setReference: jest.fn(),
        setFloating: jest.fn(),
      },
      strategy: 'absolute',
      update: jest.fn(),
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
    // UTC 11:35 → 04:35 in Los Angeles (PDT, UTC-7)
    const currentDate = parseAbsolute(
      '2022-08-25T11:35:00Z',
      'America/Los_Angeles',
    );

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

  test('focuses the selected date and locks focus in the open calendar', async () => {
    const spy = jest.fn();
    const user = userEvent.setup();
    const currentDate = new CalendarDate(1997, 7, 10);

    render(
      <DatePicker
        label="test"
        selectedDate={currentDate}
        onChange={spy}
        locale="en-GB"
      />,
    );

    const openCalendarButton = screen.getByRole('button', {
      name: /calendar/i,
    });

    await user.click(openCalendarButton);

    const selectedDateInCalendar = screen.getByRole('button', {
      name: /^Thursday, 10 July 1997/,
    });
    expect(selectedDateInCalendar).toHaveFocus();
    await user.keyboard('{Tab}{Tab}{Tab}');

    expect(selectedDateInCalendar).toHaveFocus();
  }, 10000);

  test('opens calendar with the keyboard and closes it on Escape', async () => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentDate = new CalendarDate(1997, 7, 10);

    render(
      <DatePicker
        label="test"
        selectedDate={currentDate}
        onChange={spy}
        locale="en-GB"
      />,
    );

    await user.tab();
    await user.keyboard('{Alt>}{ArrowDown}{/Alt}');
    expect(screen.getByRole('grid')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
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

test('maxDate works correctly for edge values', () => {
  const spy = jest.fn();

  const maxDateValue = parseDate('1997-07-10');
  const edgeValueWithin = parseAbsolute('1997-07-10T23:59:59.999Z', 'Etc/UTC');
  const edgeValueOutside = parseAbsolute('1997-07-11T00:00:00.000Z', 'Etc/UTC');

  const { rerender } = render(
    <>
      <DatePicker
        label="pickerMaxDateNoTimeWithError"
        selectedDate={edgeValueWithin}
        onChange={spy}
        maxDate={maxDateValue}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateNoTimeWithError"
        selectedDate={edgeValueWithin}
        onChange={spy}
        maxDate={maxDateValue}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.queryAllByRole('status')[0]).not.toHaveTextContent(
    'Expected error',
  );
  expect(screen.queryAllByRole('status')[1]).not.toHaveTextContent(
    'Expected error',
  );

  rerender(
    <>
      <DatePicker
        label="pickerMaxDateNoTimeWithError"
        selectedDate={edgeValueOutside}
        onChange={spy}
        maxDate={maxDateValue}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateNoTimeWithError"
        selectedDate={edgeValueOutside}
        onChange={spy}
        maxDate={maxDateValue}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.getAllByRole('status')[0]).toHaveTextContent('Expected error');
  expect(screen.getAllByRole('status')[1]).toHaveTextContent('Expected error');
});

test('gives errors correctly using maxDate as CalendarDate', () => {
  const spy = jest.fn();
  const currentDate = parseDateTime('1997-07-10T23:59');

  const { rerender } = render(
    <>
      <DatePicker
        label="pickerMaxDateNoTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={toCalendarDate(currentDate).add({ days: -1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateNoTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={toCalendarDate(currentDate).add({ days: -1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.getAllByRole('status')[0]).toHaveTextContent('Expected error');
  expect(screen.getAllByRole('status')[1]).toHaveTextContent('Expected error');

  rerender(
    <>
      <DatePicker
        label="pickerMaxDateNoTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={toCalendarDate(currentDate)}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateNoTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={toCalendarDate(currentDate)}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.queryAllByRole('status')[0]).not.toHaveTextContent(
    'Expected error',
  );
  expect(screen.queryAllByRole('status')[1]).not.toHaveTextContent(
    'Expected error',
  );
});

test('gives errors correctly using maxDate as CalendarDateTime', () => {
  const spy = jest.fn();
  const currentDate = parseDateTime('1997-07-10T09:00');

  const { rerender } = render(
    <>
      <DatePicker
        label="pickerMaxDateWithTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={currentDate.add({ minutes: -1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateWithTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={currentDate.add({ minutes: -1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.getAllByRole('status')[0]).toHaveTextContent('Expected error');
  expect(screen.getAllByRole('status')[1]).toHaveTextContent('Expected error');

  rerender(
    <>
      <DatePicker
        label="pickerMaxDateWithTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={currentDate}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateWithTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        maxDate={currentDate}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.queryAllByRole('status')[0]).not.toHaveTextContent(
    'Expected error',
  );
  expect(screen.queryAllByRole('status')[1]).not.toHaveTextContent(
    'Expected error',
  );
});

test('gives errors correctly using minDate as CalendarDate', () => {
  const spy = jest.fn();
  const currentDate = parseDateTime('1997-07-10T09:00');

  const { rerender } = render(
    <>
      <DatePicker
        label="pickerMaxDateNoTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={toCalendarDate(currentDate).add({ days: 1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateNoTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={toCalendarDate(currentDate).add({ days: 1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.getAllByRole('status')[0]).toHaveTextContent('Expected error');
  expect(screen.getAllByRole('status')[1]).toHaveTextContent('Expected error');

  rerender(
    <>
      <DatePicker
        label="pickerMaxDateNoTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={toCalendarDate(currentDate)}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateNoTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={toCalendarDate(currentDate)}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.queryAllByRole('status')[0]).not.toHaveTextContent(
    'Expected error',
  );
  expect(screen.queryAllByRole('status')[1]).not.toHaveTextContent(
    'Expected error',
  );
});

test('gives errors correctly using minDate as CalendarDateTime', () => {
  const spy = jest.fn();
  const currentDate = parseDateTime('1997-07-10T09:00');

  const { rerender } = render(
    <>
      <DatePicker
        label="pickerMaxDateWithTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={currentDate.add({ minutes: 1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateWithTimeWithError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={currentDate.add({ minutes: 1 })}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.getAllByRole('status')[0]).toHaveTextContent('Expected error');
  expect(screen.getAllByRole('status')[1]).toHaveTextContent('Expected error');

  rerender(
    <>
      <DatePicker
        label="pickerMaxDateWithTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={currentDate}
        locale="no-NO"
        validationFeedback="Expected error"
      />
      <DateField
        label="fieldMaxDateWithTimeNoError"
        selectedDate={currentDate}
        onChange={spy}
        minDate={currentDate}
        locale="no-NO"
        validationFeedback="Expected error"
      />
    </>,
  );

  expect(screen.queryAllByRole('status')[0]).not.toHaveTextContent(
    'Expected error',
  );
  expect(screen.queryAllByRole('status')[1]).not.toHaveTextContent(
    'Expected error',
  );
});

test('shows selected granularity', () => {
  const spy = jest.fn();
  const currentDate = new CalendarDateTime(1997, 7, 10, 15, 30, 25);
  const { rerender } = render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
      granularity="second"
    />,
  );

  // Both year and second is shown in picker
  expect(
    screen.getByRole('spinbutton', { name: 'year, test' }),
  ).toHaveTextContent('1997');
  expect(
    screen.getByRole('spinbutton', { name: 'second, test' }),
  ).toHaveTextContent('25');

  rerender(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={spy}
      locale="en-GB"
    />,
  );

  // Second is not found in document anymore
  expect(
    screen.queryAllByRole('spinbutton', { name: 'second, test' }),
  ).toHaveLength(0);
});

test.each([
  { props: { granularity: undefined } },
  { props: { granularity: 'second' as Granularity } },
  { props: { granularity: 'month' as Granularity } },
])(
  'emits ZonedDateTime by default from calendar datepicker',
  async ({ props }) => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentDate = null;
    const { container } = render(
      <DatePicker
        label="test"
        selectedDate={currentDate}
        onChange={spy}
        locale="en-GB"
        granularity={props.granularity}
      />,
    );

    const openCalendarButton = container.getElementsByClassName(
      'eds-datepicker__open-calendar-button',
    )[0];
    await user.click(openCalendarButton);

    const todaysDateButton = container.getElementsByClassName(
      'eds-datepicker__calendar__grid__cell--today',
    )[0];
    await user.click(todaysDateButton);

    const emittedDefaultDateCalendarWithGranularity = spy.mock.calls[0][0];
    expect(emittedDefaultDateCalendarWithGranularity).toHaveProperty(
      'timeZone',
    );
  },
);

test.each([
  { props: { granularity: undefined } },
  { props: { granularity: 'second' as Granularity } },
  { props: { granularity: 'month' as Granularity } },
])(
  'emits ZonedDateTime by default from datefield datepicker',
  async ({ props }) => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentDate = null;

    render(
      <DatePicker
        label="test"
        selectedDate={currentDate}
        onChange={spy}
        locale="en-GB"
        granularity={props.granularity}
      />,
    );

    const dateFields = screen.getAllByRole('spinbutton');
    for (const field of dateFields) {
      field.focus();
      await user.keyboard('{ArrowUp}');
    }

    const emittedDefaultDateCalendarWithGranularity = spy.mock.calls[0][0];
    expect(emittedDefaultDateCalendarWithGranularity).toHaveProperty(
      'timeZone',
    );
  },
);

test.each([
  {
    props: { forcedReturnType: 'CalendarDate' as ForcedReturnType },
    result: { notHave: 'hour' },
  },
  {
    props: { forcedReturnType: 'CalendarDateTime' as ForcedReturnType },
    result: { notHave: 'timeZone' },
  },
])(
  'emits correct DateType based on forcedReturnType from datefield and calendar in datepicker',
  async ({ props, result }) => {
    const user = userEvent.setup();
    const spy = jest.fn();
    const currentDate = null;

    const { container } = render(
      <DatePicker
        label="test"
        selectedDate={currentDate}
        onChange={spy}
        locale="en-GB"
        forcedReturnType={props.forcedReturnType}
      />,
    );

    const dateFields = screen.getAllByRole('spinbutton');
    for (const field of dateFields) {
      field.focus();
      await user.keyboard('{ArrowUp}');
    }

    const emittedDateValueFromDateField = spy.mock.calls[0][0];
    expect(emittedDateValueFromDateField).not.toHaveProperty(result.notHave);

    const openCalendarButton = container.getElementsByClassName(
      'eds-datepicker__open-calendar-button',
    )[0];
    await user.click(openCalendarButton);

    const todaysDateButton = container.getElementsByClassName(
      'eds-datepicker__calendar__grid__cell--today',
    )[0];
    await user.click(todaysDateButton);

    const emittedDateValueFromCalendar = spy.mock.calls[1][0];
    expect(emittedDateValueFromCalendar).not.toHaveProperty(result.notHave);
  },
);

test('preserves non-default timezone when forcedReturnType is ZonedDateTime', async () => {
  const user = userEvent.setup();
  const spy = jest.fn();
  const helsinkiDate = parseAbsolute('2024-06-15T12:00:00Z', 'Europe/Helsinki');

  render(
    <DatePicker
      label="test"
      selectedDate={helsinkiDate}
      onChange={spy}
      locale="en-GB"
      forcedReturnType={'ZonedDateTime' as ForcedReturnType}
    />,
  );

  const dateFields = screen.getAllByRole('spinbutton');
  dateFields[0].focus();
  await user.keyboard('{ArrowUp}');

  const emittedValue = spy.mock.calls[0][0];
  expect(emittedValue).toHaveProperty('timeZone', 'Europe/Helsinki');
});

test('onValidate fires on invalid date', async () => {
  const spy = jest.fn();
  const currentDate = new CalendarDate(1997, 7, 10);
  const minValidDate = new CalendarDate(1997, 7, 11);

  render(
    <DatePicker
      label="test"
      selectedDate={currentDate}
      onChange={() => undefined}
      minDate={minValidDate}
      onValidate={spy}
      locale="en-GB"
    />,
  );

  const emittedValidationState = spy.mock.calls[0][0];
  expect(emittedValidationState).toBeFalsy();
}, 10000);

describe('ARIA roles on feedback text', () => {
  test.each(['negative', 'error', 'warning', 'information', 'info', 'success'])(
    'applies role="status" by default for %s variant (polite announcement)',
    variant => {
      const currentDate = new CalendarDate(1997, 7, 10);
      const { container } = render(
        <DateField
          label="test"
          selectedDate={currentDate}
          onChange={() => undefined}
          feedback="Dette er en melding"
          variant={variant as any}
          locale="en-GB"
        />,
      );

      const feedbackElement = container.querySelector('.eds-feedback-text');
      expect(feedbackElement).toHaveAttribute('role', 'status');
    },
  );

  test('applies role="alert" when ariaAlertOnFeedback="alert"', () => {
    const currentDate = new CalendarDate(1997, 7, 10);
    const { container } = render(
      <DateField
        label="test"
        selectedDate={currentDate}
        onChange={() => undefined}
        feedback="Dette er en feilmelding"
        variant="negative"
        ariaAlertOnFeedback="alert"
        locale="en-GB"
      />,
    );

    const feedbackElement = container.querySelector('.eds-feedback-text');
    expect(feedbackElement).toHaveAttribute('role', 'alert');
  });
});

test('DateField clamps a leap day on blur after changing year and clears through the keyboard', async () => {
  const user = userEvent.setup();
  const onChange = jest.fn<void, [CalendarDate | null]>();
  function Consumer() {
    const [date, setDate] = React.useState<CalendarDate | null>(
      new CalendarDate(2024, 2, 29),
    );
    return (
      <DateField
        label="Departure"
        selectedDate={date}
        locale="en-GB"
        onChange={value => {
          onChange(value);
          setDate(value);
        }}
      />
    );
  }
  render(<Consumer />);
  await user.click(screen.getByRole('spinbutton', { name: 'year, Departure' }));
  await user.keyboard('{ArrowUp}');
  await user.tab();
  expect(onChange).toHaveBeenLastCalledWith(new CalendarDate(2025, 2, 28));
  expect(
    screen.getByRole('spinbutton', { name: 'day, Departure' }),
  ).toHaveTextContent('28');
  await user.click(screen.getByRole('spinbutton', { name: 'year, Departure' }));
  await user.keyboard(
    '{Backspace>4/}{ArrowLeft}{Backspace>2/}{ArrowLeft}{Backspace>2/}',
  );
  expect(onChange).toHaveBeenLastCalledWith(null);
});

// Bug: useDatePickerGroup opens on Alt+ArrowDown without checking disabled/readOnly.
test.failing.each(['disabled', 'readOnly'] as const)(
  'DatePicker %s prevents editing and opening the calendar',
  async mode => {
    const user = userEvent.setup();
    const onChange = jest.fn<void, [CalendarDate | null]>();
    render(
      <DatePicker
        label="Departure"
        selectedDate={new CalendarDate(2024, 2, 29)}
        onChange={onChange}
        locale="en-GB"
        {...{ [mode]: true }}
      />,
    );
    expect(
      screen.queryByRole('button', { name: /calendar/i }),
    ).not.toBeInTheDocument();
    await user.click(screen.getByText('29'));
    await user.keyboard('{ArrowUp}{Delete}{Alt>}{ArrowDown}{/Alt}');
    expect(screen.queryByRole('grid')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
  },
);
