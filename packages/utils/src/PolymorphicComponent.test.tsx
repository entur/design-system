import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  PolymorphicComponentPropsWithRef,
  PolymorphicRef,
  forwardRefPolymorphic,
} from '.';

type BoxProps<T extends React.ElementType> = PolymorphicComponentPropsWithRef<
  T,
  { children: React.ReactNode }
>;

type BoxComponent = <T extends React.ElementType = 'div'>(
  props: BoxProps<T>,
) => React.ReactElement | null;

const Box = forwardRefPolymorphic<BoxComponent>(
  <T extends React.ElementType = 'div'>(
    { as, children, ...rest }: BoxProps<T>,
    ref: PolymorphicRef<T>,
  ) => {
    const Element: React.ElementType = as || 'div';
    return (
      <Element ref={ref} {...rest}>
        {children}
      </Element>
    );
  },
);

test('renders the element given by the as prop and forwards the ref to it', () => {
  const ref = React.createRef<HTMLAnchorElement>();
  render(
    <Box as="a" href="/reise" ref={ref}>
      Reise
    </Box>,
  );
  const link = screen.getByRole('link', { name: 'Reise' });
  expect(link).toHaveAttribute('href', '/reise');
  expect(ref.current).toBe(link);
});

test('renders the default element when as is not given', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<Box ref={ref}>Innhold</Box>);
  expect(ref.current?.tagName).toBe('DIV');
});

test('types props and ref from the as prop', () => {
  // Checked by tsc, not Jest; the render only keeps the JSX in use
  render(
    <>
      <Box as="a" href="/reise" ref={React.createRef<HTMLAnchorElement>()}>
        Reise
      </Box>
      {/* @ts-expect-error href is not a div prop */}
      <Box href="/reise">Reise</Box>
      {/* @ts-expect-error a div ref doesn't fit an anchor */}
      <Box as="a" ref={React.createRef<HTMLDivElement>()}>
        Reise
      </Box>
    </>,
  );
});
