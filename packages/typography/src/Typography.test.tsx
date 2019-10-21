import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as components from '.';

afterEach(cleanup);

test('renders its children', () => {
  Object.values(components).forEach(Component => {
    const { getByText } = render(<Component>Hello world</Component>);
    expect(getByText('Hello world')).toBeTruthy();
    cleanup();
  });
});

test('renders as the specified element', () => {
  Object.values(components).forEach(Component => {
    const { container } = render(
      <Component as="button">Hello world</Component>,
    );
    expect(container.querySelector('button')).toBeTruthy();
    cleanup();
  });
});

test('passes on all props', () => {
  Object.values(components).forEach(Component => {
    const { getByLabelText } = render(
      <Component aria-label="one hundred" className="custom-class">
        💯
      </Component>,
    );
    const result = getByLabelText('one hundred');
    expect(result.className.includes('custom-class')).toBe(true);
    cleanup();
  });
});
