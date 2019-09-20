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

  expect(container.querySelector('.entur-menu')).toHaveClass(
    'entur-menu--small',
  );
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
