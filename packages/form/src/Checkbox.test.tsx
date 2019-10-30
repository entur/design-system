import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Checkbox } from './';

test('Checkbox renders with appropriate label and is clickable, and state is set on click.', () => {
  const spy = jest.fn();
  const { getByLabelText } = render(
    <Checkbox onClick={spy}>Accept terms</Checkbox>,
  );

  const checkbox = getByLabelText('Accept terms');
  fireEvent.click(checkbox);
  expect(spy).toHaveBeenCalled();
  expect(checkbox).toHaveProperty('checked', true);
  fireEvent.click(checkbox);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(checkbox).toHaveProperty('checked', false);
});
