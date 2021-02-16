import React from 'react';
import { render, cleanup } from '@testing-library/react';
import * as components from '.';
import { Heading1, Label } from '.';
import { SmallText } from './SmallText';

afterEach(cleanup);

test('renders its children', () => {
  Object.values(components).forEach((Component: React.ElementType) => {
    const { getByText } = render(<Component>Hello world</Component>);
    expect(getByText('Hello world')).toBeTruthy();
    cleanup();
  });
});

test('passes on all props', () => {
  Object.values(components).forEach((Component: React.ElementType) => {
    const { getByLabelText } = render(
      <Component aria-label="one hundred" className="custom-class">
        one hunned
      </Component>,
    );
    const result = getByLabelText('one hundred');
    expect(result.className.includes('custom-class')).toBe(true);
    cleanup();
  });
});

test('Renders some typography components with as-prop', () => {
  const hrefLink = '#testerLink';
  const { getByText, rerender } = render(
    <Heading1 as="a" href={hrefLink}>
      H1
    </Heading1>,
  );
  const h1Tester = getByText('H1');
  expect(h1Tester.nodeName).toBe('A');
  expect(h1Tester).toHaveAttribute('href', hrefLink);
  rerender(
    <SmallText as="a" href={hrefLink}>
      Smalltext
    </SmallText>,
  );

  const smallTextTest = getByText('Smalltext');
  expect(smallTextTest.nodeName).toBe('A');
  expect(smallTextTest).toHaveAttribute('href', hrefLink);

  rerender(
    <Label as="a" href={hrefLink}>
      labelText
    </Label>,
  );

  const labelTest = getByText('labelText');
  expect(labelTest.nodeName).toBe('A');
  expect(labelTest).toHaveAttribute('href', hrefLink);
});
