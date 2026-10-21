import { render, screen } from '@testing-library/react';
import { describeComponentContract } from '../../../../tests/jest/componentContract';
import { Badge } from './Badge';
import { NotificationBadge } from './NotificationBadge';
import { BulletBadge } from './BulletBadge';

describeComponentContract('NotificationBadge', {
  render: props => (
    <NotificationBadge variant="information" {...props}>
      {3}
    </NotificationBadge>
  ),
  getElement: () => screen.getByText('3'),
  baseClassName: 'eds-badge',
  refElement: HTMLSpanElement,
  as: 'div',
});

describeComponentContract('BulletBadge', {
  render: props => (
    <BulletBadge variant="success" {...props}>
      On time
    </BulletBadge>
  ),
  getElement: () => screen.getByText('On time'),
  baseClassName: 'eds-badge',
  refElement: HTMLSpanElement,
  as: 'div',
});

test.each([
  { count: 99, max: undefined, expected: '99' },
  { count: 100, max: undefined, expected: '99+' },
  { count: 5, max: 5, expected: '5' },
  { count: 6, max: 5, expected: '5+' },
])(
  'NotificationBadge caps $count at $max as $expected',
  ({ count, max, expected }) => {
    render(
      <NotificationBadge variant="information" max={max}>
        {count}
      </NotificationBadge>,
    );
    expect(screen.getByText(expected, { exact: true })).toBeInTheDocument();
  },
);

test('Badge wrappers set their type and variant classes', () => {
  render(
    <>
      <NotificationBadge variant="negative">{3}</NotificationBadge>
      <BulletBadge variant="success">On time</BulletBadge>
    </>,
  );

  expect(screen.getByText('3')).toHaveClass(
    'eds-badge--type-notification',
    'eds-badge--variant-negative',
  );
  expect(screen.getByText('On time')).toHaveClass(
    'eds-badge--type-bullet',
    'eds-badge--variant-success',
  );
});

type VisibilityProps = {
  count: number | null | undefined;
  showZero?: boolean;
  hide?: boolean;
  invisible?: boolean;
};

function VisibilityBadge({ count, ...props }: VisibilityProps) {
  return (
    <Badge
      type="notification"
      variant="information"
      data-testid="badge"
      {...props}
    >
      {count}
    </Badge>
  );
}

test('Badge visibility follows zero counts, showZero and hide precedence', () => {
  const { rerender } = render(<VisibilityBadge count={0} />);
  const badge = screen.getByTestId('badge');

  expect(badge).toHaveTextContent('0');
  expect(badge).toHaveClass('eds-badge--hide');
  rerender(<VisibilityBadge count={0} showZero />);
  expect(badge).not.toHaveClass('eds-badge--hide');
  expect(badge).toHaveClass('eds-badge--show-zero');
  rerender(<VisibilityBadge count={0} showZero hide />);
  expect(badge).toHaveClass('eds-badge--hide');
  rerender(<VisibilityBadge count={0} showZero />);
  expect(badge).not.toHaveClass('eds-badge--hide');
  rerender(<VisibilityBadge count={0} />);
  expect(badge).toHaveClass('eds-badge--hide');

  rerender(<VisibilityBadge count={3} />);
  expect(badge).toHaveTextContent('3');
  expect(badge).not.toHaveClass('eds-badge--hide');
  rerender(<VisibilityBadge count={3} hide />);
  expect(badge).toHaveClass('eds-badge--hide');
  rerender(<VisibilityBadge count={3} />);
  expect(badge).not.toHaveClass('eds-badge--hide');
});

test('Badge restores visibility after invisible and missing counts are cleared', () => {
  const { rerender } = render(<VisibilityBadge count={3} />);
  const badge = screen.getByTestId('badge');

  rerender(<VisibilityBadge count={3} invisible />);
  expect(badge).toHaveClass('eds-badge--hide');
  rerender(<VisibilityBadge count={3} />);
  expect(badge).not.toHaveClass('eds-badge--hide');

  for (const missingCount of [null, undefined]) {
    rerender(<VisibilityBadge count={missingCount} showZero />);
    expect(badge).toHaveTextContent('');
    expect(badge).toHaveClass('eds-badge--hide');
    rerender(<VisibilityBadge count={3} showZero />);
    expect(badge).toHaveTextContent('3');
    expect(badge).not.toHaveClass('eds-badge--hide');
  }
});
