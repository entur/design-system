import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOnClickOutside } from '.';

function Popover({ onClose }: { onClose: () => void }) {
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  useOnClickOutside([triggerRef, panelRef], onClose);
  return (
    <>
      <button ref={triggerRef}>Open filters</button>
      <div ref={panelRef}>
        <button>Apply filters</button>
      </div>
    </>
  );
}

// userEvent dispatches pointer events for touch input but never touchstart,
// so touch interactions are dispatched with fireEvent.
test('ignores both protected refs and descendants for mouse and touch interactions', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  render(<Popover onClose={onClose} />);
  for (const button of screen.getAllByRole('button')) {
    await user.click(button);
    fireEvent.touchStart(button);
  }
  expect(onClose).not.toHaveBeenCalled();

  await user.click(document.body);
  expect(onClose).toHaveBeenCalledTimes(1);
  fireEvent.touchStart(document.body);
  expect(onClose).toHaveBeenCalledTimes(2);
});

test('replaces outside handlers without duplicates and removes both listeners on unmount', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  const nextOnClose = jest.fn();
  const { rerender, unmount } = render(<Popover onClose={onClose} />);
  rerender(<Popover onClose={nextOnClose} />);
  await user.click(document.body);
  fireEvent.touchStart(document.body);
  expect(onClose).not.toHaveBeenCalled();
  expect(nextOnClose).toHaveBeenCalledTimes(2);

  unmount();
  await user.click(document.body);
  fireEvent.touchStart(document.body);
  expect(nextOnClose).toHaveBeenCalledTimes(2);
});

test('recognizes inside interactions retargeted through a shadow root', async () => {
  const user = userEvent.setup();
  const host = document.createElement('div');
  document.body.appendChild(host);
  const shadowRoot = host.attachShadow({ mode: 'open' });
  const container = document.createElement('div');
  shadowRoot.appendChild(container);
  const onClose = jest.fn();
  const { unmount } = render(<Popover onClose={onClose} />, { container });
  try {
    const button = within(container).getByRole('button', {
      name: 'Apply filters',
    });
    await user.click(button);
    fireEvent.touchStart(button, { composed: true });
    expect(onClose).not.toHaveBeenCalled();

    await user.click(host);
    expect(onClose).toHaveBeenCalledTimes(1);
  } finally {
    unmount();
    host.remove();
  }
});
