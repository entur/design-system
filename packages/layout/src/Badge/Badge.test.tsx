import React from 'react';
import { render } from '@testing-library/react';
import { Badge } from './Badge';

beforeEach(() => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  jest.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  jest.restoreAllMocks();
});

test('Badge without explicit type triggers default-change warning', () => {
  render(<Badge variant="neutral">Hello</Badge>);
  expect(console.warn).toHaveBeenCalledWith(
    expect.stringContaining('will change to type="notification"'),
  );
});

test('Badge with type="status" triggers deprecation warning', () => {
  render(
    <Badge variant="neutral" type="status">
      Hello
    </Badge>,
  );
  expect(console.warn).toHaveBeenCalledWith(
    expect.stringContaining('type="status" is deprecated'),
  );
});

test('Badge with type="notification" does not warn', () => {
  render(
    <Badge variant="primary" type="notification">
      5
    </Badge>,
  );
  expect(console.warn).not.toHaveBeenCalled();
});

test('Badge with type="bullet" does not warn', () => {
  render(
    <Badge variant="primary" type="bullet">
      Active
    </Badge>,
  );
  expect(console.warn).not.toHaveBeenCalled();
});

test('Badge type="status" renders Tag internally', () => {
  const { container } = render(
    <Badge variant="success" type="status">
      Active
    </Badge>,
  );
  const el = container.firstElementChild;
  expect(el).toHaveClass('eds-tag');
  expect(el).toHaveClass('eds-tag--variant-success');
  expect(el).not.toHaveClass('eds-badge');
});

test('Badge without explicit type renders Tag (default is status)', () => {
  const { container } = render(<Badge variant="neutral">Label</Badge>);
  const el = container.firstElementChild;
  expect(el).toHaveClass('eds-tag');
});

test('Badge type="notification" renders as badge', () => {
  const { container } = render(
    <Badge variant="primary" type="notification">
      3
    </Badge>,
  );
  const el = container.firstElementChild;
  expect(el).toHaveClass('eds-badge');
  expect(el).toHaveClass('eds-badge--type-notification');
});

test('Badge type="status" passes size to Tag', () => {
  const { container } = render(
    <Badge variant="neutral" type="status" size="large">
      Big
    </Badge>,
  );
  expect(container.firstElementChild).toHaveClass('eds-tag--size-large');
});

test('Badge type="status" forwards ref', () => {
  const ref = React.createRef<HTMLSpanElement>();
  render(
    <Badge variant="neutral" type="status" ref={ref}>
      Ref
    </Badge>,
  );
  expect(ref.current).toBeInstanceOf(HTMLSpanElement);
});
