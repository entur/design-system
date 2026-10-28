import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  CollapsibleSideNavigation,
  SideNavigationGroup,
  SideNavigationItem,
} from '.';

jest.useFakeTimers();

afterEach(() => jest.clearAllTimers());

const OPEN_ANIMATION_TIME = 200;
const CLOSE_ANIMATION_TIME = 50;

const renderNavigation = () =>
  render(
    <CollapsibleSideNavigation>
      <SideNavigationItem href="#first">First item</SideNavigationItem>
      <SideNavigationGroup title="Grouptrigger">
        <SideNavigationItem href="#first">Group item</SideNavigationItem>
      </SideNavigationGroup>
    </CollapsibleSideNavigation>,
  );

test('opens a group, then collapses the side navigation and its labels', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  renderNavigation();

  expect(screen.getByRole('link', { name: 'First item' })).toBeInTheDocument();
  expect(
    screen.queryByRole('link', { name: 'Group item' }),
  ).not.toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: /Grouptrigger, utvidbar meny/ }),
  );
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  expect(screen.getByRole('link', { name: 'Group item' })).toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Lukk sidemeny' }));
  act(() => {
    jest.advanceTimersByTime(CLOSE_ANIMATION_TIME);
  });
  await waitFor(() => {
    expect(screen.queryByText('Group item')).not.toBeInTheDocument();
    expect(screen.queryByText('First item')).not.toBeInTheDocument();
  });
});

test('collapses the side navigation and reopens it through the group trigger', async () => {
  const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
  renderNavigation();
  // Flush initial useShowDelayedLabel timeouts so they don't race with collapse timeouts
  act(() => {
    jest.runAllTimers();
  });
  expect(
    screen.queryByRole('link', { name: 'Group item' }),
  ).not.toBeInTheDocument();

  await user.click(screen.getByRole('button', { name: 'Lukk sidemeny' }));
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  // After sidebar collapse, text is removed from SideNavigationItems by showLabel
  await waitFor(() => {
    expect(screen.queryByText('Group item')).not.toBeInTheDocument();
  });

  await user.click(
    screen.getByRole('button', { name: /Grouptrigger, utvidbar meny/ }),
  );
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  await waitFor(() => {
    expect(
      screen.getByRole('link', { name: 'Group item' }),
    ).toBeInTheDocument();
  });
});
