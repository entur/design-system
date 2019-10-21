import React from 'react';
import { render } from '@testing-library/react';
import { Contrast } from '.';

test('Contrast component adds the entur-contrast class', () => {
  const { container } = render(
    <Contrast className="extra-class">Hello world</Contrast>,
  );
  expect(container.querySelector('.entur-contrast')).toBeTruthy();
  expect(container.querySelector('.entur-contrast')).toHaveClass('extra-class');
  expect(container.querySelector('.entur-contrast')).toHaveTextContent(
    'Hello world',
  );
});
