import React from 'react';
import { render } from '@testing-library/react';
import { SideNavigation, SideNavigationItem } from '.';

test('renders a single-level menu without issues', () => {
  const { getByText } = render(
    <SideNavigation>
      <SideNavigationItem href="#first">First item</SideNavigationItem>
      <SideNavigationItem href="#second">Second item</SideNavigationItem>
    </SideNavigation>,
  );

  expect(getByText('First item')).toBeInTheDocument();
  expect(getByText('Second item')).toBeInTheDocument();

  expect(getByText('First item')).toHaveAttribute('href', '#first');
  expect(getByText('Second item')).toHaveAttribute('href', '#second');

  expect(getByText('First item').nodeName).toBe('A');
});

test('renders a multi-level menu', () => {
  const { queryByText, rerender } = render(
    <SideNavigation>
      <SideNavigationItem href="#">Top level</SideNavigationItem>
      <SideNavigationItem href="#first">
        Sub-menu trigger
        <SideNavigation>
          <SideNavigationItem href="#second">Sub-menu item</SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
    </SideNavigation>,
  );

  expect(queryByText('Sub-menu item')).not.toBeInTheDocument();

  rerender(
    <SideNavigation>
      <SideNavigationItem href="#">Top level</SideNavigationItem>
      <SideNavigationItem href="#first" active>
        Sub-menu trigger
        <SideNavigation>
          <SideNavigationItem href="#second">Sub-menu item</SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
    </SideNavigation>,
  );

  expect(queryByText('Sub-menu item')).toBeInTheDocument();
});

test('renders the sub-menu if a sub-menu item is set to active', () => {
  const { getByText } = render(
    <SideNavigation>
      <SideNavigationItem href="#">Top level</SideNavigationItem>
      <SideNavigationItem href="#first">
        Sub-menu trigger
        <SideNavigation>
          <SideNavigationItem href="#second" active>
            Sub-menu item
          </SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
    </SideNavigation>,
  );

  expect(getByText('Sub-menu item')).toBeInTheDocument();
});

test('renders a small menu if the small flag is set', () => {
  const { container } = render(
    <SideNavigation size="small">
      <SideNavigationItem href="#">Top level</SideNavigationItem>
      <SideNavigationItem>
        Sub-menu trigger
        <SideNavigation>
          <SideNavigationItem href="#second">Sub-menu item</SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
    </SideNavigation>,
  );

  expect(container.querySelector('.eds-side-navigation')).toHaveClass(
    'eds-side-navigation--small',
  );
});

test('menu items are disabled if specified', () => {
  const { getByText } = render(
    <SideNavigation size="small">
      <SideNavigationItem href="#" disabled={true}>
        Disabled item
      </SideNavigationItem>
      <SideNavigationItem href="#">Second item</SideNavigationItem>
    </SideNavigation>,
  );

  expect(getByText('Disabled item')).toBeDisabled();
});

test('forceExpandSubMenus works as expected without active items', () => {
  const { getByTestId, queryByTestId, rerender } = render(
    <SideNavigation size="small">
      <SideNavigationItem forceExpandSubMenus={true}>
        Sub-menu trigger
        <SideNavigation>
          <SideNavigationItem href="#second" data-testid="sub-menu-item">
            Sub-menu item
          </SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
      <SideNavigationItem forceExpandSubMenus={true}>
        Active sub-menu trigger
        <SideNavigation>
          <SideNavigationItem
            href="#second"
            data-testid="active-sub-menu-item"
            active={true}
          >
            Active sub-menu item
          </SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
    </SideNavigation>,
  );

  expect(getByTestId('sub-menu-item')).toBeInTheDocument();
  expect(getByTestId('active-sub-menu-item')).toBeInTheDocument();
  rerender(
    <SideNavigation size="small">
      <SideNavigationItem forceExpandSubMenus={false} href="#first">
        Sub-menu trigger
        <SideNavigation>
          <SideNavigationItem href="#second" data-testid="sub-menu-item">
            Sub-menu item
          </SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
      <SideNavigationItem forceExpandSubMenus={false} href="#first">
        Active sub-menu trigger
        <SideNavigation>
          <SideNavigationItem
            href="#second"
            data-testid="active-sub-menu-item"
            active={true}
          >
            Active sub-menu item
          </SideNavigationItem>
        </SideNavigation>
      </SideNavigationItem>
    </SideNavigation>,
  );
  expect(queryByTestId('sub-menu-item')).not.toBeInTheDocument();
  expect(getByTestId('active-sub-menu-item')).toBeInTheDocument();
});

test('a Menu renders nothing if there is no menu items passed', () => {
  const { queryByTestId, rerender } = render(
    <SideNavigation data-testid="empty-menu" />,
  );
  expect(queryByTestId('empty-menu')).not.toBeInTheDocument();

  const menuItems: any[] = [];
  rerender(
    <SideNavigation data-testid="empty-menu">
      {menuItems.map(item => item)}
    </SideNavigation>,
  );
  expect(queryByTestId('empty-menu')).not.toBeInTheDocument();
});
