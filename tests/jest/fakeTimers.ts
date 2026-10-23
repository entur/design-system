import { act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/** Enables Jest fake timers for every test in the enclosing file or describe block. */
export function useFakeTimersInSuite() {
  beforeAll(() => {
    jest.useFakeTimers();
  });
  afterEach(() => {
    jest.clearAllTimers();
  });
  afterAll(() => {
    jest.useRealTimers();
  });
}

/** userEvent instance whose internal delays advance Jest fake timers. */
export function setupUserWithFakeTimers() {
  return userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
}

/** Flushes pending timers and animation frames inside act. */
export function runAllTimers() {
  act(() => {
    jest.runAllTimers();
  });
}
