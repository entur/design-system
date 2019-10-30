import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Checkbox } from './';

test('Checkbox renders with appropriate label and is clickable, and state is set on click.', () => {
  const labelMsg = 'labelTester';
  const spy = jest.fn();
  const testId = 'textfieldTester';
  const { getByTestId } = render(
    <Checkbox onClick={spy} label={labelMsg} data-testid={testId} />,
  );

  const testerTextField = getByTestId(testId);
  fireEvent.click(testerTextField);
  expect(spy).toHaveBeenCalled();
  expect(testerTextField).toHaveProperty('checked', true);
  fireEvent.click(testerTextField);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(testerTextField).toHaveProperty('checked', false);
});
