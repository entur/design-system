import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { SideNavigation, SideNavigationItem, SideNavigationGroup } from '.';

test('renders a nice looking menu group', () => {
  const { getByRole, queryByText, getByText } = render(
    <SideNavigationGroup title="My group">
      <SideNavigation>
        <SideNavigationItem>An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );
  const trigger = getByRole('button');
  expect(getByRole('button')).toHaveTextContent('My group');
  expect(queryByText('An item')).not.toBeInTheDocument();

  fireEvent.click(trigger);

  expect(getByText('An item')).toBeInTheDocument();
});

test('works as expected when controlled', () => {
  const spy = jest.fn();
  const { getByRole, getByText, queryByText, rerender } = render(
    <SideNavigationGroup title="My group" open={true} onToggle={spy}>
      <SideNavigation>
        <SideNavigationItem>An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );
  const trigger = getByRole('button');
  expect(getByText('An item')).toBeInTheDocument();

  fireEvent.click(trigger);

  expect(spy).toHaveBeenCalled();

  rerender(
    <SideNavigationGroup title="My group" open={false} onToggle={spy}>
      <SideNavigation>
        <SideNavigationItem>An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );

  expect(queryByText('An item')).not.toBeInTheDocument();
});
