import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Heading } from '../components/Heading';
import { Text } from '../components/Text';

afterEach(cleanup);

describe('Edge Cases', () => {
  test('Components handle empty children', () => {
    const { container } = render(<Heading as="h1">{''}</Heading>);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Components handle null children', () => {
    const { container } = render(<Text>{null}</Text>);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Components handle undefined children', () => {
    const { container } = render(<Text>{undefined}</Text>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
