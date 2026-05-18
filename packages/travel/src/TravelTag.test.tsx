import React from 'react';
import { fireEvent, render } from '@testing-library/react';

import { TravelTag } from '.';

test('TravelTag renders with content, spread props and with correct classnames, and is closable if need be', () => {
  const spy = jest.fn();
  const testid = 'travelTagTestId';
  const { getByRole, rerender, getByTestId, queryByRole } = render(
    <TravelTag data-testid={testid}>Oslo</TravelTag>,
  );
  expect(getByTestId(testid)).toHaveClass('eds-travel-tag');
  expect(queryByRole('button')).not.toBeInTheDocument();

  rerender(<TravelTag onClose={spy}>Oslo</TravelTag>);
  expect(queryByRole('button')).toBeInTheDocument();
  const closeButton = getByRole('button');
  fireEvent.click(closeButton);
  expect(spy).toHaveBeenCalledTimes(1);
});
test('TravelTag renders with duration type', () => {
  const { getByText } = render(<TravelTag type="duration">12</TravelTag>);
  expect(getByText('12').closest('.eds-travel-tag')).toHaveClass(
    'eds-travel-tag--type-duration',
  );
});
