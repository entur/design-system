import React from 'react';
import { render } from '@testing-library/react';

import { Dropdown } from './';
import { DropdownItem } from './Dropdown';

test('Dropdown renders with a series of choices to pick between', () => {
  const spy = jest.fn();
  const testId = 'textfieldTester';
  const { getByTestId } = render(
    <Dropdown onChange={spy} data-testid={testId} value="Oslo">
      <DropdownItem value="Oslo">Oslo</DropdownItem>
      <DropdownItem value="Bergen">Bergen</DropdownItem>
    </Dropdown>,
  );
  const testerSelect = getByTestId(testId);
  expect(testerSelect).toHaveProperty('value', 'Oslo');
});
