import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Button } from './';

test('Button renders and is clickable', () => {
  let children = 'Button children';
  const testClass = 'longtesterclassname';
  const spy = jest.fn();

  const { getByTestId } = render(
    <Button
      variant="primary"
      onClick={spy}
      data-testid="testerButton"
      className={testClass}
    >
      {children}
    </Button>,
  );

  const testerButton = getByTestId('testerButton');
  expect(testerButton).toHaveClass(testClass);
  expect(testerButton).toContainHTML(children);

  fireEvent.click(testerButton);
  expect(spy).toHaveBeenCalled();
});

test('Button renders as an <a> tag, with an href-property', () => {
  let children = 'Button children';
  const hrefLink = '#coolLinkAddresss';
  const { getByTestId } = render(
    <Button
      variant="primary"
      as="a"
      href={hrefLink}
      data-testid="testerButton2"
    >
      {children}
    </Button>,
  );
  const testerButton = getByTestId('testerButton2');

  expect(testerButton.nodeName).toBe('A');
  expect(testerButton).toHaveAttribute('href', hrefLink);
});
