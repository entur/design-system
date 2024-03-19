import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import { ToastProvider, useToast } from './ToastProvider';

jest.useFakeTimers();

const ToastTrigger = () => {
  const { addToast } = useToast();
  return (
    <button
      onClick={() => addToast('toast test')}
      type="button"
      data-testid="button"
    >
      Click to toggle toast
    </button>
  );
};

const Example = ({ delay }: any) => {
  return (
    <ToastProvider delay={delay}>
      <ToastTrigger />
    </ToastProvider>
  );
};

afterEach(() => jest.clearAllTimers());

test('renders the three newest toasts', () => {
  const { getByTestId, getAllByRole } = render(<Example />);
  const button = getByTestId('button');

  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);
  fireEvent.click(button);

  expect(getAllByRole('status')).toHaveLength(3);
});

test('removes the toasts after the specified delay', () => {
  const { getByTestId, getAllByRole, queryAllByRole } = render(
    <Example delay={3000} />,
  );
  const button = getByTestId('button');
  fireEvent.click(button);
  fireEvent.click(button);

  expect(getAllByRole('status')).toHaveLength(2);
  // exit animation start EXIT_ANIMATION_TIME ms before exit and triggers state update
  act(() => {
    jest.advanceTimersByTime(2999);
  });
  expect(getAllByRole('status')).toHaveLength(2);

  fireEvent.click(button);
  expect(getAllByRole('status')).toHaveLength(3);

  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(getAllByRole('status')).toHaveLength(1);
  act(() => {
    jest.advanceTimersByTime(2999);
  });
  expect(queryAllByRole('status')).toHaveLength(0);
});

test('resets the removal countdown if a toast is hovered', () => {
  const { getByTestId, getAllByRole, queryAllByRole } = render(
    <Example delay={3000} />,
  );
  const button = getByTestId('button');

  fireEvent.click(button);
  fireEvent.click(button);

  expect(getAllByRole('status')).toHaveLength(2);
  fireEvent.mouseEnter(getAllByRole('status')[0]);
  act(() => {
    jest.advanceTimersByTime(10000);
  });
  expect(getAllByRole('status')).toHaveLength(2);
  fireEvent.mouseLeave(getAllByRole('status')[0]);
  act(() => {
    jest.advanceTimersByTime(2999);
  });
  expect(getAllByRole('status')).toHaveLength(2);
  act(() => {
    jest.advanceTimersByTime(1);
  });
  expect(queryAllByRole('status')).toHaveLength(0);
});
