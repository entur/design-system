import React from 'react';
import { render } from '@testing-library/react';
import { Contrast } from '.';

test('Contrast component adds the eds-contrast class', () => {
  const { container } = render(
    <Contrast className="extra-class">Hello world</Contrast>,
  );
  expect(container.querySelector('.eds-contrast')).toBeTruthy();
  expect(container.querySelector('.eds-contrast')).toHaveClass('extra-class');
  expect(container.querySelector('.eds-contrast')).toHaveTextContent(
    'Hello world',
  );
});
