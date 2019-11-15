import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { NavBarItem } from '.';

test('Renders a navbaritem with additional classes, and working selected attribute', () => {
  let tester = false;
  const spy = jest.fn();
  const { getByTestId, rerender } = render(
    <NavBarItem
      className="additionalClass"
      data-testid="testid"
      selected={tester}
      onClick={spy}
    >
      Click me
    </NavBarItem>,
  );
  const trigger = getByTestId('testid');

  fireEvent.click(trigger);
  expect(spy).toHaveBeenCalledTimes(1);
  expect(trigger).not.toHaveClass('eds-navbar-item--active');
  expect(trigger).toHaveClass('additionalClass');
  rerender(
    <NavBarItem
      className="additional class"
      data-testid="testid"
      selected={true}
      onClick={spy}
    >
      Click me
    </NavBarItem>,
  );

  expect(trigger).toHaveClass('eds-navbar-item--active');
});
