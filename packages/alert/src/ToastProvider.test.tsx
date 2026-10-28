import { useRef } from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { ToastProvider, ToastProviderProps, useToast } from './ToastProvider';
import {
  setupUserWithFakeTimers,
  useFakeTimersInSuite,
} from '../../../tests/jest/fakeTimers';

useFakeTimersInSuite();

const ToastTrigger = () => {
  const { addToast } = useToast();
  const count = useRef(0);
  return (
    <button onClick={() => addToast(`toast ${++count.current}`)} type="button">
      Click to toggle toast
    </button>
  );
};

const Example = ({ delay }: Pick<ToastProviderProps, 'delay'>) => {
  return (
    <ToastProvider delay={delay}>
      <ToastTrigger />
    </ToastProvider>
  );
};

test('renders the three newest toasts', async () => {
  const user = setupUserWithFakeTimers();
  const { getByRole, getAllByRole, queryByText } = render(<Example />);
  const button = getByRole('button', { name: 'Click to toggle toast' });

  await user.click(button);
  await user.click(button);
  await user.click(button);
  await user.click(button);

  expect(getAllByRole('status').map(toast => toast.textContent)).toEqual([
    'toast 4',
    'toast 3',
    'toast 2',
  ]);
  expect(queryByText('toast 1')).not.toBeInTheDocument();
});

test('removes the toasts after the specified delay', async () => {
  const user = setupUserWithFakeTimers();
  const { getByRole, getAllByRole, queryAllByRole } = render(
    <Example delay={3000} />,
  );
  const button = getByRole('button', { name: 'Click to toggle toast' });
  await user.click(button);
  await user.click(button);

  expect(getAllByRole('status')).toHaveLength(2);
  // exit animation start EXIT_ANIMATION_TIME ms before exit and triggers state update
  act(() => {
    jest.advanceTimersByTime(2999);
  });
  expect(getAllByRole('status')).toHaveLength(2);

  await user.click(button);
  expect(getAllByRole('status')).toHaveLength(3);

  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(getAllByRole('status')).toHaveLength(1);
  expect(getByRole('status')).toHaveTextContent('toast 3');
  act(() => {
    jest.advanceTimersByTime(2999);
  });
  expect(queryAllByRole('status')).toHaveLength(0);
});

test('resets the removal countdown if a toast is hovered', async () => {
  const user = setupUserWithFakeTimers();
  const { getByRole, getAllByRole, queryAllByRole } = render(
    <Example delay={3000} />,
  );
  const button = getByRole('button', { name: 'Click to toggle toast' });

  await user.click(button);
  await user.click(button);

  expect(getAllByRole('status')).toHaveLength(2);
  await user.hover(getAllByRole('status')[0]);
  act(() => {
    jest.advanceTimersByTime(10000);
  });
  expect(getAllByRole('status')).toHaveLength(2);
  await user.unhover(getAllByRole('status')[0]);
  act(() => {
    jest.advanceTimersByTime(2999);
  });
  expect(getAllByRole('status')).toHaveLength(2);
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(queryAllByRole('status')).toHaveLength(0);
});

test('dismissing a hovered toast promotes the queued toast and restarts expiry', async () => {
  const user = setupUserWithFakeTimers();
  render(<Example delay={3000} />);
  const trigger = screen.getByRole('button', { name: 'Click to toggle toast' });
  await user.click(trigger);
  await user.click(trigger);
  await user.click(trigger);
  await user.click(trigger);

  const newest = screen.getAllByRole('status')[0];
  // user-event omits relatedTarget when moving from the toast to its close button.
  fireEvent.mouseEnter(newest);
  act(() => jest.advanceTimersByTime(10000));
  await user.click(within(newest).getByRole('button', { name: 'Lukk' }));

  expect(screen.queryByText('toast 4')).not.toBeInTheDocument();
  expect(screen.getAllByRole('status').map(toast => toast.textContent)).toEqual(
    ['toast 3', 'toast 2', 'toast 1'],
  );
  act(() => jest.advanceTimersByTime(2999));
  expect(screen.getAllByRole('status')).toHaveLength(3);
  act(() => jest.advanceTimersByTime(1));
  expect(screen.queryAllByRole('status')).toHaveLength(0);
});

// Bug: ToastProvider only mounts the close button on mouse hover, not keyboard focus.
test.failing(
  'allows keyboard users to reach and dismiss a toast without hovering',
  async () => {
    const user = setupUserWithFakeTimers();
    render(<Example />);
    await user.tab();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('status')).toHaveTextContent('toast 1');
    await user.tab({ shift: true });

    const closeButton = screen.getByRole('button', { name: 'Lukk' });
    expect(closeButton).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  },
);

test('applies position, className and style to the toast container', async () => {
  const user = setupUserWithFakeTimers();
  render(
    <ToastProvider
      position="top-right"
      className="consumer-class"
      style={{ marginTop: '7px' }}
    >
      <ToastTrigger />
    </ToastProvider>,
  );
  await user.click(
    screen.getByRole('button', { name: 'Click to toggle toast' }),
  );
  const container = screen.getByRole('status').parentElement;
  expect(container).toHaveClass(
    'eds-toast-container',
    'eds-toast-container--top-right',
    'consumer-class',
  );
  expect(container).toHaveStyle({ marginTop: '7px' });
});
