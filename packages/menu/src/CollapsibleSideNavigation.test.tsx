import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react';
import {
  CollapsibleSideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
} from '.';

jest.useFakeTimers();

afterEach(() => jest.clearAllTimers());

const OPEN_ANIMATION_TIME = 200;
const CLOSE_ANIMATION_TIME = 200;

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
  expect(queryByText('Group item')).not.toBeInTheDocument();
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
  const { queryByRole, queryByText, getAllByRole } = render(
    <CollapsibleSideNavigation>
      <SideNavigationItem href="#first">First item</SideNavigationItem>
      <SideNavigationGroup title="Grouptrigger">
        <SideNavigationItem href="#first">Group item</SideNavigationItem>
      </SideNavigationGroup>
    </CollapsibleSideNavigation>,
  );
  const groupItem = queryByText('Group item');
  fireEvent.click(getAllByRole('button')[1]);
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  await waitFor(() => {
    expect(groupItem).not.toBeInTheDocument();
  });

  fireEvent.click(getAllByRole('button')[0]);
  act(() => {
    jest.advanceTimersByTime(OPEN_ANIMATION_TIME);
  });
  await waitFor(() => {
    expect(queryByRole('link', { name: 'Group item' })).toBeInTheDocument();
  });
});
