import { render } from '@testing-library/react';
import { TextContainer } from '../components/TextContainer';
import { Heading } from '../components/Heading';
import { Text } from '../components/Text';

describe('TextContainer Component', () => {
  test('renders a div with its children', () => {
    const { getByTestId, getByText } = render(
      <TextContainer data-testid="container">
        <Heading as="h2">Tittel</Heading>
        <Text>Avsnitt</Text>
      </TextContainer>,
    );
    const container = getByTestId('container');
    expect(container.tagName).toBe('DIV');
    expect(container).toHaveClass('eds-text-container');
    expect(container).toContainElement(getByText('Avsnitt'));
  });

  test('renders as another element and forwards the ref', () => {
    const ref = { current: null as Element | null };
    const { container } = render(
      <TextContainer as="article" ref={ref} className="custom" />,
    );
    expect(container.firstChild?.nodeName).toBe('ARTICLE');
    expect(container.firstChild).toHaveClass('custom');
    expect(ref.current).toBe(container.firstChild);
  });

  test('applies spacing to itself', () => {
    const { container } = render(<TextContainer spacing={{ bottom: '3xl' }} />);
    expect(container.firstChild).toHaveStyle({
      '--eds-text-spacing-bottom': 'var(--spacing-3xl)',
    });
  });
});
