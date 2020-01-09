import React from 'react';
import { render } from '@testing-library/react';

import { TravelHeader } from '.';

test('TravelHeader renders with content, spread props and with correct classnames', () => {
  const from = 'Oslo';
  const to = 'Bergen';
  const testid = 'travelheaderid';
  const { getByText, getByTestId, rerender } = render(
    <TravelHeader from={from} to={to} data-testid={testid} />,
  );

  const fromSpan = getByText(from);
  expect(fromSpan).toHaveClass('eds-travel-header__from');

  const toSpan = getByText(to);
  expect(toSpan).toHaveClass('eds-travel-header__to');

  const component = getByTestId(testid);
  expect(component).toHaveClass('eds-travel-header--large');

  rerender(
    <TravelHeader from={from} to={to} size="medium" data-testid={testid} />,
  );
  const componentMedium = getByTestId(testid);
  expect(componentMedium).toHaveClass('eds-travel-header--medium');
});
