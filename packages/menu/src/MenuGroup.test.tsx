import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { Menu, MenuItem, MenuGroup } from '.';

test('renders a nice looking menu group', () => {
  const { getByRole, queryByText, getByText } = render(
    <MenuGroup title="My group">
      <Menu>
        <MenuItem>An item</MenuItem>
      </Menu>
    </MenuGroup>,
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
    <MenuGroup title="My group" open={true} onToggle={spy}>
      <Menu>
        <MenuItem>An item</MenuItem>
      </Menu>
    </MenuGroup>,
  );
  const trigger = getByRole('button');
  expect(getByText('An item')).toBeInTheDocument();

  fireEvent.click(trigger);

  expect(spy).toHaveBeenCalled();

  rerender(
    <MenuGroup title="My group" open={false} onToggle={spy}>
      <Menu>
        <MenuItem>An item</MenuItem>
      </Menu>
    </MenuGroup>,
  );

  expect(queryByText('An item')).not.toBeInTheDocument();
});
