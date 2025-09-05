import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { Heading } from '../components/Heading';

afterEach(cleanup);

describe('Heading Component', () => {
  test('renders with default props', () => {
    const { getByText } = render(<Heading as="h1">Test Heading</Heading>);
    const heading = getByText('Test Heading');
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe('H1');
    expect(heading).toHaveClass('eds-heading');
  });

  test('renders with different semantic elements', () => {
    const { getByText, rerender } = render(
      <Heading as="h2">H2 Heading</Heading>,
    );
    expect(getByText('H2 Heading').tagName).toBe('H2');

    rerender(<Heading as="h3">H3 Heading</Heading>);
    expect(getByText('H3 Heading').tagName).toBe('H3');

    rerender(<Heading as="h4">H4 Heading</Heading>);
    expect(getByText('H4 Heading').tagName).toBe('H4');
  });

  test('applies variant classes correctly', () => {
    const { getByText } = render(
      <Heading as="h1" variant="title-1">
        Title 1
      </Heading>,
    );
    expect(getByText('Title 1')).toHaveClass('eds-heading--title-1');
  });

  test('applies size classes correctly', () => {
    const { getByText } = render(
      <Heading as="h1" size="xl">
        Large Heading
      </Heading>,
    );
    expect(getByText('Large Heading')).toHaveClass('eds-heading--xl');
  });

  test('size overrides variant when both are provided', () => {
    const { getByText } = render(
      <Heading as="h1" variant="title-1" size="lg">
        Heading
      </Heading>,
    );
    const heading = getByText('Heading');
    expect(heading).toHaveClass('eds-heading--lg');
    expect(heading).not.toHaveClass('eds-heading--title-1');
  });

  test('applies spacing classes correctly', () => {
    const { getByText } = render(
      <Heading as="h1" spacing="lg">
        Heading with spacing
      </Heading>,
    );
    expect(getByText('Heading with spacing')).toHaveClass(
      'eds-heading--spacing-lg',
    );
  });

  test('passes through additional props', () => {
    const { getByText } = render(
      <Heading as="h1" data-testid="heading" aria-label="Test heading">
        Heading with props
      </Heading>,
    );
    const heading = getByText('Heading with props');
    expect(heading).toHaveAttribute('data-testid', 'heading');
    expect(heading).toHaveAttribute('aria-label', 'Test heading');
  });

  test('applies custom className', () => {
    const { getByText } = render(
      <Heading as="h1" className="custom-class">
        Custom Heading
      </Heading>,
    );
    expect(getByText('Custom Heading')).toHaveClass('custom-class');
  });

  test('uses semantic type to determine default variant', () => {
    const { getByText } = render(<Heading as="h1">H1</Heading>);
    expect(getByText('H1')).toHaveClass('eds-heading--title-1');

    const { getByText: getByText2 } = render(<Heading as="h2">H2</Heading>);
    expect(getByText2('H2')).toHaveClass('eds-heading--title-2');
  });

  test('Heading with no variant or size uses default', () => {
    const { getByText } = render(<Heading as="h1">Default heading</Heading>);
    expect(getByText('Default heading')).toHaveClass('eds-heading--title-1');
  });
});
