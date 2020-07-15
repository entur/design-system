import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import {
  CollapsibleSideNavigation,
  SideNavigationItem,
  SideNavigationGroup,
} from '.';

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
  expect(getByText('Group item')).toBeInTheDocument();
  fireEvent.click(getAllByRole('button')[1]);
  await waitFor(() => {
    expect(queryByText('Group item')).not.toBeInTheDocument();
    expect(queryByText('First item')).not.toBeInTheDocument();
  });
});

test('renders a collapsible sidenavigation, closes it, and opens through the SideNavigationGroup', async () => {
  const { queryByText, getAllByRole } = render(
    <CollapsibleSideNavigation>
      <SideNavigationItem href="#first">First item</SideNavigationItem>
      <SideNavigationGroup title="Grouptrigger">
        <SideNavigationItem href="#first">Group item</SideNavigationItem>
      </SideNavigationGroup>
    </CollapsibleSideNavigation>,
  );
  const groupItem = queryByText('Group item');
  fireEvent.click(getAllByRole('button')[1]);
  await waitFor(() => {
    expect(groupItem).not.toBeInTheDocument();
  });

  fireEvent.click(getAllByRole('button')[0]);
  await waitFor(() => {
    expect(queryByText('Group item')).toBeInTheDocument();
  });
});
