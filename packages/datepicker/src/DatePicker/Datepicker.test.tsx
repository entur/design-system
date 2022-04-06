import React from 'react';
import { render } from '@testing-library/react';
import { DatePicker } from '.';

test('renders a datepicker', () => {
  const spy = jest.fn();
  const { queryByText } = render(
    <DatePicker
      selectedDate={new Date()}
      label="TestLabel"
      onChange={spy}
      placeholder="placeholder"
    >
      Inside the datepicker
    </DatePicker>,
  );
  expect(queryByText('Inside the datepicker')).not.toBeInTheDocument();
  expect(queryByText('TestLabel')).toBeInTheDocument();
});
