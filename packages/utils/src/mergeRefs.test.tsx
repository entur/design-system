import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mergeRefs } from '.';

const SearchInput = React.forwardRef<
  HTMLInputElement,
  { onInputRef: (node: HTMLInputElement | null) => void }
>(({ onInputRef }, forwardedRef) => {
  const internalRef = React.useRef<HTMLInputElement>(null);
  return (
    <>
      <input
        aria-label="Search"
        ref={mergeRefs(internalRef, forwardedRef, onInputRef, null, undefined)}
      />
      <button onClick={() => internalRef.current?.focus()}>Focus search</button>
    </>
  );
});

test('allows internal and consumer refs to focus the input and clears them on unmount', async () => {
  const user = userEvent.setup();
  const consumerRef = React.createRef<HTMLInputElement>();
  const onInputRef = jest.fn();
  const { unmount } = render(
    <SearchInput ref={consumerRef} onInputRef={onInputRef} />,
  );
  const input = screen.getByRole('textbox', { name: 'Search' });
  expect(onInputRef).toHaveBeenLastCalledWith(input);
  await user.click(screen.getByRole('button', { name: 'Focus search' }));
  expect(input).toHaveFocus();

  input.blur();
  consumerRef.current?.focus();
  expect(input).toHaveFocus();
  unmount();
  expect(consumerRef.current).toBeNull();
  expect(onInputRef).toHaveBeenLastCalledWith(null);
});
