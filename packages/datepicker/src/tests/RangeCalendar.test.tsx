import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CalendarDate } from '@internationalized/date';
import { axe, toHaveNoViolations } from 'jest-axe';

import { RangeCalendar } from '../DatePicker/RangeCalendar';

expect.extend(toHaveNoViolations);

// Locale is added on all tests to ensure a static testing basis
// Time zone is set globally for Jest as UTC in ~/global-setup.js

describe('RangeCalendar', () => {
  const defaultProps = {
    value: {
      start: new CalendarDate(2023, 9, 10),
      end: new CalendarDate(2023, 9, 20),
    },
    onChange: jest.fn(),
    locale: 'en-GB',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders calendar with correct month and year', () => {
    render(<RangeCalendar {...defaultProps} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { name: 'September 2023' }),
    ).toBeInTheDocument();
  });

  test('renders with null value', () => {
    render(<RangeCalendar {...defaultProps} value={null} />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });

  test('marks selection start and end dates', () => {
    const { container } = render(<RangeCalendar {...defaultProps} />);

    const startCell = container.querySelector(
      '.eds-datepicker__calendar__grid__cell--selection-start',
    );
    const endCell = container.querySelector(
      '.eds-datepicker__calendar__grid__cell--selection-end',
    );

    expect(startCell).toBeInTheDocument();
    expect(endCell).toBeInTheDocument();
  });

  test('marks dates within range with in-range class', () => {
    const { container } = render(<RangeCalendar {...defaultProps} />);

    const inRangeCells = container.querySelectorAll(
      '.eds-datepicker__calendar__grid__cell--in-range',
    );
    expect(inRangeCells.length).toBeGreaterThan(0);
  });

  test('calls onChange when a range is selected', async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();

    render(<RangeCalendar {...defaultProps} onChange={onChange} />);

    // Range selection requires two clicks: start date then end date
    const startCell = screen.getByRole('button', {
      name: /^Wednesday, 6 September 2023/,
    });
    await user.click(startCell);

    const endCell = screen.getByRole('button', {
      name: /^Friday, 8 September 2023/,
    });
    await user.click(endCell);

    expect(onChange).toHaveBeenCalled();
  });

  test('navigates to previous month when left arrow is clicked', async () => {
    const user = userEvent.setup();

    render(<RangeCalendar {...defaultProps} />);

    const leftArrow = screen.getByLabelText('Previous');
    await user.click(leftArrow);

    expect(
      screen.getByRole('heading', { name: 'August 2023' }),
    ).toBeInTheDocument();
  });

  test('navigates to next month when right arrow is clicked', async () => {
    const user = userEvent.setup();

    render(<RangeCalendar {...defaultProps} />);

    const rightArrow = screen.getByLabelText('Next');
    await user.click(rightArrow);

    expect(
      screen.getByRole('heading', { name: 'October 2023' }),
    ).toBeInTheDocument();
  });

  test('renders two month headers when visibleDuration is 2 months', () => {
    render(<RangeCalendar {...defaultProps} visibleDuration={{ months: 2 }} />);

    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBe(2);
    expect(headings[0]).toHaveTextContent('September 2023');
    expect(headings[1]).toHaveTextContent('October 2023');
  });

  test('renders two grids when visibleDuration is 2 months', () => {
    render(<RangeCalendar {...defaultProps} visibleDuration={{ months: 2 }} />);

    const grids = screen.getAllByRole('grid');
    expect(grids.length).toBe(2);
  });

  test('renders week numbers when showWeekNumbers is true', () => {
    render(<RangeCalendar {...defaultProps} showWeekNumbers />);

    expect(screen.getByText('uke')).toBeInTheDocument();
    expect(screen.getByText('36')).toBeInTheDocument(); // Week 36 contains September 10, 2023
  });

  test('renders custom week number header', () => {
    render(
      <RangeCalendar
        {...defaultProps}
        showWeekNumbers
        weekNumberHeader="Week"
      />,
    );

    expect(screen.getByText('Week')).toBeInTheDocument();
  });

  test('disables dates before minDate', () => {
    const minDate = new CalendarDate(2023, 9, 15);

    render(<RangeCalendar {...defaultProps} minDate={minDate} />);

    // Cells before minDate get aria-disabled="true" on the gridcell td
    const disabledGridCell = screen.getByRole('gridcell', { name: '10' });
    expect(disabledGridCell).toHaveAttribute('aria-disabled', 'true');
  });

  test('disables dates after maxDate', () => {
    const maxDate = new CalendarDate(2023, 9, 15);

    render(<RangeCalendar {...defaultProps} maxDate={maxDate} />);

    const disabledGridCell = screen.getByRole('gridcell', { name: '20' });
    expect(disabledGridCell).toHaveAttribute('aria-disabled', 'true');
  });

  test('applies custom classNameForDate function', () => {
    const classNameForDate = jest.fn((date: CalendarDate) =>
      date.day === 15 ? 'special-day' : '',
    );

    const { container } = render(
      <RangeCalendar {...defaultProps} classNameForDate={classNameForDate} />,
    );

    expect(classNameForDate).toHaveBeenCalled();
    expect(container.querySelector('.special-day')).toBeInTheDocument();
  });

  test('applies custom ariaLabelForDate function', () => {
    const ariaLabelForDate = jest.fn((date: CalendarDate) =>
      date.day === 15 ? 'special day' : '',
    );

    render(
      <RangeCalendar {...defaultProps} ariaLabelForDate={ariaLabelForDate} />,
    );

    expect(ariaLabelForDate).toHaveBeenCalled();
  });

  test('calls onValidate on render', () => {
    const onValidate = jest.fn();

    render(<RangeCalendar {...defaultProps} onValidate={onValidate} />);

    expect(onValidate).toHaveBeenCalled();
  });

  test('applies custom className', () => {
    const { container } = render(
      <RangeCalendar {...defaultProps} className="custom-class" />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });

  test('applies custom style', () => {
    const { container } = render(
      <RangeCalendar {...defaultProps} style={{ backgroundColor: 'red' }} />,
    );

    expect(container.firstChild).toHaveStyle({ backgroundColor: 'red' });
  });

  test('renders with Norwegian locale', () => {
    render(<RangeCalendar {...defaultProps} locale="no-NO" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('ma')).toBeInTheDocument();
    expect(screen.getByText('ti')).toBeInTheDocument();
  });

  test('renders with US locale', () => {
    render(<RangeCalendar {...defaultProps} locale="en-US" />);

    expect(screen.getByRole('grid')).toBeInTheDocument();
    expect(screen.getByText('Su')).toBeInTheDocument();
    expect(screen.getByText('Mo')).toBeInTheDocument();
  });

  test('applies custom navigation description', () => {
    const navigationDescription = 'Custom navigation description';

    render(
      <RangeCalendar
        {...defaultProps}
        navigationDescription={navigationDescription}
      />,
    );

    const hiddenDescription = screen.getByText(navigationDescription);
    expect(hiddenDescription).toBeInTheDocument();
  });

  test('shows outside month dates when showOutsideMonth is true', () => {
    const { container } = render(
      <RangeCalendar {...defaultProps} showOutsideMonth />,
    );

    const outsideMonthCells = container.querySelectorAll(
      '.eds-datepicker__calendar__grid__cell--outside-month--visible',
    );
    expect(outsideMonthCells.length).toBeGreaterThan(0);
  });

  test('hides outside month dates when showOutsideMonth is false', () => {
    const { container } = render(
      <RangeCalendar {...defaultProps} showOutsideMonth={false} />,
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
      <RangeCalendar {...defaultProps} showOutsideMonth onChange={onChange} />,
    );

    const outsideMonthCells = container.querySelectorAll(
      '.eds-datepicker__calendar__grid__cell--outside-month--visible',
    );
    expect(outsideMonthCells.length).toBeGreaterThan(0);

    // Range selection requires two clicks: click an outside-month cell as start, then another date as end
    await user.click(outsideMonthCells[0]);
    const endCell = screen.getByRole('button', {
      name: /^Friday, 8 September 2023/,
    });
    await user.click(endCell);

    expect(onChange).toHaveBeenCalled();
  });

  test('has no accessibility violations', async () => {
    const { container } = render(<RangeCalendar {...defaultProps} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
