import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MediaCard } from './MediaCard';

test('MediaCard keeps media and description outside its keyboard-activated title link', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn(event => event.preventDefault());
  render(
    <>
      <MediaCard
        title="Explore Oslo"
        href="/oslo"
        category="City guide"
        description="Travel around the city"
        headingLevel="h3"
        onClick={onClick}
        wrapperProps={{ role: 'region', 'aria-label': 'Oslo guide' }}
      >
        <img src="/oslo.jpg" alt="Oslo skyline" />
      </MediaCard>
      <a href="/more">More guides</a>
    </>,
  );

  const region = screen.getByRole('region', { name: 'Oslo guide' });
  const link = within(region).getByRole('link', { name: 'Explore Oslo' });
  expect(within(region).getByRole('heading', { level: 3 })).toContainElement(
    link,
  );
  expect(
    within(region).getByRole('img', { name: 'Oslo skyline' }),
  ).toBeInTheDocument();
  expect(within(region).getByText('City guide')).toBeInTheDocument();
  expect(
    within(region).getByText('Travel around the city'),
  ).toBeInTheDocument();
  expect(link).toHaveAttribute('href', '/oslo');
  expect(within(link).queryByRole('img')).not.toBeInTheDocument();

  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.tab();
  expect(screen.getByRole('link', { name: 'More guides' })).toHaveFocus();
});

test('MediaCard without a description renders a button title without a heading', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(<MediaCard as="button" title="Choose Oslo" onClick={onClick} />);

  expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Choose Oslo' })).toHaveFocus();
  await user.keyboard('{Enter} ');
  expect(onClick).toHaveBeenCalledTimes(2);
});

test('MediaCard puts className and style on the card and rest props on the title link', () => {
  render(
    <MediaCard
      title="Explore Oslo"
      href="/oslo"
      className="consumer-class"
      style={{ marginTop: '7px' }}
      data-consumer="value"
      wrapperProps={{ role: 'region', 'aria-label': 'Oslo guide' }}
    />,
  );

  const card = screen.getByRole('region', { name: 'Oslo guide' });
  expect(card).toHaveClass('eds-base-card', 'eds-media-card', 'consumer-class');
  expect(card).toHaveStyle({ marginTop: '7px' });
  expect(card).not.toHaveAttribute('data-consumer');
  expect(screen.getByRole('link', { name: 'Explore Oslo' })).toHaveAttribute(
    'data-consumer',
    'value',
  );
});

test('MediaCard with wholeCardAsElement forwards rest props to the card', () => {
  render(
    <MediaCard
      title="Explore Oslo"
      wholeCardAsElement
      data-consumer="value"
      wrapperProps={{ role: 'region', 'aria-label': 'Oslo guide' }}
    />,
  );

  expect(screen.getByRole('region', { name: 'Oslo guide' })).toHaveAttribute(
    'data-consumer',
    'value',
  );
});

test('MediaCard adds the horizontal modifier only for horizontal orientation', () => {
  const wrapperProps = { role: 'region', 'aria-label': 'Oslo guide' };
  const { rerender } = render(
    <MediaCard title="Explore Oslo" href="/oslo" wrapperProps={wrapperProps} />,
  );
  const card = screen.getByRole('region', { name: 'Oslo guide' });
  expect(card).not.toHaveClass('eds-media-card--horizontal');

  rerender(
    <MediaCard
      title="Explore Oslo"
      href="/oslo"
      orientation="horizontal"
      wrapperProps={wrapperProps}
    />,
  );
  expect(card).toHaveClass('eds-media-card--horizontal');
});

test('MediaCard renders its arrow icon unless hideArrow is set', () => {
  const wrapperProps = { role: 'region', 'aria-label': 'Oslo guide' };
  const { rerender } = render(
    <MediaCard title="Explore Oslo" href="/oslo" wrapperProps={wrapperProps} />,
  );
  const card = screen.getByRole('region', { name: 'Oslo guide' });
  // The arrow is aria-hidden, so only its class identifies it.
  expect(card.querySelector('.eds-media-card__arrow-icon')).toBeInTheDocument();

  rerender(
    <MediaCard
      title="Explore Oslo"
      href="/oslo"
      hideArrow
      wrapperProps={wrapperProps}
    />,
  );
  expect(
    card.querySelector('.eds-media-card__arrow-icon'),
  ).not.toBeInTheDocument();
});
