import React from 'react';
import { render } from '@testing-library/react';
import { Contrast } from './Contrast';

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

test('Contrast component as-prop in use', () => {
  const hrefLink = '#testerLink';
  const { getByTestId } = render(
    <Contrast as="a" href={hrefLink} data-testid="contrastId">
      cool
    </Contrast>,
  );
  const contrastComponent = getByTestId('contrastId');

  expect(contrastComponent.nodeName).toBe('A');
  expect(contrastComponent).toHaveAttribute('href', hrefLink);
});
