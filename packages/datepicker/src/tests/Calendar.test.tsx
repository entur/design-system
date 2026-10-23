import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CalendarDate,
  CalendarDateTime,
  ZonedDateTime,
} from '@internationalized/date';
import { axe, toHaveNoViolations } from 'jest-axe';

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
      name: /^Wednesday, 20 September 2023/,
    });
    await user.click(dateCell);

    expect(onChange).toHaveBeenCalled();
  });

  test('rejects clicks before minDate and accepts the inclusive boundary', async () => {
    const user = userEvent.setup();
    const minDate = new CalendarDate(2023, 9, 20);

    render(<Calendar {...defaultProps} minDate={minDate} />);

    expect(screen.getByRole('gridcell', { name: '15' })).toHaveAttribute(
      'aria-disabled',
      'true',
    );
    await user.click(
      screen.getByRole('button', { name: /^Friday, 15 September 2023/ }),
    );
    expect(defaultProps.onChange).not.toHaveBeenCalled();
    await user.click(
      screen.getByRole('button', { name: /^Wednesday, 20 September 2023/ }),
    );
    expect(defaultProps.onChange).toHaveBeenCalledWith(minDate);
  });

  test('keyboard navigation cannot select past maxDate', async () => {
    const user = userEvent.setup();
    const maxDate = new CalendarDate(2023, 9, 10);

    render(<Calendar {...defaultProps} maxDate={maxDate} />);

    const lastAvailableDate = screen.getByRole('button', {
      name: /^Sunday, 10 September 2023/,
    });
    act(() => lastAvailableDate.focus());
    await user.keyboard('{ArrowRight}{Enter}');
    expect(lastAvailableDate).toHaveFocus();
    expect(defaultProps.onChange).toHaveBeenCalledWith(maxDate);
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

  test('disabled calendar rejects date selection', async () => {
    const user = userEvent.setup();
    render(<Calendar {...defaultProps} disabled />);

    const selectedDate = screen.getByRole('button', {
      name: /^Friday, 15 September 2023/,
    });
    expect(screen.getByRole('grid')).toHaveAttribute('aria-disabled', 'true');
    await user.click(selectedDate);
    expect(defaultProps.onChange).not.toHaveBeenCalled();
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
      name: /^Friday, 15 September 2023 selected/,
    });
    act(() => selectedCell.focus());

    await user.keyboard('{ArrowRight}');
    await user.keyboard('{ArrowDown}');
    await user.keyboard('{Enter}');

    expect(defaultProps.onChange).toHaveBeenCalledWith(
      new CalendarDate(2023, 9, 23),
    );
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

  test('shows outside month dates when showOutsideMonth is true', () => {
    const { container } = render(
      <Calendar {...defaultProps} showOutsideMonth />,
    );

    const outsideMonthCells = container.querySelectorAll(
      '.eds-datepicker__calendar__grid__cell--outside-month--visible',
    );
    expect(outsideMonthCells.length).toBeGreaterThan(0);
  });

  test('hides outside month dates when showOutsideMonth is false', () => {
    const { container } = render(
      <Calendar {...defaultProps} showOutsideMonth={false} />,
    );

    const outsideMonthVisibleCells = container.querySelectorAll(
      '.eds-datepicker__calendar__grid__cell--outside-month--visible',
    );
    expect(outsideMonthVisibleCells.length).toBe(0);

    const outsideMonthHiddenCells = container.querySelectorAll(
      '.eds-datepicker__calendar__grid__cell--outside-month',
    );
    expect(outsideMonthHiddenCells.length).toBeGreaterThan(0);
  });

  test('allows selecting outside month dates when showOutsideMonth is true', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    const { container } = render(
      <Calendar {...defaultProps} showOutsideMonth onChange={onChange} />,
    );

    const outsideMonthCell = container.querySelector(
      '.eds-datepicker__calendar__grid__cell--outside-month--visible',
    );
    expect(outsideMonthCell).toBeInTheDocument();

    await user.click(outsideMonthCell!);
    expect(onChange).toHaveBeenCalled();
  });

  describe('visibleDuration', () => {
    test('renders two month headings and grids when visibleDuration is 2 months', () => {
      render(<Calendar {...defaultProps} visibleDuration={{ months: 2 }} />);

      expect(
        screen.getByRole('heading', { name: 'September 2023' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'October 2023' }),
      ).toBeInTheDocument();
      expect(screen.getAllByRole('grid')).toHaveLength(2);
    });

    test('overflow dates between months are not duplicated as interactive cells', () => {
      const { container } = render(
        <Calendar {...defaultProps} visibleDuration={{ months: 2 }} />,
      );

      const betweenMonthsCells = container.querySelectorAll(
        '.eds-datepicker__calendar__grid__cell--between-months',
      );
      betweenMonthsCells.forEach(cell => {
        expect(cell).toHaveAttribute('aria-hidden', 'true');
        expect(cell).not.toHaveAttribute('aria-label');
      });
    });

    test('navigation moves both months forward when next is clicked', async () => {
      const user = userEvent.setup();

      render(<Calendar {...defaultProps} visibleDuration={{ months: 2 }} />);

      const rightArrow = screen.getByLabelText('Next');
      await user.click(rightArrow);

      expect(
        screen.getByRole('heading', { name: 'November 2023' }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('heading', { name: 'December 2023' }),
      ).toBeInTheDocument();
    });
  });
  test('merges className, forwards style and resolves calendarRef to the calendar container', () => {
    const calendarRef = React.createRef<HTMLDivElement>();
    const { container } = render(
      <Calendar
        {...defaultProps}
        className="custom-class"
        style={{ backgroundColor: 'red' }}
        calendarRef={calendarRef}
      />,
    );
    const calendar = container.firstElementChild;
    expect(calendar).toHaveClass('eds-datepicker__calendar', 'custom-class');
    expect(calendar).toHaveStyle({ backgroundColor: 'red' });
    expect(calendarRef.current).toBe(calendar);
    expect(calendar).toContainElement(screen.getByRole('grid'));
  });

  test.each([
    [
      'minDate',
      { minDate: new CalendarDate(2023, 9, 20) },
      /^Friday, 15 September 2023/,
    ],
    [
      'maxDate',
      { maxDate: new CalendarDate(2023, 9, 10) },
      /^Friday, 15 September 2023/,
    ],
    ['disabled', { disabled: true }, /^Friday, 15 September 2023/],
  ] as const)(
    '%s sets the disabled modifier on unavailable cells',
    (_, props, name) => {
      render(<Calendar {...defaultProps} {...props} />);
      expect(screen.getByRole('button', { name })).toHaveClass(
        'eds-datepicker__calendar__grid__cell--disabled',
      );
    },
  );

  test('available cells do not get the disabled modifier', () => {
    render(<Calendar {...defaultProps} />);
    expect(
      screen.getByRole('button', { name: /^Wednesday, 20 September 2023/ }),
    ).not.toHaveClass('eds-datepicker__calendar__grid__cell--disabled');
  });
});
