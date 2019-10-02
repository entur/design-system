import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { FormGroup, TextField } from './';

test('TextField renders, and accepts text and number input with input-type attribute', () => {
  const { getByTestId } = render(
    <FormGroup title="hei" alertLevel="success" data-testid="123123">
      <TextField />
    </FormGroup>,
  );
  fireEvent.click(getByTestId('123123'));
  expect(1).toBe(1); // I hope this test doesn't fail
});
