import { cleanup, render } from '@testing-library/react';
import { Blockquote, BlockquoteFooter } from '../components/Blockquote';

afterEach(cleanup);

describe('Blockquote Component', () => {
  test('renders blockquote element', () => {
    const { getByText } = render(<Blockquote>Test quote</Blockquote>);
    const blockquote = getByText('Test quote');
    expect(blockquote.tagName).toBe('BLOCKQUOTE');
    expect(blockquote).toHaveClass('eds-text--blockquote');
  });

  test('passes through additional props', () => {
    const { getByText } = render(
      <Blockquote data-testid="quote" cite="/source">
        Quote with props
      </Blockquote>,
    );
    const blockquote = getByText('Quote with props');
    expect(blockquote).toHaveAttribute('data-testid', 'quote');
    expect(blockquote).toHaveAttribute('cite', '/source');
  });

  test('applies custom className', () => {
    const { getByText } = render(
      <Blockquote className="custom-class">Custom quote</Blockquote>,
    );
    expect(getByText('Custom quote')).toHaveClass('custom-class');
  });
});

describe('BlockquoteFooter Component', () => {
  test('renders footer element', () => {
    const { getByText } = render(
      <BlockquoteFooter>Footer text</BlockquoteFooter>,
    );
    const footer = getByText('Footer text');
    expect(footer.tagName).toBe('FOOTER');
    expect(footer).toHaveClass('eds-text--blockquote__footer');
  });

  test('passes through additional props', () => {
    const { getByText } = render(
      <BlockquoteFooter data-testid="footer">
        Footer with props
      </BlockquoteFooter>,
    );
    expect(getByText('Footer with props')).toHaveAttribute(
      'data-testid',
      'footer',
    );
  });

  test('applies custom className', () => {
    const { getByText } = render(
      <BlockquoteFooter className="custom-class">
        Custom footer
      </BlockquoteFooter>,
    );
    expect(getByText('Custom footer')).toHaveClass('custom-class');
  });
});
