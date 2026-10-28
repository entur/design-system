import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { useDebounce } from '.';
import {
  setupUserWithFakeTimers,
  useFakeTimersInSuite,
} from '../../../tests/jest/fakeTimers';

function Search({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = React.useState('');
  const search = useDebounce(onSearch, 300);
  return (
    <input
      aria-label="Search"
      value={query}
      onChange={event => {
        setQuery(event.target.value);
        search(event.target.value);
      }}
    />
  );
}

useFakeTimersInSuite();

test('searches only for the latest input after a full quiet interval', async () => {
  const user = setupUserWithFakeTimers();
  const onSearch = jest.fn();
  render(<Search onSearch={onSearch} />);
  const input = screen.getByRole('textbox', { name: 'Search' });

  await user.type(input, 'O');
  act(() => jest.advanceTimersByTime(200));
  await user.type(input, 'slo');
  act(() => jest.advanceTimersByTime(299));
  expect(onSearch).not.toHaveBeenCalled();

  act(() => jest.advanceTimersByTime(1));
  expect(onSearch).toHaveBeenCalledTimes(1);
  expect(onSearch).toHaveBeenLastCalledWith('Oslo');
});

test('cancels a pending search when its input unmounts', async () => {
  const user = setupUserWithFakeTimers();
  const onSearch = jest.fn();
  const { unmount } = render(<Search onSearch={onSearch} />);
  await user.type(screen.getByRole('textbox'), 'Bergen');
  expect(jest.getTimerCount()).toBe(1);

  unmount();
  expect(jest.getTimerCount()).toBe(0);
  act(() => jest.advanceTimersByTime(300));
  expect(onSearch).not.toHaveBeenCalled();
});
