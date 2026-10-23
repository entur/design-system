import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Link } from '..';
import { describeComponentContract } from '../../../../../tests/jest/componentContract';

describeComponentContract('Link', {
  render: props => (
    <Link href="/tickets" {...props}>
      Content
    </Link>
  ),
  getElement: () => screen.getByText('Content'),
  baseClassName: 'eds-text--link',
  as: 'button',
});

test('links can be reached and activated by keyboard', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn(event => event.preventDefault());
  render(
    <Link href="/tickets" onClick={onClick}>
      Buy tickets
    </Link>,
  );

  const link = screen.getByRole('link', { name: 'Buy tickets' });
  expect(link).toHaveAttribute('href', '/tickets');
  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('includes the default or translated external indicator in the link name', () => {
  const { rerender } = render(
    <Link href="https://entur.no" external>
      Journey planner
    </Link>,
  );
  expect(
    screen.getByRole('link', { name: 'Journey planner (ekstern lenke)' }),
  ).toHaveAttribute('href', 'https://entur.no');

  rerender(
    <Link
      href="https://entur.no"
      external
      ariaLabelExternalIcon="(external link)"
    >
      Journey planner
    </Link>,
  );
  expect(
    screen.getByRole('link', { name: 'Journey planner (external link)' }),
  ).toBeInTheDocument();
});

test('supports button semantics and keyboard activation through as', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <Link as="button" type="button" onClick={onClick}>
      Show details
    </Link>,
  );

  const button = screen.getByRole('button', { name: 'Show details' });
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('does not expose a link or keyboard stop without a destination', async () => {
  const user = userEvent.setup();
  render(
    <>
      <Link>Unavailable destination</Link>
      <Link href="/tickets">Buy tickets</Link>
    </>,
  );

  expect(screen.getByText('Unavailable destination')).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: 'Unavailable destination' }),
  ).not.toBeInTheDocument();
  await user.tab();
  expect(screen.getByRole('link', { name: 'Buy tickets' })).toHaveFocus();
});

test('applies the spacing modifier', () => {
  render(
    <Link href="/tickets" spacing="lg">
      Content
    </Link>,
  );
  expect(screen.getByRole('link', { name: 'Content' })).toHaveClass(
    'eds-text--link--spacing-lg',
  );
});
