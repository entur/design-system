import { render, screen } from '@testing-library/react';
import { Heading } from '..';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';

describeComponentContract('Heading', {
  render: props => <Heading {...props}>Content</Heading>,
  getElement: () => screen.getByText('Content'),
  baseClassName: 'eds-heading',
  as: 'h2',
});

test('preserves the requested heading level regardless of variant or size', () => {
  render(
    <>
      <Heading>Travel guide</Heading>
      <Heading as="h2" variant="title-1">
        Tickets
      </Heading>
      <Heading as="h3" variant="subtitle-1" size="lg">
        Discounts
      </Heading>
      <Heading as="h4">Children</Heading>
      <Heading as="h5">Conditions</Heading>
      <Heading as="h6">Exceptions</Heading>
    </>,
  );

  [
    'Travel guide',
    'Tickets',
    'Discounts',
    'Children',
    'Conditions',
    'Exceptions',
  ].forEach((name, index) => {
    expect(
      screen.getByRole('heading', { name, level: index + 1 }),
    ).toBeInTheDocument();
  });
});

test.each([
  ['h1', 'title-1'],
  ['h2', 'title-2'],
  ['h3', 'subtitle-1'],
  ['h4', 'subtitle-2'],
  ['h5', 'section-1'],
  ['h6', 'section-2'],
  ['div', 'title-1'],
] as const)('derives the default variant for <%s> as %s', (as, variant) => {
  render(<Heading as={as}>Content</Heading>);
  expect(screen.getByText('Content')).toHaveClass(`eds-heading--${variant}`);
});

test('defaults to an h1 with the title-1 variant', () => {
  render(<Heading>Content</Heading>);
  const heading = screen.getByRole('heading', { level: 1 });
  expect(heading).toHaveClass('eds-heading--title-1');
});

test('applies an explicit variant instead of the derived one', () => {
  render(
    <Heading as="h3" variant="title-1">
      Content
    </Heading>,
  );
  const heading = screen.getByText('Content');
  expect(heading).toHaveClass('eds-heading--title-1');
  expect(heading).not.toHaveClass('eds-heading--subtitle-1');
});

test('size overrides both an explicit and a derived variant', () => {
  const { rerender } = render(
    <Heading as="h1" variant="title-2" size="lg">
      Content
    </Heading>,
  );
  const heading = screen.getByText('Content');
  expect(heading).toHaveClass('eds-heading--lg');
  expect(heading).not.toHaveClass('eds-heading--title-2');
  expect(heading).not.toHaveClass('eds-heading--title-1');

  rerender(
    <Heading as="h2" size="xl">
      Content
    </Heading>,
  );
  const derived = screen.getByRole('heading', { level: 2 });
  expect(derived).toHaveClass('eds-heading--xl');
  expect(derived).not.toHaveClass('eds-heading--title-2');
});

test.each([
  'none',
  'xs2',
  'xs2-top',
  'xs2-bottom',
  'xs',
  'xs-top',
  'xs-bottom',
  'sm',
  'sm-top',
  'sm-bottom',
  'md',
  'md-top',
  'md-bottom',
  'lg',
  'lg-top',
  'lg-bottom',
  'xl',
  'xl-top',
  'xl-bottom',
] as const)('applies the %s spacing modifier', spacing => {
  render(<Heading spacing={spacing}>Content</Heading>);
  expect(screen.getByText('Content')).toHaveClass(
    `eds-heading--spacing-${spacing}`,
  );
});

test('adds no spacing modifier without spacing', () => {
  render(<Heading>Content</Heading>);
  expect(screen.getByText('Content').className).not.toMatch(/--spacing-/);
});
