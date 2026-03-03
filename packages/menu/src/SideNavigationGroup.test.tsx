import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';

import { SideNavigation, SideNavigationItem, SideNavigationGroup } from '.';

jest.useFakeTimers();

afterEach(() => jest.clearAllTimers());

test('renders a nice looking menu group', () => {
  const { getByRole, getByText } = render(
    <SideNavigationGroup title="My group">
      <SideNavigation>
        <SideNavigationItem>An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );
  const trigger = getByRole('button');
  expect(getByRole('button')).toHaveTextContent('My group');
  // Content is in DOM but hidden via aria-hidden when group is closed
  expect(getByText('An item').closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  fireEvent.click(trigger);
  act(() => {
    jest.runAllTimers();
  });

  expect(getByText('An item')).toBeInTheDocument();
  expect(getByText('An item').closest('.eds-base-expand')).not.toHaveAttribute(
    'aria-hidden',
  );
});

test('works as expected when controlled', () => {
  const spy = jest.fn();
  const { getByRole, getByText, rerender } = render(
    <SideNavigationGroup title="My group" open={true} onToggle={spy}>
      <SideNavigation>
        <SideNavigationItem>An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );

  act(() => {
    jest.runAllTimers();
  });

  const trigger = getByRole('button');
  expect(getByText('An item')).toBeInTheDocument();
  expect(getByText('An item').closest('.eds-base-expand')).not.toHaveAttribute(
    'aria-hidden',
  );

  fireEvent.click(trigger);

  expect(spy).toHaveBeenCalled();

  rerender(
    <SideNavigationGroup title="My group" open={false} onToggle={spy}>
      <SideNavigation>
        <SideNavigationItem>An item</SideNavigationItem>
      </SideNavigation>
    </SideNavigationGroup>,
  );

  // Content stays in DOM but is hidden via aria-hidden
  expect(getByText('An item').closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
});
