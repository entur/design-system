import React from 'react';
import { PageHeading } from '.';
import { render } from '@testing-library/react';

test('renders children', () => {
  const { getByText } = render(<PageHeading>Hello world</PageHeading>);
  expect(getByText('Hello world')).toBeDefined();
});
