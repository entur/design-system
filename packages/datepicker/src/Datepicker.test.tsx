import React from 'react';
import { render } from '@testing-library/react';
import { Datepicker } from '.';

test('renders a datepicker', () => {
  const { queryByText } = render(
    <Datepicker placeholderText="placeholder">
      Inside the datepicker
    </Datepicker>,
  );
  expect(queryByText('Inside the datepicker')).not.toBeInTheDocument();
});
