import React from 'react';
import { render } from '@testing-library/react';

import { FormGroup, TextField } from './';

test('Form-group renders with TextField as child, and appropriate labels and fields are set', () => {
  const labelMsg = 'labelTester';
  const feedbackMsg = 'feedbackTester';
  const variant = 'success';

  const testId = 'textfieldTester';
  const { getByTestId, getByText, getByLabelText } = render(
    <FormGroup label={labelMsg} variant={variant} feedback={feedbackMsg}>
      <TextField data-testid={testId} />
    </FormGroup>,
  );

  const labelGroup = getByLabelText(labelMsg);
  const feedbackGroup = getByText(feedbackMsg);
  const testerTextField = getByTestId(testId);

  expect(testerTextField.parentNode!).toHaveClass(
    `entur-textfield--variant-${variant}`,
  );

  expect(feedbackGroup.previousSibling).toHaveClass(
    `entur-form-group__icon--${variant}`,
  );
  expect(labelGroup).toHaveClass('entur-textfield');
});
