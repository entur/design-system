import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { TopNavigationItem } from '.';

test('Renders a TopNavigationItem with additional classes, and working selected attribute', () => {
  const spy = jest.fn();
  const { getByTestId, rerender } = render(
    <TopNavigationItem
      className="additionalClass"
      data-testid="testid"
      active={false}
      onClick={spy}
    >
      Click me
    </TopNavigationItem>,
  );
  const trigger = getByTestId('testid');

  fireEvent.click(trigger);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(trigger).not.toHaveClass('eds-top-navigation-item--active');
  expect(trigger).toHaveClass('additionalClass');
  rerender(
    <TopNavigationItem
      className="additional class"
      data-testid="testid"
      active={true}
      onClick={spy}
    >
      Click me
    </TopNavigationItem>,
  );

  expect(trigger).toHaveClass('eds-top-navigation-item--active');
});
