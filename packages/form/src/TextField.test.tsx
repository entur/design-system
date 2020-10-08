import React from 'react';
import { render } from '@testing-library/react';
import { TextField } from './TextField';
import { toHaveNoViolations, axe } from 'jest-axe';

expect.extend(toHaveNoViolations);
test('TextField is accessible', async () => {
  const { container } = render(<TextField label="testing label" />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
