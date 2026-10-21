import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { TopNavigationItem } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

describeComponentContract('TopNavigationItem', {
  render: props => (
    <TopNavigationItem href="/journeys" {...props}>
      Journeys
    </TopNavigationItem>
  ),
  getElement: () => screen.getByText('Journeys'),
  baseClassName: 'eds-top-navigation-item',
  as: 'button',
});

test('provides a link that can be activated with Enter and the mouse', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn(event => event.preventDefault());
  render(
    <TopNavigationItem href="/journeys" onClick={onClick}>
      Journeys
    </TopNavigationItem>,
  );
  const link = screen.getByRole('link', { name: 'Journeys' });
  expect(link).toHaveAttribute('href', '/journeys');
  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.click(link);
  expect(onClick).toHaveBeenCalledTimes(2);
});

// Bug: active sets only a CSS class, leaving the current page unannounced.
test.failing(
  'marks the active link as the current page and clears it on rerender',
  () => {
    const { rerender } = render(
      <TopNavigationItem href="/journeys" active>
        Journeys
      </TopNavigationItem>,
    );
    const link = screen.getByRole('link', { name: 'Journeys' });
    expect(link).toHaveAttribute('aria-current', 'page');
    rerender(
      <TopNavigationItem href="/journeys" active={false}>
        Journeys
      </TopNavigationItem>,
    );
    expect(link).not.toHaveAttribute('aria-current');
  },
);

test('applies the active modifier only while active', () => {
  const { rerender } = render(
    <TopNavigationItem href="/journeys">Journeys</TopNavigationItem>,
  );
  const link = screen.getByRole('link', { name: 'Journeys' });
  expect(link).not.toHaveClass('eds-top-navigation-item--active');
  rerender(
    <TopNavigationItem href="/journeys" active>
      Journeys
    </TopNavigationItem>,
  );
  expect(link).toHaveClass('eds-top-navigation-item--active');
});
