import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  OverflowMenu,
  OverflowMenuItem,
  OverflowMenuLink,
} from './OverflowMenu';

test('selects an action with the mouse, closes and returns focus', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();
  render(
    <OverflowMenu>
      <OverflowMenuItem onSelect={onSelect}>Info</OverflowMenuItem>
      <OverflowMenuLink href="#details">Details</OverflowMenuLink>
    </OverflowMenu>,
  );

  const trigger = screen.getByRole('button', { name: 'åpne valgmeny' });
  expect(trigger).toHaveAttribute('aria-haspopup', 'menu');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();

  await user.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(screen.getByRole('menu')).toHaveAttribute(
    'id',
    trigger.getAttribute('aria-controls'),
  );
  expect(screen.getByRole('menuitem', { name: 'Details' })).toHaveAttribute(
    'href',
    '#details',
  );
  const item = screen.getByRole('menuitem', { name: 'Info' });
  await user.hover(item);
  await waitFor(() => expect(item).toHaveFocus());
  await user.click(item);

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveFocus();
});

test('navigates with arrows, Home and End, skipping disabled actions', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();
  const onDisabledSelect = jest.fn();
  render(
    <OverflowMenu>
      <OverflowMenuItem onSelect={onSelect}>First</OverflowMenuItem>
      <OverflowMenuItem disabled onSelect={onDisabledSelect}>
        Disabled
      </OverflowMenuItem>
      <OverflowMenuItem>Last</OverflowMenuItem>
    </OverflowMenu>,
  );

  await user.tab();
  await user.keyboard('{ArrowDown}');
  const first = screen.getByRole('menuitem', { name: 'First' });
  const last = screen.getByRole('menuitem', { name: 'Last' });
  await waitFor(() => expect(first).toHaveFocus());
  await user.keyboard('{ArrowDown}');
  await waitFor(() => expect(last).toHaveFocus());
  await user.keyboard('{Home}');
  await waitFor(() => expect(first).toHaveFocus());
  await user.keyboard('{End}');
  await waitFor(() => expect(last).toHaveFocus());
  await user.keyboard('{ArrowUp}');
  await waitFor(() => expect(first).toHaveFocus());
  await user.keyboard(' ');

  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(onDisabledSelect).not.toHaveBeenCalled();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'åpne valgmeny' })).toHaveFocus();
});

test('uses typeahead and Enter to select an action', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();
  render(
    <OverflowMenu>
      <OverflowMenuItem>Archive</OverflowMenuItem>
      <OverflowMenuItem onSelect={onSelect}>Delete</OverflowMenuItem>
    </OverflowMenu>,
  );

  await user.tab();
  await user.keyboard('{Enter}');
  await waitFor(() =>
    expect(screen.getByRole('menuitem', { name: 'Archive' })).toHaveFocus(),
  );
  await user.keyboard('d');
  await waitFor(() =>
    expect(screen.getByRole('menuitem', { name: 'Delete' })).toHaveFocus(),
  );
  await user.keyboard('{Enter}');
  expect(onSelect).toHaveBeenCalledTimes(1);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'åpne valgmeny' })).toHaveFocus();
});

test('opens at the last item with ArrowUp and dismisses with Escape', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();
  render(
    <OverflowMenu button={<button>Actions</button>} aria-label="Actions">
      <OverflowMenuItem onSelect={onSelect}>First</OverflowMenuItem>
      <OverflowMenuItem onSelect={onSelect}>Last</OverflowMenuItem>
    </OverflowMenu>,
  );

  await user.tab();
  await user.keyboard('{ArrowUp}');
  await waitFor(() =>
    expect(screen.getByRole('menuitem', { name: 'Last' })).toHaveFocus(),
  );
  await user.keyboard('{Escape}');
  expect(onSelect).not.toHaveBeenCalled();
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Actions' })).toHaveFocus();
});

test('dismisses on an outside click without taking focus from its target', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();
  render(
    <>
      <OverflowMenu>
        <OverflowMenuItem onSelect={onSelect}>Info</OverflowMenuItem>
      </OverflowMenu>
      <button>Outside</button>
    </>,
  );

  await user.click(screen.getByRole('button', { name: 'åpne valgmeny' }));
  expect(screen.getByRole('menu')).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Outside' }));
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Outside' })).toHaveFocus();
  expect(onSelect).not.toHaveBeenCalled();
});

test('toggles closed when the trigger is clicked again', async () => {
  const user = userEvent.setup();
  render(
    <OverflowMenu>
      <OverflowMenuItem>Info</OverflowMenuItem>
    </OverflowMenu>,
  );
  const trigger = screen.getByRole('button', { name: 'åpne valgmeny' });
  await user.click(trigger);
  expect(screen.getByRole('menu')).toBeVisible();
  await user.click(trigger);
  expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('disabled actions and links cannot be selected with the mouse', async () => {
  const user = userEvent.setup();
  const onSelect = jest.fn();
  render(
    <OverflowMenu>
      <OverflowMenuItem disabled onSelect={onSelect}>
        Disabled action
      </OverflowMenuItem>
      <OverflowMenuLink disabled href="#disabled">
        Disabled link
      </OverflowMenuLink>
    </OverflowMenu>,
  );

  await user.click(screen.getByRole('button', { name: 'åpne valgmeny' }));
  const action = screen.getByRole('menuitem', { name: 'Disabled action' });
  const link = screen.getByRole('menuitem', { name: 'Disabled link' });
  expect(action).toHaveAttribute('aria-disabled', 'true');
  expect(link).toHaveAttribute('aria-disabled', 'true');
  expect(link).not.toHaveAttribute('href');
  await user.click(action);
  await user.click(link);
  expect(onSelect).not.toHaveBeenCalled();
  expect(screen.getByRole('menu')).toBeVisible();
});

test('OverflowMenu uses fixed positioning', async () => {
  const user = userEvent.setup();
  render(
    <OverflowMenu data-testid="button">
      <OverflowMenuItem>Info</OverflowMenuItem>
    </OverflowMenu>,
  );

  await user.click(screen.getByTestId('button'));

  expect(screen.getByRole('menu')).toHaveStyle({ position: 'fixed' });
});
