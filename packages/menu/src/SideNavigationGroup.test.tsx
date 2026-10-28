import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { SideNavigation, SideNavigationGroup, SideNavigationItem } from '.';

jest.useFakeTimers();

afterEach(() => jest.clearAllTimers());

test('reveals its items when the trigger is clicked', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  render(
    <SideNavigationGroup title="My group">
      <SideNavigation>
        <SideNavigationItem href="#item">An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );
  const trigger = screen.getByRole('button', {
    name: 'My group, utvidbar meny, lukket',
  });
  expect(trigger).toHaveTextContent('My group');
  expect(
    screen.queryByRole('link', { name: 'An item' }),
  ).not.toBeInTheDocument();

  await user.click(trigger);
  act(() => {
    jest.runAllTimers();
  });

  expect(trigger).toHaveAccessibleName('My group, utvidbar meny, åpen');
  expect(screen.getByRole('link', { name: 'An item' })).toBeInTheDocument();
});

test('works as expected when controlled', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  const spy = jest.fn();
  const { rerender } = render(
    <SideNavigationGroup title="My group" open={true} onToggle={spy}>
      <SideNavigation>
        <SideNavigationItem href="#item">An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );

  act(() => {
    jest.runAllTimers();
  });

  expect(screen.getByRole('link', { name: 'An item' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: /My group/ }));

  expect(spy).toHaveBeenCalled();

  rerender(
    <SideNavigationGroup title="My group" open={false} onToggle={spy}>
      <SideNavigation>
        <SideNavigationItem href="#item">An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );

  expect(
    screen.queryByRole('link', { name: 'An item' }),
  ).not.toBeInTheDocument();
});
