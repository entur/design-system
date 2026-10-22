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
    expect(text).toHaveClass('eds-text', 'eds-text--paragraph');
  });

  test('is a paragraph on its own line and inherits inside other text', () => {
    const Custom = (props: React.HTMLAttributes<HTMLSpanElement>) => (
      <span {...props} />
    );
    const { getByText } = render(
      <>
        <Text as="div">Div</Text>
        <Text as="li">Item</Text>
        <Text as="span">Span</Text>
        <Text as="strong" weight="bold">
          Strong
        </Text>
        <Text as="h3">Heading</Text>
        <Text as={Custom}>Custom</Text>
      </>,
    );
    expect(getByText('Div')).toHaveClass('eds-text--paragraph');
    expect(getByText('Item')).toHaveClass('eds-text--paragraph');
    for (const name of ['Span', 'Strong', 'Heading', 'Custom']) {
      expect(getByText(name)).toHaveClass('eds-text--inherit');
      expect(getByText(name)).not.toHaveClass('eds-text--paragraph');
    }
    expect(getByText('Strong')).toHaveClass('eds-text--weight-bold');
  });

  test('a variant replaces the default', () => {
    const { getByText } = render(
      <Text as="span" variant="caption">
        Caption
      </Text>,
    );
    expect(getByText('Caption')).toHaveClass('eds-text--caption');
    expect(getByText('Caption')).not.toHaveClass('eds-text--inherit');
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

  test('renders caption, label, overline and sublabel as block paragraphs', () => {
    const { getByText } = render(
      <>
        <Text variant="caption">Caption</Text>
        <Text variant="label">Label</Text>
        <Text variant="overline">Overline</Text>
        <Text variant="sublabel">Sublabel</Text>
      </>,
    );
    expect(getByText('Caption').tagName).toBe('P');
    expect(getByText('Label').tagName).toBe('P');
    expect(getByText('Overline').tagName).toBe('P');
    expect(getByText('Sublabel').tagName).toBe('P');
  });

  test('renders quote as a blockquote', () => {
    const { getByText } = render(<Text variant="quote">Sitat</Text>);
    expect(getByText('Sitat').tagName).toBe('BLOCKQUOTE');
    expect(getByText('Sitat')).toHaveClass('eds-text--quote');
  });

  test('trims the text box only when asked', () => {
    const { getByText } = render(
      <>
        <Text trim>Trimmet</Text>
        <Text>Vanlig</Text>
      </>,
    );
    expect(getByText('Trimmet')).toHaveClass('eds-text--trim');
    expect(getByText('Vanlig')).not.toHaveClass('eds-text--trim');
  });

  test('keeps emphasized inline', () => {
    const { getByText } = render(<Text variant="emphasized">Viktig</Text>);
    expect(getByText('Viktig').tagName).toBe('EM');
  });

  test('renders code and preformatted as their HTML elements', () => {
    const { getByText } = render(
      <>
        <Text variant="code">npm</Text>
        <Text variant="preformatted">a b</Text>
      </>,
    );
    expect(getByText('npm').tagName).toBe('CODE');
    expect(getByText('npm')).toHaveClass('eds-text--code');
    expect(getByText(/a\s+b/).tagName).toBe('PRE');
  });

  test('applies size classes correctly', () => {
    const { getByText } = render(<Text size="lg">Large text</Text>);
    expect(getByText('Large text')).toHaveClass('eds-text--lg');
  });

  test('applies weight classes correctly', () => {
    const { getByText } = render(<Text weight="bold">Bold text</Text>);
    expect(getByText('Bold text')).toHaveClass('eds-text--weight-bold');
  });

  test('cuts the text after maxLines and keeps the style prop', () => {
    const { getByText } = render(
      <Text maxLines={2} style={{ color: 'red' }}>
        Lang tekst
      </Text>,
    );
    const text = getByText('Lang tekst');
    expect(text).toHaveClass('eds-text--max-lines');
    expect(text.style.getPropertyValue('--eds-text-max-lines')).toBe('2');
    expect(text).toHaveStyle({ color: 'red' });
  });

  test('applies the subdued tone', () => {
    const { getByText } = render(<Text tone="subdued">Metadata</Text>);
    expect(getByText('Metadata')).toHaveClass('eds-text--tone-subdued');
  });

  test('applies spacing', () => {
    const { getByText } = render(<Text spacing="none">Text with spacing</Text>);
    expect(getByText('Text with spacing')).toHaveStyle({
      '--eds-text-spacing-top': '0px',
      '--eds-text-spacing-bottom': '0px',
    });
  });

  test('merges spacing with the style prop', () => {
    const { getByText } = render(
      <Text spacing={{ top: 'xl' }} style={{ color: 'red' }}>
        Styled
      </Text>,
    );
    const text = getByText('Styled');
    expect(text).toHaveStyle({
      '--eds-text-spacing-top': 'var(--spacing-xl)',
      color: 'red',
    });
    expect(text.style.getPropertyValue('--eds-text-spacing-bottom')).toBe('');
  });

  test('combines multiple classes correctly', () => {
    const { getByText } = render(
      <Text variant="paragraph" size="m" weight="medium" spacing="s">
        Combined text
      </Text>,
    );
    const text = getByText('Combined text');
    expect(text).toHaveClass('eds-text--paragraph');
    expect(text).toHaveClass('eds-text--m');
    expect(text).toHaveClass('eds-text--weight-medium');
    expect(text).toHaveStyle({ '--eds-text-spacing-top': 'var(--spacing-s)' });
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
});
