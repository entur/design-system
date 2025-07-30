import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from '@internationalized/date';
import { toHaveNoViolations, axe } from 'jest-axe';

import { Calendar } from '../DatePicker/Calendar';

expect.extend(toHaveNoViolations);

// Locale is added on all tests to ensure a static testing basis
// Time zone is set globally for Jest as UTC in ~/global-setup.js

describe('Calendar', () => {
  const defaultProps = {
    selectedDate: new CalendarDate(2023, 9, 15),
    onChange: jest.fn(),
    locale: 'en-GB',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders calendar with correct month and year', () => {
    render(<Calendar {...defaultProps} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'September 2023' }),
    ).toBeInTheDocument();
  });

  test('renders calendar with week numbers when showWeekNumbers is true', () => {
    render(<Calendar {...defaultProps} showWeekNumbers />);

    expect(screen.getByText('uke')).toBeInTheDocument();
    expect(screen.getByText('37')).toBeInTheDocument(); // Week number for September 15, 2023
  });

  test('renders custom week number header', () => {
    render(
      <Calendar {...defaultProps} showWeekNumbers weekNumberHeader="Week" />,
    );

    expect(screen.getByText('Week')).toBeInTheDocument();
  });

  test('applies custom classNameForDate function', () => {
    const classNameForDate = jest.fn((date: CalendarDate) =>
      date.day === 15 ? 'special-day' : '',
    );

    const { container } = render(
      <Calendar {...defaultProps} classNameForDate={classNameForDate} />,
    );

    expect(classNameForDate).toHaveBeenCalled();
    expect(container.querySelector('.special-day')).toBeInTheDocument();
  });

  test('applies custom ariaLabelForDate function', () => {
    const ariaLabelForDate = jest.fn((date: CalendarDate) =>
      date.day === 15 ? 'special day' : '',
    );

    render(<Calendar {...defaultProps} ariaLabelForDate={ariaLabelForDate} />);

    expect(ariaLabelForDate).toHaveBeenCalled();
  });

  test('calls onSelectedCellClick when selected cell is clicked', async () => {
    const user = userEvent.setup();
    const onSelectedCellClick = jest.fn();

    const { container } = render(
      <Calendar {...defaultProps} onSelectedCellClick={onSelectedCellClick} />,
    );

    const selectedCell = container.querySelector(
      '.eds-datepicker__calendar__grid__cell--selected',
    );
    expect(selectedCell).toBeInTheDocument();

    await user.click(selectedCell!);
    expect(onSelectedCellClick).toHaveBeenCalled();
  });

  test('calls onCellClick when valid cell is clicked', async () => {
    const user = userEvent.setup();
    const onCellClick = jest.fn();

    const { container } = render(
      <Calendar {...defaultProps} onCellClick={onCellClick} />,
    );

    const validCell = container.querySelector(
      '.eds-datepicker__calendar__grid__cell:not(.eds-datepicker__calendar__grid__cell--disabled)',
    );
    expect(validCell).toBeInTheDocument();

    await user.click(validCell!);
    expect(onCellClick).toHaveBeenCalled();
  });

  test('navigates to previous month when left arrow is clicked', async () => {
    const user = userEvent.setup();

    render(<Calendar {...defaultProps} />);

    const leftArrow = screen.getByLabelText('Previous');
    await user.click(leftArrow);

    expect(
      screen.getByRole('heading', { name: 'August 2023' }),
    ).toBeInTheDocument();
  });

  test('navigates to next month when right arrow is clicked', async () => {
    const user = userEvent.setup();

    render(<Calendar {...defaultProps} />);

    const rightArrow = screen.getByLabelText('Next');
    await user.click(rightArrow);

    expect(
      screen.getByRole('heading', { name: 'October 2023' }),
    ).toBeInTheDocument();
  });

  test('selects a date when clicked', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<Calendar {...defaultProps} onChange={onChange} />);

    const dateCell = screen.getByRole('button', {
      name: /^Wednesday, September 20, 2023/,
    });
    await user.click(dateCell);

    expect(onChange).toHaveBeenCalled();
  });

  test('disables dates outside minDate range', () => {
    const minDate = new CalendarDate(2023, 9, 20);

    render(<Calendar {...defaultProps} minDate={minDate} />);

    const disabledCell = screen.getByRole('button', { name: /15/ });
    expect(disabledCell).toHaveClass(
      'eds-datepicker__calendar__grid__cell--disabled',
    );
  });

  test('disables dates outside maxDate range', () => {
    const maxDate = new CalendarDate(2023, 9, 10);

    render(<Calendar {...defaultProps} maxDate={maxDate} />);

    const disabledCell = screen.getByRole('button', {
      name: /^Wednesday, September 20, 2023/,
    });
    expect(disabledCell).toHaveClass(
      'eds-datepicker__calendar__grid__cell--disabled',
    );
  });

  test('handles null selectedDate', () => {
    render(<Calendar {...defaultProps} selectedDate={null} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    // When selectedDate is null, it shows current date, so we just check that a heading exists
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('handles CalendarDateTime selectedDate', () => {
    const dateTime = new CalendarDateTime(2023, 9, 15, 10, 30);

    render(<Calendar {...defaultProps} selectedDate={dateTime} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'September 2023' }),
    ).toBeInTheDocument();
  });

  test('handles ZonedDateTime selectedDate', () => {
    const zonedDateTime = new ZonedDateTime(2023, 9, 15, 'UTC', 0, 10, 30);

    render(<Calendar {...defaultProps} selectedDate={zonedDateTime} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'September 2023' }),
    ).toBeInTheDocument();
  });

  test('applies custom navigation description', () => {
    const navigationDescription = 'Custom navigation description';

    render(
      <Calendar
        {...defaultProps}
        navigationDescription={navigationDescription}
      />,
    );

    // The navigation description is added to a visually hidden element
    const hiddenDescription = screen.getByText(navigationDescription);
    expect(hiddenDescription).toBeInTheDocument();
  });

  test('handles disabled state', () => {
    render(<Calendar {...defaultProps} disabled />);

    const selectedDate = screen.getByRole('button', {
      name: /^Friday, September 15, 2023/,
    });
    expect(selectedDate).toHaveClass(
      'eds-datepicker__calendar__grid__cell--disabled',
    );
  });

  test('applies custom className', () => {
    const { container } = render(
      <Calendar {...defaultProps} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('applies custom style', () => {
    const { container } = render(
      <Calendar {...defaultProps} style={{ backgroundColor: 'red' }} />,
    );

    expect(container.firstChild).toHaveStyle({ backgroundColor: 'red' });
  });

  test('calls onValidate when validation state changes', () => {
    const onValidate = jest.fn();

    render(<Calendar {...defaultProps} onValidate={onValidate} />);

    expect(onValidate).toHaveBeenCalled();
  });

  test('handles keyboard navigation', async () => {
    const user = userEvent.setup();

    render(<Calendar {...defaultProps} />);

    // Focus on the selected date cell (September 15, 2023)
    const selectedCell = screen.getByRole('button', {
      name: /^Friday, September 15, 2023 selected/,
    });
    selectedCell.focus();

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  test('handles forcedReturnType prop', () => {
    render(<Calendar {...defaultProps} forcedReturnType="CalendarDate" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
  });

  test('renders with Norwegian locale', () => {
    render(<Calendar {...defaultProps} locale="no-NO" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    // Norwegian week days should be present
    expect(screen.getByText('ma')).toBeInTheDocument();
    expect(screen.getByText('ti')).toBeInTheDocument();
  });

  test('renders with US locale', () => {
    render(<Calendar {...defaultProps} locale="en-US" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    // US week days should be present
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<Calendar {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('Timezones should always be UTC', () => {
    expect(new Date().getTimezoneOffset()).toBe(0);
  });
});
