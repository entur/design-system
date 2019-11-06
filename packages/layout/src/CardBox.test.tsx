import React from 'react';
import { render } from '@testing-library/react';
import { CardBox } from '.';

test('CardBox renders properly, and takes additional class and parameters', () => {
  const testUrl = 'https://www.entur.org/';
  const { getByTestId } = render(
    <CardBox
      className="extra-class"
      title="TestingTitle"
      href={testUrl}
      data-testid="TestingId"
    />,
  );
  const cardtab = getByTestId('TestingId');
  expect(cardtab).toBeInTheDocument();
  expect(cardtab).toHaveClass('extra-class');
  expect(cardtab).toHaveTextContent('TestingTitle');
  expect(cardtab).toHaveProperty('href', testUrl);
});
