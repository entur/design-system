import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SideNavigation, SideNavigationItem } from '.';

test('provides current-page links navigable with Tab, Enter and the mouse', async () => {
  const user = userEvent.setup();
  const onNavigate = jest.fn(event => event.preventDefault());
  render(
    <SideNavigation>
      <SideNavigationItem href="#first" active onClick={onNavigate}>
        First item
      </SideNavigationItem>
      <SideNavigationItem href="#second" onClick={onNavigate}>
        Second item
      </SideNavigationItem>
    </SideNavigation>,
  );

  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  const first = screen.getByRole('link', {
    name: 'First item',
    current: 'page',
  });
  const second = screen.getByRole('link', { name: 'Second item' });
  expect(first).toHaveAttribute('href', '#first');
  expect(second).toHaveAttribute('href', '#second');
  expect(second).not.toHaveAttribute('aria-current');
  await user.tab();
  expect(first).toHaveFocus();
  await user.tab();
  expect(second).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onNavigate).toHaveBeenCalledTimes(1);
  await user.click(first);
  expect(onNavigate).toHaveBeenCalledTimes(2);
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

test('applies the small modifier when size is small', () => {
  render(
    <SideNavigation size="small">
      <SideNavigationItem href="#">Top level</SideNavigationItem>
    </SideNavigation>,
  );

  expect(screen.getByRole('list')).toHaveClass('eds-side-navigation--small');
});

test('disabled items cannot be activated and are skipped by Tab', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <SideNavigation size="small">
      <SideNavigationItem href="#" disabled onClick={onClick}>
        Disabled item
      </SideNavigationItem>
      <SideNavigationItem href="#">Second item</SideNavigationItem>
    </SideNavigation>,
  );

  const disabled = screen.getByRole('button', { name: 'Disabled item' });
  expect(disabled).toBeDisabled();
  expect(disabled).toHaveAttribute('aria-disabled', 'true');
  await user.click(disabled);
  expect(onClick).not.toHaveBeenCalled();
  await user.tab();
  expect(screen.getByRole('link', { name: 'Second item' })).toHaveFocus();
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
            as="button"
            onClick={() => console.log('ok')}
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
