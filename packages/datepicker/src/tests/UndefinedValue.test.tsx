import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarDate } from '@internationalized/date';
import { Calendar, DateField, DatePicker, RangeCalendar } from '../DatePicker';
import { SimpleTimePicker, TimePicker } from '../TimePicker';
import { handleOnChange } from '../shared/utils';

describe('undefined value props', () => {
  test('shared handleOnChange with undefined selectedDate', () => {
    const spy = jest.fn();
    expect(() =>
      handleOnChange({
        value: new CalendarDate(2026, 8, 4),
        selectedDate: undefined as any,
        forcedReturnType: undefined,
        onChange: spy,
      }),
    ).not.toThrow();
    expect(spy).toHaveBeenCalled();
  });

  test.each([
    ['TimePicker', TimePicker],
    ['SimpleTimePicker', SimpleTimePicker],
  ])('%s renders with undefined selectedTime', (_name, Component: any) => {
    expect(() =>
      render(
        <Component
          label="test"
          selectedTime={undefined as any}
          onChange={jest.fn()}
          locale="en-GB"
        />,
      ),
    ).not.toThrow();
  });

  test.each([
    ['DatePicker', DatePicker],
    ['DateField', DateField],
    ['Calendar', Calendar],
  ])('%s renders with undefined selectedDate', (_name, Component: any) => {
    expect(() =>
      render(
        <Component
          label="test"
          selectedDate={undefined as any}
          onChange={jest.fn()}
          locale="en-GB"
        />,
      ),
    ).not.toThrow();
  });

  test('DateField with undefined selectedDate fires onChange on full date', async () => {
    const spy = jest.fn();
    render(
      <DateField
        label="test"
        selectedDate={undefined as any}
        onChange={spy}
        locale="en-GB"
      />,
    );
    await userEvent.click(screen.getByRole('spinbutton', { name: /day/ }));
    await userEvent.keyboard('04082026');
    expect(spy).toHaveBeenCalled();
  });

  test('TimePicker with undefined selectedTime fires onChange on typing', async () => {
    const spy = jest.fn();
    render(
      <TimePicker
        label="test"
        selectedTime={undefined as any}
        onChange={spy}
        locale="en-GB"
      />,
    );
    await userEvent.click(
      screen.getByRole('spinbutton', { name: 'hour, test' }),
    );
    await userEvent.keyboard('1230');
    expect(spy).toHaveBeenCalled();
  });

  test('RangeCalendar renders with undefined value', () => {
    expect(() =>
      render(
        <RangeCalendar
          value={undefined as any}
          onChange={jest.fn()}
          locale="en-GB"
        />,
      ),
    ).not.toThrow();
  });

  test('RangeCalendar with undefined value stays controlled', async () => {
    const spy = jest.fn();
    render(
      <RangeCalendar value={undefined as any} onChange={spy} locale="en-GB" />,
    );
    const dates = screen.getAllByRole('button', { name: /\d/ });
    await userEvent.click(dates[5]);
    await userEvent.click(dates[8]);
    expect(spy).toHaveBeenCalled();
    // controlled: nothing is selected until the consumer passes a value back
    expect(document.querySelectorAll('[aria-selected="true"]')).toHaveLength(0);
  });
});
