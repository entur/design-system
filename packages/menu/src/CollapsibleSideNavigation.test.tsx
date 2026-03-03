import React from 'react';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import {
  CollapsibleSideNavigation,
  SideNavigationGroup,
  SideNavigationItem,
} from '.';

jest.useFakeTimers();

afterEach(() => jest.clearAllTimers());

const OPEN_ANIMATION_TIME = 200;
const CLOSE_ANIMATION_TIME = 50;

test('renders a collapsible sidenavigation, and closes it and the SideNavigationGroup', async () => {
  const { getByText, queryByText, getAllByRole } = render(
    <CollapsibleSideNavigation>
      <SideNavigationItem href="#first">First item</SideNavigationItem>
      <SideNavigationGroup title="Grouptrigger">
        <SideNavigationItem href="#first">Group item</SideNavigationItem>
      </SideNavigationGroup>
    </CollapsibleSideNavigation>,
  );

  expect(getByText('First item')).toBeInTheDocument();
  // Group is closed — content is in DOM but hidden via aria-hidden
  expect(getByText('Group item').closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  expect(queryByText('Grouptrigger')).toBeInTheDocument();
  fireEvent.click(getByText('Grouptrigger'));
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  expect(getByText('Group item')).toBeInTheDocument();
  fireEvent.click(getAllByRole('button')[1]);
  act(() => {
    jest.advanceTimersByTime(CLOSE_ANIMATION_TIME);
  });
  await waitFor(() => {
    expect(queryByText('Group item')).not.toBeInTheDocument();
    expect(queryByText('First item')).not.toBeInTheDocument();
  });
});

test('renders a collapsible sidenavigation, closes it, and opens through the SideNavigationGroup', async () => {
  const { queryByRole, queryByText, getAllByRole, getByText } = render(
    <CollapsibleSideNavigation>
      <SideNavigationItem href="#first">First item</SideNavigationItem>
      <SideNavigationGroup title="Grouptrigger">
        <SideNavigationItem href="#first">Group item</SideNavigationItem>
      </SideNavigationGroup>
    </CollapsibleSideNavigation>,
  );
  // Flush initial useShowDelayedLabel timeouts so they don't race with collapse timeouts
  act(() => {
    jest.runAllTimers();
  });
  // Group is closed — content is in DOM but hidden via aria-hidden
  expect(getByText('Group item').closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  fireEvent.click(getAllByRole('button')[1]);
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  // After sidebar collapse, text is removed from SideNavigationItems by showLabel
  await waitFor(() => {
    expect(queryByText('Group item')).not.toBeInTheDocument();
  });

  fireEvent.click(getAllByRole('button')[0]);
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  await waitFor(() => {
    expect(queryByRole('link', { name: 'Group item' })).toBeInTheDocument();
  });
});
