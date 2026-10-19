import { cleanup, render } from '@testing-library/react';
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
    // heading.scss puts the size rules after the variant rules
    expect(heading).toHaveClass('eds-heading--title-1', 'eds-heading--lg');
  });

  test('trims the text box when asked', () => {
    const { getByText } = render(<Heading trim>Trimmet</Heading>);
    expect(getByText('Trimmet')).toHaveClass('eds-heading--trim');
  });

  test('applies spacing', () => {
    const { getByText } = render(
      <Heading as="h1" spacing={{ top: '2xl', bottom: 's' }}>
        Heading with spacing
      </Heading>,
    );
    expect(getByText('Heading with spacing')).toHaveStyle({
      '--eds-text-spacing-top': 'var(--spacing-2xl)',
      '--eds-text-spacing-bottom': 'var(--spacing-s)',
    });
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
