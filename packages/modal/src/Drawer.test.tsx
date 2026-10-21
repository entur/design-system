import { useState } from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Drawer } from '.';
import { installDialogPolyfill } from '../../../tests/jest/dialogPolyfill';

test.each(['mouse', 'Enter', 'Escape'] as const)(
  'dismisses a non-modal drawer with %s and returns focus to its trigger',
  async dismissal => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    const onKeyDown = jest.fn();
    function Example() {
      const [open, setOpen] = useState(false);
      return (
        <div role="group" aria-label="Journey controls" onKeyDown={onKeyDown}>
          <button onClick={() => setOpen(true)}>Open journey</button>
          <Drawer
            title="Journey details"
            open={open}
            closeLabel="Close journey"
            onDismiss={() => {
              onDismiss();
              setOpen(false);
            }}
          >
            <button>Edit journey</button>
          </Drawer>
        </div>
      );
    }
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open journey' });
    await user.click(trigger);
    const dialog = screen.getByRole('dialog', { name: 'Journey details' });
    expect(dialog).toHaveAttribute('aria-modal', 'false');
    expect(
      within(dialog).getByRole('heading', { name: 'Journey details' }),
    ).toHaveFocus();
    const closeButton = within(dialog).getByRole('button', {
      name: 'Close journey',
    });
    expect(onDismiss).not.toHaveBeenCalled();

    if (dismissal === 'mouse') {
      await user.click(closeButton);
    } else if (dismissal === 'Enter') {
      await user.tab({ shift: true });
      expect(closeButton).toHaveFocus();
      await user.keyboard('{Enter}');
    } else {
      await user.tab();
      expect(
        screen.getByRole('button', { name: 'Edit journey' }),
      ).toHaveFocus();
      onKeyDown.mockClear();
      await user.keyboard('{Escape}');
      expect(onKeyDown).not.toHaveBeenCalled();
    }

    expect(onDismiss).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
    await user.click(trigger);
    expect(
      screen.getByRole('heading', { name: 'Journey details' }),
    ).toHaveFocus();
    expect(onDismiss).toHaveBeenCalledTimes(1);
  },
);

test('stays open until the consumer changes open, without dismissing on prop changes', async () => {
  const user = userEvent.setup();
  const onDismiss = jest.fn();
  const drawer = (open?: boolean) => (
    <Drawer title="Journey details" onDismiss={onDismiss} open={open}>
      <button>Edit journey</button>
    </Drawer>
  );
  const { rerender } = render(drawer());
  await user.click(screen.getByRole('button', { name: 'Lukk skuff' }));
  expect(onDismiss).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('dialog', { name: 'Journey details' })).toBeVisible();
  rerender(drawer(false));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  expect(
    screen.queryByRole('button', { name: 'Edit journey' }),
  ).not.toBeInTheDocument();
  rerender(drawer(true));
  expect(
    screen.getByRole('heading', { name: 'Journey details' }),
  ).toHaveFocus();
  expect(onDismiss).toHaveBeenCalledTimes(1);
});

test('restores focus when an open non-modal drawer is unmounted', async () => {
  const user = userEvent.setup();
  const onDismiss = jest.fn();
  const { rerender } = render(<button>Journey</button>);
  const trigger = screen.getByRole('button', { name: 'Journey' });
  await user.click(trigger);
  rerender(
    <>
      <button>Journey</button>
      <Drawer title="Journey details" onDismiss={onDismiss}>
        <button>Edit journey</button>
      </Drawer>
    </>,
  );
  expect(
    screen.getByRole('heading', { name: 'Journey details' }),
  ).toHaveFocus();
  rerender(<button>Journey</button>);
  expect(trigger).toHaveFocus();
  expect(onDismiss).not.toHaveBeenCalled();
});

describe('drawer with overlay', () => {
  installDialogPolyfill();

  test.each(['close button', 'backdrop', 'Escape', 'native cancel'] as const)(
    'dismisses an overlay drawer through %s',
    async dismissal => {
      const user = userEvent.setup();
      const onDismiss = jest.fn();
      function Example() {
        const [open, setOpen] = useState(true);
        return (
          <Drawer
            title="Journey details"
            overlay
            open={open}
            onDismiss={() => {
              onDismiss();
              setOpen(false);
            }}
          >
            <button>Edit journey</button>
          </Drawer>
        );
      }
      render(<Example />);
      const dialog = screen.getByRole('dialog', { name: 'Journey details' });
      expect(screen.getAllByRole('dialog')).toHaveLength(1);
      expect(
        screen.getByRole('heading', { name: 'Journey details' }),
      ).toHaveFocus();
      await user.click(screen.getByRole('button', { name: 'Edit journey' }));
      expect(onDismiss).not.toHaveBeenCalled();

      if (dismissal === 'close button') {
        await user.click(screen.getByRole('button', { name: 'Lukk skuff' }));
      } else if (dismissal === 'backdrop') {
        await user.click(dialog);
      } else if (dismissal === 'Escape') {
        await user.keyboard('{Escape}');
      } else {
        // jsdom does not fire the native cancel event on Escape, so dispatch it directly.
        const cancel = new Event('cancel', { cancelable: true });
        fireEvent(dialog, cancel);
        expect(cancel.defaultPrevented).toBe(true);
      }

      expect(onDismiss).toHaveBeenCalledTimes(1);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      expect(
        screen.queryByRole('button', { name: 'Edit journey' }),
      ).not.toBeInTheDocument();
    },
  );
});

test('merges a consumer className and style on the drawer', () => {
  render(
    <Drawer
      title="Journey details"
      onDismiss={jest.fn()}
      className="consumer-class"
      style={{ marginTop: '7px' }}
    >
      Content
    </Drawer>,
  );
  const drawer = screen.getByRole('dialog', { name: 'Journey details' });
  expect(drawer).toHaveClass('eds-drawer', 'consumer-class');
  expect(drawer).toHaveStyle({ marginTop: '7px' });
});
