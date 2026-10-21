import { render, screen } from '@testing-library/react';
import { Blockquote, BlockquoteFooter, Text } from '..';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';

describeComponentContract('Blockquote', {
  render: props => <Blockquote {...props}>Content</Blockquote>,
  getElement: () => screen.getByText('Content'),
  baseClassName: 'eds-text--blockquote',
});

describeComponentContract('BlockquoteFooter', {
  render: props => <BlockquoteFooter {...props}>Content</BlockquoteFooter>,
  getElement: () => screen.getByText('Content'),
  baseClassName: 'eds-text--blockquote__footer',
});

test('keeps a quotation and its cited source together', () => {
  render(
    <Blockquote cite="https://entur.no">
      <Text>Travel together</Text>
      <BlockquoteFooter>
        <cite>Entur travel guide</cite>
      </BlockquoteFooter>
    </Blockquote>,
  );

  const quote = screen.getByText('Travel together').closest('blockquote');
  expect(quote).toHaveAttribute('cite', 'https://entur.no');
  const citation = screen.getByText('Entur travel guide');
  expect(citation.tagName).toBe('CITE');
  expect(citation.parentElement?.tagName).toBe('FOOTER');
  expect(quote).toContainElement(citation);
});
