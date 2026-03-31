import React from 'react';
import { cleanup, render } from '@testing-library/react';
import { Text } from '../components/Text';

afterEach(cleanup);

describe('Text Component', () => {
  test('renders with default props', () => {
    const { getByText } = render(<Text>Test text</Text>);
    const text = getByText('Test text');
    expect(text).toBeInTheDocument();
    expect(text.tagName).toBe('P');
    expect(text).toHaveClass('eds-text');
  });

  test('renders with different elements', () => {
    const { getByText, rerender } = render(<Text as="p">Paragraph text</Text>);
    expect(getByText('Paragraph text').tagName).toBe('P');

    rerender(<Text as="div">Div text</Text>);
    expect(getByText('Div text').tagName).toBe('DIV');
  });

  test('applies variant classes correctly', () => {
    const { getByText } = render(<Text variant="leading">Leading text</Text>);
    expect(getByText('Leading text')).toHaveClass('eds-text--leading');
  });

  test('applies size classes correctly', () => {
    const { getByText } = render(<Text size="lg">Large text</Text>);
    expect(getByText('Large text')).toHaveClass('eds-text--lg');
  });

  test('applies weight classes correctly', () => {
    const { getByText } = render(<Text weight="bold">Bold text</Text>);
    expect(getByText('Bold text')).toHaveClass('eds-text--weight-bold');
  });

  test('applies spacing classes correctly', () => {
    const { getByText } = render(<Text spacing="md">Text with spacing</Text>);
    expect(getByText('Text with spacing')).toHaveClass('eds-text--spacing-md');
  });

  test('combines multiple classes correctly', () => {
    const { getByText } = render(
      <Text variant="paragraph" size="m" weight="medium" spacing="sm">
        Combined text
      </Text>,
    );
    const text = getByText('Combined text');
    expect(text).toHaveClass('eds-text--paragraph');
    expect(text).toHaveClass('eds-text--m');
    expect(text).toHaveClass('eds-text--weight-medium');
    expect(text).toHaveClass('eds-text--spacing-sm');
  });

  test('passes through additional props', () => {
    const { getByText } = render(
      <Text data-testid="text" aria-label="Test text">
        Text with props
      </Text>,
    );
    const text = getByText('Text with props');
    expect(text).toHaveAttribute('data-testid', 'text');
    expect(text).toHaveAttribute('aria-label', 'Test text');
  });

  test('applies custom className', () => {
    const { getByText } = render(
      <Text className="custom-class">Custom text</Text>,
    );
    expect(getByText('Custom text')).toHaveClass('custom-class');
  });

  test('Text with no variant, size, or weight has no weight class', () => {
    const { getByText } = render(<Text>Default text</Text>);
    expect(getByText('Default text')).not.toHaveClass(
      'eds-text--weight-medium',
    );
  });

  test('Components handle empty children', () => {
    const { container } = render(<Text>{''}</Text>);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Components handle null children', () => {
    const { container } = render(<Text>{null}</Text>);
    expect(container.firstChild).toBeInTheDocument();
  });

  test('Components handle undefined children', () => {
    const { container } = render(<Text>{undefined}</Text>);
    expect(container.firstChild).toBeInTheDocument();
  });
});
