import { cleanup, render } from '@testing-library/react';
import { Link } from '../components/Link';

afterEach(cleanup);

describe('Link Component', () => {
  test('renders as anchor by default', () => {
    const { getByText } = render(<Link href="/test">Test link</Link>);
    const link = getByText('Test link');
    expect(link.tagName).toBe('A');
    expect(link).toHaveAttribute('href', '/test');
  });

  test('renders as different element with as prop', () => {
    const { getByText } = render(
      <Link as="button" type="button">
        Button link
      </Link>,
    );
    expect(getByText('Button link').tagName).toBe('BUTTON');
  });

  test('applies spacing', () => {
    const { getByText } = render(
      <Link href="/test" spacing="lg">
        Link with spacing
      </Link>,
    );
    expect(getByText('Link with spacing')).toHaveStyle({
      '--eds-text-spacing-bottom': 'var(--spacing-lg)',
    });
  });

  test('passes through additional props', () => {
    const { getByText } = render(
      <Link href="/test" data-testid="link" target="_blank">
        Link with props
      </Link>,
    );
    const link = getByText('Link with props');
    expect(link).toHaveAttribute('data-testid', 'link');
    expect(link).toHaveAttribute('target', '_blank');
  });

  test('applies custom className', () => {
    const { getByText } = render(
      <Link href="/test" className="custom-class">
        Custom link
      </Link>,
    );
    expect(getByText('Custom link')).toHaveClass('custom-class');
  });

  test('Link without href still renders', () => {
    const { getByText } = render(<Link>Link without href</Link>);
    expect(getByText('Link without href')).toBeInTheDocument();
  });
});
