import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describeComponentContract } from '../../../tests/jest/componentContract';
import { NavigationCard } from './NavigationCard';

describeComponentContract('NavigationCard', {
  render: props => <NavigationCard title="Journeys" href="/" {...props} />,
  getElement: () => screen.getByRole('link', { name: 'Journeys' }),
  baseClassName: 'eds-navigation-card',
});

test('NavigationCard renders as the element given by as', () => {
  render(<NavigationCard as="button" title="Journeys" />);

  expect(screen.getByRole('button', { name: 'Journeys' })).toHaveClass(
    'eds-base-card',
    'eds-navigation-card',
  );
});

test('NavigationCard adds compact modifier classes only in compact mode', () => {
  const { rerender } = render(<NavigationCard title="Journeys" href="/" />);
  const card = screen.getByRole('link', { name: 'Journeys' });
  expect(card).not.toHaveClass('eds-navigation-card--compact');
  expect(card).not.toHaveClass('eds-base-card--red-line');

  rerender(<NavigationCard title="Journeys" href="/" compact />);
  expect(card).toHaveClass(
    'eds-navigation-card--compact',
    'eds-base-card--red-line',
  );
});

test('NavigationCard exposes its content as one keyboard-activated link', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn(event => event.preventDefault());
  render(
    <NavigationCard
      title="Journeys"
      href="/journeys"
      titleIcon={<svg role="img" aria-label="Decorative train" />}
      onClick={onClick}
    >
      Plan your journey
    </NavigationCard>,
  );

  const link = screen.getByRole('link', { name: 'Journeys Plan your journey' });
  expect(link).toHaveAttribute('href', '/journeys');
  expect(screen.queryByRole('img')).not.toBeInTheDocument();
  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('NavigationCard supports native button keys and skips disabled cards', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <>
      <NavigationCard
        as="button"
        title="Unavailable"
        disabled
        onClick={onClick}
      />
      <NavigationCard as="button" title="Choose journey" onClick={onClick} />
    </>,
  );

  await user.tab();
  expect(screen.getByRole('button', { name: 'Choose journey' })).toHaveFocus();
  await user.keyboard('{Enter} ');
  expect(onClick).toHaveBeenCalledTimes(2);
  await user.click(screen.getByRole('button', { name: 'Unavailable' }));
  expect(onClick).toHaveBeenCalledTimes(2);
});

test('NavigationCard omits its description in compact mode', () => {
  render(
    <NavigationCard title="Journeys" href="/journeys" compact>
      Plan your journey
    </NavigationCard>,
  );

  expect(screen.getByRole('link', { name: 'Journeys' })).toBeInTheDocument();
  expect(screen.queryByText('Plan your journey')).not.toBeInTheDocument();
});

// Bug: NavigationCard renders titleIcon unconditionally, contrary to the compact contract.
test.failing('NavigationCard omits its title icon in compact mode', () => {
  render(
    <NavigationCard
      title="Journeys"
      href="/journeys"
      compact
      titleIcon={
        <svg>
          <title>Train icon</title>
        </svg>
      }
    />,
  );

  expect(screen.queryByTitle('Train icon')).not.toBeInTheDocument();
});
