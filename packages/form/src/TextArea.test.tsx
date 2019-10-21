import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { TextArea } from '.';

test('TextArea renders, and accepts text input ', () => {
  const spy = jest.fn();
  const testClass = 'Testerclass';
  const testValue = 'inputString';
  const handler = jest.fn();
  const { getByTestId } = render(
    <TextArea
      data-testid="testerTextArea"
      onClick={spy}
      className={testClass}
      onInput={handler}
    />,
  );

  const testerTextArea = getByTestId('testerTextArea') as HTMLInputElement;
  fireEvent.click(testerTextArea);
  expect(spy).toHaveBeenCalled();
  fireEvent.input(testerTextArea, { target: { value: testValue } });
  expect(handler).toHaveBeenCalled();
  expect(testerTextArea).toHaveClass(testClass);
  expect(testerTextArea).toHaveProperty('value', testValue);
});

test('Accepts possible props', () => {
  const spy = jest.fn();
  const testClass = 'testerclass2';
  const handler = jest.fn();
  const { getByTestId, rerender } = render(
    <TextArea
      data-testid="testerTextArea2"
      onClick={spy}
      className={testClass}
      variant="success"
      width="fluid"
      required
      onInput={handler}
    />,
  );

  const testerTextArea = getByTestId('testerTextArea2') as HTMLInputElement;
  expect(testerTextArea).toHaveProperty('required', true);
  expect(testerTextArea).toHaveClass('entur-form-component--variant-success');
  expect(testerTextArea).toHaveClass('entur-form-component--width-fluid');
  //Disable input
  rerender(<TextArea disabled={true} data-testid="disabledArea" />);
  expect(getByTestId('disabledArea')).toHaveProperty('disabled', true);
});
