import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Menu, MenuItem } from '.';

test('renders a single-level menu without issues', () => {
  const { getByText } = render(
    <Menu>
      <MenuItem href="#first">First item</MenuItem>
      <MenuItem href="#second">Second item</MenuItem>
    </Menu>,
  );

  expect(getByText('First item')).toBeInTheDocument();
  expect(getByText('Second item')).toBeInTheDocument();

  expect(getByText('First item')).toHaveAttribute('href', '#first');
  expect(getByText('Second item')).toHaveAttribute('href', '#second');

  expect(getByText('First item').nodeName).toBe('A');
});

test('renders a multi-level menu', () => {
  const { getByText, queryByText } = render(
    <Menu>
      <MenuItem href="#">Top level</MenuItem>
      <MenuItem>
        Sub-menu trigger
        <Menu>
          <MenuItem href="#second">Sub-menu item</MenuItem>
        </Menu>
      </MenuItem>
    </Menu>,
  );

  expect(queryByText('Sub-menu item')).not.toBeInTheDocument();

  fireEvent.click(getByText('Sub-menu trigger'));

  expect(queryByText('Sub-menu item')).toBeInTheDocument();

  fireEvent.click(getByText('Sub-menu trigger'));

  expect(queryByText('Sub-menu item')).not.toBeInTheDocument();
});

test('renders the sub-menu if a sub-menu item is set to active', () => {
  const { getByText } = render(
    <Menu>
      <MenuItem href="#">Top level</MenuItem>
      <MenuItem>
        Sub-menu trigger
        <Menu>
          <MenuItem href="#second" active={true}>
            Sub-menu item
          </MenuItem>
        </Menu>
      </MenuItem>
    </Menu>,
  );

  expect(getByText('Sub-menu item')).toBeInTheDocument();
});

test('renders the sub-menu trigger as active if a sub-menu item is set to active', () => {
  const { getByText } = render(
    <Menu size="small">
      <MenuItem href="#">Top level</MenuItem>
      <MenuItem>
        Sub-menu trigger
        <Menu>
          <MenuItem href="#second" active={true}>
            Sub-menu item
          </MenuItem>
        </Menu>
      </MenuItem>
    </Menu>,
  );

  expect(getByText('Sub-menu trigger').className).toContain('--active');
});

test('renders a small menu if the small flag is set', () => {
  const { container } = render(
    <Menu size="small">
      <MenuItem href="#">Top level</MenuItem>
      <MenuItem>
        Sub-menu trigger
        <Menu>
          <MenuItem href="#second">Sub-menu item</MenuItem>
        </Menu>
      </MenuItem>
    </Menu>,
  );

  expect(container.querySelector('.eds-menu')).toHaveClass('eds-menu--small');
});

test('menu items are disabled if specified', () => {
  const { getByText } = render(
    <Menu size="small">
      <MenuItem href="#" disabled={true}>
        Disabled item
      </MenuItem>
      <MenuItem href="#">Second item</MenuItem>
    </Menu>,
  );

  expect(getByText('Disabled item')).toBeDisabled();
});

test('forceExpandSubMenus works as expected without active items', () => {
  const { getByTestId, queryByTestId, rerender } = render(
    <Menu size="small">
      <MenuItem forceExpandSubMenus={true}>
        Sub-menu trigger
        <Menu>
          <MenuItem href="#second" data-testid="sub-menu-item">
            Sub-menu item
          </MenuItem>
        </Menu>
      </MenuItem>
      <MenuItem forceExpandSubMenus={true}>
        Active sub-menu trigger
        <Menu>
          <MenuItem
            href="#second"
            data-testid="active-sub-menu-item"
            active={true}
          >
            Active sub-menu item
          </MenuItem>
        </Menu>
      </MenuItem>
    </Menu>,
  );

  expect(getByTestId('sub-menu-item')).toBeInTheDocument();
  expect(getByTestId('active-sub-menu-item')).toBeInTheDocument();
  rerender(
    <Menu size="small">
      >
      <MenuItem forceExpandSubMenus={false}>
        Sub-menu trigger
        <Menu>
          <MenuItem href="#second" data-testid="sub-menu-item">
            Sub-menu item
          </MenuItem>
        </Menu>
      </MenuItem>
      <MenuItem forceExpandSubMenus={false}>
        Active sub-menu trigger
        <Menu>
          <MenuItem
            href="#second"
            data-testid="active-sub-menu-item"
            active={true}
          >
            Active sub-menu item
          </MenuItem>
        </Menu>
      </MenuItem>
    </Menu>,
  );
  expect(queryByTestId('sub-menu-item')).not.toBeInTheDocument();
  expect(getByTestId('active-sub-menu-item')).toBeInTheDocument();
});

test('a Menu renders nothing if there is no menu items passed', () => {
  const { queryByTestId, rerender } = render(<Menu data-testid="empty-menu" />);
  expect(queryByTestId('empty-menu')).not.toBeInTheDocument();

  const menuItems: any[] = [];
  rerender(<Menu data-testid="empty-menu">{menuItems.map(item => item)}</Menu>);
  expect(queryByTestId('empty-menu')).not.toBeInTheDocument();
});
