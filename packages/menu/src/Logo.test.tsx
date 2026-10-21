import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Logo } from './Logo';
import { describeComponentContract } from '../../../tests/jest/componentContract';

describeComponentContract('Logo', {
  render: props => <Logo {...props} />,
  getElement: ({ container }) => container.firstChild as HTMLElement,
  baseClassName: 'eds-logo',
  refElement: HTMLDivElement,
  as: 'nav',
});

test('identifies the Entur brand without a home link by default', () => {
  render(<Logo />);

  expect(screen.getByRole('img', { name: 'Entur logo' })).toBeInTheDocument();
  expect(screen.queryByRole('link')).not.toBeInTheDocument();
});

test('names the product home link once and activates it by mouse', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn(event => event.preventDefault());
  render(<Logo productName="Tavla" href="/" onClick={onClick} />);

  const home = screen.getByRole('link', { name: 'Entur Tavla logo' });
  expect(home).toHaveAttribute('href', '/');
  expect(screen.getByText('Tavla')).toBeVisible();
  expect(screen.getByText('Tavla')).toHaveAttribute('aria-hidden', 'true');
  expect(
    screen.getByRole('img', { name: 'Entur Tavla logo' }),
  ).toBeInTheDocument();

  await user.click(home);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('focuses and activates the home link by keyboard', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn(event => event.preventDefault());
  render(<Logo href="/" onClick={onClick} />);

  const home = screen.getByRole('link', { name: 'Entur logo' });
  expect(home).toHaveAttribute('href', '/');

  await user.tab();
  expect(home).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('defaults to the medium size modifier', () => {
  const { container } = render(<Logo />);
  expect(container.firstChild).toHaveClass('eds-logo--medium');
});

test('applies the small size modifier', () => {
  const { container } = render(<Logo size="small" />);
  expect(container.firstChild).toHaveClass('eds-logo--small');
  expect(container.firstChild).not.toHaveClass('eds-logo--medium');
});

test('omits the product name when not provided', () => {
  const { container } = render(<Logo />);
  expect(
    container.querySelector('.eds-logo__product-name'),
  ).not.toBeInTheDocument();
});
