import React from 'react';
import { render } from '@testing-library/react';
import { Tag } from './Tag';

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('renders with default variant neutral and size medium', () => {
  const { container } = render(<Tag>Hello</Tag>);
  const el = container.firstElementChild;
  expect(el).toHaveClass('eds-tag');
  expect(el).toHaveClass('eds-tag--variant-neutral');
  expect(el).toHaveClass('eds-tag--size-medium');
});

test('renders as a div by default', () => {
  const { container } = render(<Tag>Hello</Tag>);
  expect(container.firstElementChild?.tagName).toBe('DIV');
});

test.each([
  'primary',
  'neutral',
  'success',
  'warning',
  'negative',
  'information',
  'danger',
  'info',
] as const)('renders variant %s with correct class', variant => {
  const { container } = render(<Tag variant={variant}>Hello</Tag>);
  expect(container.firstElementChild).toHaveClass(
    `eds-tag--variant-${variant}`,
  );
});

test.each(['small', 'medium', 'large'] as const)(
  'renders size %s with correct class',
  size => {
    const { container } = render(<Tag size={size}>Hello</Tag>);
    expect(container.firstElementChild).toHaveClass(`eds-tag--size-${size}`);
  },
);

test('compact prop maps to size small and emits deprecation warning', () => {
  const { container } = render(<Tag compact>Hello</Tag>);
  expect(container.firstElementChild).toHaveClass('eds-tag--size-small');
  expect(console.warn).toHaveBeenCalledWith(expect.stringContaining('compact'));
});

test('explicit size prop wins over compact', () => {
  const { container } = render(
    <Tag compact size="large">
      Hello
    </Tag>,
  );
  expect(container.firstElementChild).toHaveClass('eds-tag--size-large');
  expect(container.firstElementChild).not.toHaveClass('eds-tag--size-small');
});

test('as prop changes rendered element', () => {
  const { container } = render(<Tag as="span">Hello</Tag>);
  expect(container.firstElementChild?.tagName).toBe('SPAN');
});

test('leading icon detection adds correct class', () => {
  const { container } = render(
    <Tag>
      <svg data-testid="icon" />
      Label
    </Tag>,
  );
  expect(container.firstElementChild).toHaveClass('eds-tag--leading-icon');
  expect(container.firstElementChild).not.toHaveClass('eds-tag--trailing-icon');
});

test('trailing icon detection adds correct class', () => {
  const { container } = render(
    <Tag>
      Label
      <svg data-testid="icon" />
    </Tag>,
  );
  expect(container.firstElementChild).toHaveClass('eds-tag--trailing-icon');
  expect(container.firstElementChild).not.toHaveClass('eds-tag--leading-icon');
});

test('forwards ref correctly', () => {
  const ref = React.createRef<HTMLDivElement>();
  render(<Tag ref={ref}>Hello</Tag>);
  expect(ref.current).toBeInstanceOf(HTMLDivElement);
});

test('passes through extra props', () => {
  const { getByTestId } = render(<Tag data-testid="my-tag">Hello</Tag>);
  expect(getByTestId('my-tag')).toBeInTheDocument();
});

test('passes through extra className', () => {
  const { container } = render(<Tag className="extra">Hello</Tag>);
  expect(container.firstElementChild).toHaveClass('eds-tag');
  expect(container.firstElementChild).toHaveClass('extra');
});
