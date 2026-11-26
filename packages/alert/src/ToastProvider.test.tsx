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

const toastTexts = (toasts: HTMLElement[]) =>
  toasts.map(toast => within(toast).getByText(/^toast \d$/).textContent);

const Example = ({ delay }: Pick<ToastProviderProps, 'delay'>) => {
  return (
    <ToastProvider delay={delay}>
      <ToastTrigger />
    </ToastProvider>
  );
};

// The announcer has no role, so getByRole('status') keeps finding the toasts.
// Find it by its class instead.
const announcer = () =>
  document.querySelector<HTMLElement>('.eds-toast-announcer');

test('announces a new toast through a live region that exists before the toast', async () => {
  const user = setupUserWithFakeTimers();
  render(<Example />);
  const region = announcer();
  expect(region).toHaveAttribute('aria-live', 'polite');
  expect(region).toBeEmptyDOMElement();
  expect(screen.queryByRole('status')).not.toBeInTheDocument();

  await user.click(
    screen.getByRole('button', { name: 'Click to toggle toast' }),
  );

  expect(announcer()).toBe(region);
  expect(region).toHaveTextContent('toast 1');
});

test('keeps the toasts as statuses that are not read on their own', async () => {
  const user = setupUserWithFakeTimers();
  render(<Example />);
  const trigger = screen.getByRole('button', { name: 'Click to toggle toast' });
  await user.click(trigger);
  await user.click(trigger);

  const toasts = screen.getAllByRole('status');
  expect(toasts).toHaveLength(2);
  toasts.forEach(toast => expect(toast).toHaveAttribute('aria-live', 'off'));
});

test('announces the title and content as plain text, without the close button', async () => {
  const user = setupUserWithFakeTimers();
  const Trigger = () => {
    const { addToast } = useToast();
    return (
      <button
        type="button"
        onClick={() =>
          addToast({
            title: 'Lagret',
            content: (
              <>
                Se <a href="/endringer">endringene</a>
              </>
            ),
          })
        }
      >
        Save
      </button>
    );
  };
  render(
    <ToastProvider>
      <Trigger />
    </ToastProvider>,
  );

  await user.click(screen.getByRole('button', { name: 'Save' }));

  const region = announcer()!;
  expect(region).toHaveTextContent('Lagret Se endringene');
  expect(within(region).queryByRole('button')).not.toBeInTheDocument();
  expect(within(region).queryByRole('link')).not.toBeInTheDocument();
});

test('stops announcing toasts once they are removed', async () => {
  const user = setupUserWithFakeTimers();
  render(<Example delay={3000} />);
  await user.click(
    screen.getByRole('button', { name: 'Click to toggle toast' }),
  );
  expect(announcer()).toHaveTextContent('toast 1');

  act(() => jest.advanceTimersByTime(3000));
  expect(announcer()).toBeEmptyDOMElement();
});

test('renders the three newest toasts', async () => {
  const user = setupUserWithFakeTimers();
  const { getByRole, getAllByRole, queryByText } = render(<Example />);
  const button = getByRole('button', { name: 'Click to toggle toast' });

  await user.click(button);
  await user.click(button);
  await user.click(button);
  await user.click(button);

  expect(toastTexts(getAllByRole('status'))).toEqual([
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
  expect(toastTexts(screen.getAllByRole('status'))).toEqual([
    'toast 3',
    'toast 2',
    'toast 1',
  ]);
  act(() => jest.advanceTimersByTime(2999));
  expect(screen.getAllByRole('status')).toHaveLength(3);
  act(() => jest.advanceTimersByTime(1));
  expect(screen.queryAllByRole('status')).toHaveLength(0);
});

test('allows keyboard users to reach and dismiss a toast without hovering', async () => {
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
});

test('pauses the removal countdown while focus is inside a toast', async () => {
  const user = setupUserWithFakeTimers();
  render(<Example delay={3000} />);
  await user.tab();
  await user.keyboard('{Enter}');
  await user.tab({ shift: true });
  expect(screen.getByRole('button', { name: 'Lukk' })).toHaveFocus();

  act(() => jest.advanceTimersByTime(10000));
  expect(screen.getByRole('status')).toBeInTheDocument();

  await user.tab();
  act(() => jest.advanceTimersByTime(3000));
  expect(screen.queryByRole('status')).not.toBeInTheDocument();
});

test('keeps a focused toast while the mouse passes over another toast', async () => {
  const user = setupUserWithFakeTimers();
  render(<Example delay={3000} />);
  await user.tab();
  await user.keyboard('{Enter}');
  await user.keyboard('{Enter}');
  await user.tab({ shift: true });
  const [newest, older] = screen.getAllByRole('status');
  expect(within(older).getByRole('button', { name: 'Lukk' })).toHaveFocus();

  fireEvent.mouseEnter(newest);
  fireEvent.mouseLeave(newest);
  act(() => jest.advanceTimersByTime(10000));
  expect(screen.getAllByRole('status')).toHaveLength(2);
});

test('removes a toast on time when another toast is hovered while it slides out', async () => {
  const user = setupUserWithFakeTimers();
  render(<Example delay={3000} />);
  await user.click(
    screen.getByRole('button', { name: 'Click to toggle toast' }),
  );
  act(() => jest.advanceTimersByTime(1000));
  await user.click(
    screen.getByRole('button', { name: 'Click to toggle toast' }),
  );
  // The first toast starts its 400 ms exit animation at 2600 ms
  act(() => jest.advanceTimersByTime(1700));
  const [newest] = screen.getAllByRole('status');

  fireEvent.mouseEnter(newest);
  fireEvent.mouseLeave(newest);
  act(() => jest.advanceTimersByTime(400));
  expect(toastTexts(screen.getAllByRole('status'))).toEqual(['toast 2']);
});

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
