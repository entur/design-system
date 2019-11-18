import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ActionChip } from '.';

test('ActionChip renders and is clickable', () => {
  let children = 'Action Chip';
  const testClass = 'TestClass';
  const spy = jest.fn();

  const { getByTestId } = render(
    <ActionChip onClick={spy} data-testid="ActionChipId" className={testClass}>
      {children}
    </ActionChip>,
  );

  const testerButton = getByTestId('ActionChipId');
  expect(testerButton).toHaveClass(testClass);
  expect(testerButton).toContainHTML(children);

  fireEvent.click(testerButton);
  expect(spy).toHaveBeenCalled();
});
