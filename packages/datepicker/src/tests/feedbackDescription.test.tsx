import { render, screen } from '@testing-library/react';
import {
  CalendarDate,
  DatePicker,
  NativeDatePicker,
  NativeTimePicker,
  SimpleTimePicker,
  Time,
  TimePicker,
} from '..';

const feedback = { variant: 'negative', feedback: 'Choose a time' } as const;

test.each([
  [
    'NativeDatePicker',
    (props: object) => <NativeDatePicker label="Date" {...props} />,
  ],
  [
    'NativeTimePicker',
    (props: object) => <NativeTimePicker label="Date" {...props} />,
  ],
  [
    'SimpleTimePicker',
    (props: object) => (
      <SimpleTimePicker
        label="Date"
        selectedTime={new Time(12, 30)}
        onChange={() => undefined}
        {...props}
      />
    ),
  ],
])(
  '%s input is described by its feedback text while the feedback is shown',
  (_, renderField) => {
    const { rerender } = render(renderField(feedback));
    const input = screen.getByLabelText('Date');
    expect(input).toHaveAccessibleDescription(
      expect.stringContaining('Choose a time'),
    );

    rerender(renderField({}));
    expect(input).not.toHaveAccessibleDescription(
      expect.stringContaining('Choose a time'),
    );
  },
);

// react-aria describes only the first segment, so screen readers hear it once
test('DatePicker is described by the feedback text', () => {
  render(
    <DatePicker
      label="Date"
      selectedDate={new CalendarDate(2023, 9, 15)}
      onChange={() => undefined}
      locale="en-GB"
      {...feedback}
    />,
  );
  expect(screen.getAllByRole('spinbutton')[0]).toHaveAccessibleDescription(
    expect.stringContaining('Choose a time'),
  );
});

test('TimePicker segments keep the selected time and add the feedback text', () => {
  render(
    <TimePicker
      label="Time"
      selectedTime={new Time(12, 30)}
      onChange={() => undefined}
      {...feedback}
    />,
  );
  for (const segment of screen.getAllByRole('spinbutton')) {
    expect(segment).toHaveAccessibleDescription(
      'valgt tid: 12:30 Choose a time',
    );
  }
});

test('TimePicker segments keep a consumer aria-describedby', () => {
  render(
    <>
      <p id="time-hint">Departure from Oslo S</p>
      <TimePicker
        label="Time"
        selectedTime={new Time(12, 30)}
        onChange={() => undefined}
        aria-describedby="time-hint"
        {...feedback}
      />
    </>,
  );
  expect(screen.getAllByRole('spinbutton')[0]).toHaveAccessibleDescription(
    'Departure from Oslo S valgt tid: 12:30 Choose a time',
  );
});

test('DatePicker keeps the selected date description next to a consumer aria-describedby', () => {
  render(
    <>
      <p id="date-hint">Travel date</p>
      <DatePicker
        label="Date"
        selectedDate={new CalendarDate(2023, 9, 15)}
        onChange={() => undefined}
        locale="en-GB"
        aria-describedby="date-hint"
        {...feedback}
      />
    </>,
  );
  // react-aria's selected date, the consumer hint and the feedback text
  expect(screen.getAllByRole('spinbutton')[0]).toHaveAccessibleDescription(
    'Selected Date: September 15, 2023 Travel date Choose a time',
  );
});
