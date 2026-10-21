import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useOnEscape } from '.';

function Panel({ onClose }: { onClose: () => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  useOnEscape(ref, onClose);
  return (
    <>
      <div ref={ref}>
        <input aria-label="Filter" />
      </div>
      <button>Outside</button>
    </>
  );
}

test('handles Escape bubbling from inside, but not other keys or outside Escape', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  render(<Panel onClose={onClose} />);
  await user.click(screen.getByRole('textbox'));
  await user.keyboard('{Enter}');
  await user.tab();
  expect(screen.getByRole('button')).toHaveFocus();
  await user.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();

  await user.click(screen.getByRole('textbox'));
  await user.keyboard('{Escape}');
  expect(onClose).toHaveBeenCalledTimes(1);
});

test('replaces the callback and removes the listener from the unmounted panel', async () => {
  const user = userEvent.setup();
  const onClose = jest.fn();
  const nextOnClose = jest.fn();
  const { rerender, unmount } = render(<Panel onClose={onClose} />);
  const input = screen.getByRole('textbox');
  rerender(<Panel onClose={nextOnClose} />);

  await user.click(input);
  await user.keyboard('{Escape}');
  expect(onClose).not.toHaveBeenCalled();
  expect(nextOnClose).toHaveBeenCalledTimes(1);
  unmount();
  // The input is detached after unmount, so userEvent cannot focus and type into it.
  fireEvent.keyDown(input, { key: 'Escape' });
  expect(nextOnClose).toHaveBeenCalledTimes(1);
});
