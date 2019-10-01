import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { TextField } from './';

test('TextField renders, and accepts text and number input with input-type attribute', () => {
  const spy = jest.fn();
  const testClass = 'Testerclass';
  const testValue = 'inputString';
  const handler = jest.fn();
  const { getByTestId, rerender } = render(
    <TextField
      data-testid="testerTextField"
      onClick={spy}
      className={testClass}
      onInput={handler}
    />,
  );

  const testerTextField = getByTestId('testerTextField') as HTMLInputElement;
  fireEvent.click(testerTextField);
  expect(spy).toHaveBeenCalled();
  fireEvent.input(testerTextField, { target: { value: testValue } });
  expect(handler).toHaveBeenCalled();
  expect(testerTextField.parentNode!).toHaveClass(testClass);
  expect(testerTextField).toHaveProperty('value', testValue);

  rerender(<TextField type="number" />);
  fireEvent.input(testerTextField, { target: { value: testValue } });
  expect(testerTextField).not.toHaveProperty('value', testValue);
  fireEvent.input(testerTextField, { target: { value: 2 } });
  expect(testerTextField).not.toHaveProperty('value', 2);
});
test('Accepts possible props', () => {
  const spy = jest.fn();
  const testClass = 'testerclass2';
  const handler = jest.fn();
  const { getByTestId, rerender } = render(
    <TextField
      data-testid="testerTextField"
      onClick={spy}
      className={testClass}
      prepend="Fra"
      variant="success"
      width="fluid"
      required
      onInput={handler}
    />,
  );

  const testerTextField = getByTestId('testerTextField') as HTMLInputElement;
  expect(testerTextField).toHaveProperty('required', true);
  expect(testerTextField.parentNode!).toHaveClass(
    'entur-textfield--variant-success',
  );
  expect(testerTextField.parentNode!).toHaveClass(
    'entur-textfield--width-fluid',
  );
  expect(testerTextField.previousSibling).toContainHTML('Fra');
  //Disable input
  rerender(<TextField disabled />);
  expect(testerTextField).toHaveProperty('disabled', true);
});
