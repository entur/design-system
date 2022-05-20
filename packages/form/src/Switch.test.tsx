import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Switch } from './';
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

test('Switch renders with appropriate label and is clickable, and state is set on click.', () => {
  const spy = jest.fn();
  const { getByLabelText } = render(
    <Switch onClick={spy}>Accept terms</Switch>,
  );

  const switchComponent = getByLabelText('Accept terms');
  fireEvent.click(switchComponent);
  expect(spy).toHaveBeenCalled();
  expect(switchComponent).toHaveProperty('checked', true);
  fireEvent.click(switchComponent);
  expect(spy).toHaveBeenCalledTimes(2);
  expect(switchComponent).toHaveProperty('checked', false);
});

test('Switch should not have basic accessibility issues', async () => {
  const spy = jest.fn();
  const { container } = render(<Switch onClick={spy}>Accept terms</Switch>);
  const results = await axe(container);

  expect(results).toHaveNoViolations();
});
