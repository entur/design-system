import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Heading } from './Heading';
import { Text } from './Text';
import { LinkBeta } from './LinkBeta';
import { BlockquoteBeta, BlockquoteFooterBeta } from './BlockquoteBeta';
import { getHeadingVariantFromSemanticType, getSpacingClasses } from './utils';

expect.extend(toHaveNoViolations);

afterEach(cleanup);

describe('Beta Typography Components', () => {
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
  });

  describe('Text Component', () => {
    test('renders with default props', () => {
      const { getByText } = render(<Text>Test text</Text>);
      const text = getByText('Test text');
      expect(text).toBeInTheDocument();
      expect(text.tagName).toBe('P');
      expect(text).toHaveClass('eds-text');
    });

    test('renders with different elements', () => {
      const { getByText, rerender } = render(
        <Text as="p">Paragraph text</Text>,
      );
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
      expect(getByText('Text with spacing')).toHaveClass(
        'eds-text--spacing-md',
      );
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
  });

  describe('LinkBeta Component', () => {
    test('renders as anchor by default', () => {
      const { getByText } = render(<LinkBeta href="/test">Test link</LinkBeta>);
      const link = getByText('Test link');
      expect(link.tagName).toBe('A');
      expect(link).toHaveAttribute('href', '/test');
    });

    test('renders with external icon when external is true', () => {
      const { getByText, getByLabelText } = render(
        <LinkBeta href="/external" external>
          External link
        </LinkBeta>,
      );
      expect(getByText('External link')).toBeInTheDocument();
      expect(getByLabelText('(ekstern lenke)')).toBeInTheDocument();
    });

    test('allows custom aria-label for external icon', () => {
      const { getByLabelText } = render(
        <LinkBeta
          href="/external"
          external
          ariaLabelExternalIcon="External link icon"
        >
          External link
        </LinkBeta>,
      );
      expect(getByLabelText('External link icon')).toBeInTheDocument();
    });

    test('renders as different element with as prop', () => {
      const { getByText } = render(
        <LinkBeta as="button" type="button">
          Button link
        </LinkBeta>,
      );
      expect(getByText('Button link').tagName).toBe('BUTTON');
    });

    test('applies spacing classes correctly', () => {
      const { getByText } = render(
        <LinkBeta href="/test" spacing="lg">
          Link with spacing
        </LinkBeta>,
      );
      expect(getByText('Link with spacing')).toHaveClass(
        'eds-text--link--spacing-lg',
      );
    });

    test('passes through additional props', () => {
      const { getByText } = render(
        <LinkBeta href="/test" data-testid="link" target="_blank">
          Link with props
        </LinkBeta>,
      );
      const link = getByText('Link with props');
      expect(link).toHaveAttribute('data-testid', 'link');
      expect(link).toHaveAttribute('target', '_blank');
    });

    test('applies custom className', () => {
      const { getByText } = render(
        <LinkBeta href="/test" className="custom-class">
          Custom link
        </LinkBeta>,
      );
      expect(getByText('Custom link')).toHaveClass('custom-class');
    });
  });

  describe('BlockquoteBeta Component', () => {
    test('renders blockquote element', () => {
      const { getByText } = render(<BlockquoteBeta>Test quote</BlockquoteBeta>);
      const blockquote = getByText('Test quote');
      expect(blockquote.tagName).toBe('BLOCKQUOTE');
      expect(blockquote).toHaveClass('eds-text--blockquote');
    });

    test('passes through additional props', () => {
      const { getByText } = render(
        <BlockquoteBeta data-testid="quote" cite="/source">
          Quote with props
        </BlockquoteBeta>,
      );
      const blockquote = getByText('Quote with props');
      expect(blockquote).toHaveAttribute('data-testid', 'quote');
      expect(blockquote).toHaveAttribute('cite', '/source');
    });

    test('applies custom className', () => {
      const { getByText } = render(
        <BlockquoteBeta className="custom-class">Custom quote</BlockquoteBeta>,
      );
      expect(getByText('Custom quote')).toHaveClass('custom-class');
    });
  });

  describe('BlockquoteFooterBeta Component', () => {
    test('renders footer element', () => {
      const { getByText } = render(
        <BlockquoteFooterBeta>Footer text</BlockquoteFooterBeta>,
      );
      const footer = getByText('Footer text');
      expect(footer.tagName).toBe('FOOTER');
      expect(footer).toHaveClass('eds-text--blockquote__footer');
    });

    test('passes through additional props', () => {
      const { getByText } = render(
        <BlockquoteFooterBeta data-testid="footer">
          Footer with props
        </BlockquoteFooterBeta>,
      );
      expect(getByText('Footer with props')).toHaveAttribute(
        'data-testid',
        'footer',
      );
    });

    test('applies custom className', () => {
      const { getByText } = render(
        <BlockquoteFooterBeta className="custom-class">
          Custom footer
        </BlockquoteFooterBeta>,
      );
      expect(getByText('Custom footer')).toHaveClass('custom-class');
    });
  });

  describe('Utility Functions', () => {
    describe('getHeadingVariantFromSemanticType', () => {
      test('returns correct variant for h1', () => {
        expect(getHeadingVariantFromSemanticType('h1')).toBe('title-1');
      });

      test('returns correct variant for h2', () => {
        expect(getHeadingVariantFromSemanticType('h2')).toBe('title-2');
      });

      test('returns correct variant for h3', () => {
        expect(getHeadingVariantFromSemanticType('h3')).toBe('subtitle-1');
      });

      test('returns correct variant for h4', () => {
        expect(getHeadingVariantFromSemanticType('h4')).toBe('subtitle-2');
      });

      test('returns default variant for unknown semantic type', () => {
        expect(getHeadingVariantFromSemanticType('div')).toBe('title-1');
      });

      test('returns default variant for non-string input', () => {
        // Test with an actual React component (non-string)
        const MockComponent = () => <div>Mock</div>;
        expect(getHeadingVariantFromSemanticType(MockComponent)).toBe(
          'title-1',
        );
      });
    });

    describe('getSpacingClasses', () => {
      test('returns correct spacing classes for different values', () => {
        const lgResult = getSpacingClasses('lg', 'eds-heading');
        expect(lgResult).toBeDefined();
        expect(lgResult!['eds-heading--spacing-lg']).toBe(true);

        const mdTopResult = getSpacingClasses('md-top', 'eds-text');
        expect(mdTopResult).toBeDefined();
        expect(mdTopResult!['eds-text--spacing-md-top']).toBe(true);
      });

      test('returns undefined when spacing is not provided', () => {
        expect(getSpacingClasses(undefined, 'eds-heading')).toBeUndefined();
      });

      test('handles all spacing variants', () => {
        const spacingVariants = [
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
        ];

        spacingVariants.forEach(spacing => {
          const result = getSpacingClasses(spacing as any, 'eds-test');
          expect(result).toBeDefined();
          expect(result![`eds-test--spacing-${spacing}`]).toBe(true);
        });
      });
    });
  });

  describe('Accessibility', () => {
    test('Heading components should not have basic accessibility issues', async () => {
      const { container } = render(
        <>
          <Heading as="h1">Main heading</Heading>
          <Heading as="h2">Sub heading</Heading>
          <Heading as="h3" variant="subtitle-1">
            Subtitle
          </Heading>
        </>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Text components should not have basic accessibility issues', async () => {
      const { container } = render(
        <>
          <Text variant="paragraph">Regular paragraph text</Text>
          <Text variant="leading">Leading text</Text>
          <Text variant="caption">Caption text</Text>
        </>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Link components should not have basic accessibility issues', async () => {
      const { container } = render(
        <>
          <LinkBeta href="/internal">Internal link</LinkBeta>
          <LinkBeta href="/external" external>
            External link
          </LinkBeta>
        </>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Blockquote components should not have basic accessibility issues', async () => {
      const { container } = render(
        <BlockquoteBeta>
          Quote text
          <BlockquoteFooterBeta>Author name</BlockquoteFooterBeta>
        </BlockquoteBeta>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    test('Complex typography composition should not have basic accessibility issues', async () => {
      const { container } = render(
        <div>
          <Heading as="h1" variant="title-1">
            Article Title
          </Heading>
          <Text variant="leading" spacing="md">
            This is a leading paragraph that introduces the article.
          </Text>
          <Heading as="h2" variant="title-2">
            Section Heading
          </Heading>
          <Text variant="paragraph" spacing="sm">
            This is a regular paragraph with some{' '}
            <LinkBeta href="/reference" external>
              external reference
            </LinkBeta>{' '}
            and{' '}
            <Text variant="emphasized" as="span">
              emphasized text
            </Text>
            .
          </Text>
          <BlockquoteBeta>
            <Text variant="quote">This is an important quote</Text>
            <BlockquoteFooterBeta>— Famous Author</BlockquoteFooterBeta>
          </BlockquoteBeta>
        </div>,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });

  describe('Edge Cases', () => {
    test('Heading with no variant or size uses default', () => {
      const { getByText } = render(<Heading as="h1">Default heading</Heading>);
      expect(getByText('Default heading')).toHaveClass('eds-heading--title-1');
    });

    test('Text with no variant, size, or weight uses default weight', () => {
      const { getByText } = render(<Text>Default text</Text>);
      expect(getByText('Default text')).toHaveClass('eds-text--weight-medium');
    });

    test('Link without href still renders', () => {
      const { getByText } = render(<LinkBeta>Link without href</LinkBeta>);
      expect(getByText('Link without href')).toBeInTheDocument();
    });

    test('Components handle empty children', () => {
      const { container } = render(<Heading as="h1">{''}</Heading>);
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
});
