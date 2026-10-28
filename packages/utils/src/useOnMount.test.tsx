import React from 'react';
import { render } from '@testing-library/react';
import { useOnMount } from '.';

function Subscriber({ onSubscribe }: { onSubscribe: () => void }) {
  useOnMount(onSubscribe);
  return null;
}

test('runs once through StrictMode effect replay and callback changes, but again on a new mount', () => {
  const onSubscribe = jest.fn();
  const nextOnSubscribe = jest.fn();
  const { rerender, unmount } = render(
    <React.StrictMode>
      <Subscriber onSubscribe={onSubscribe} />
    </React.StrictMode>,
  );
  expect(onSubscribe).toHaveBeenCalledTimes(1);
  rerender(
    <React.StrictMode>
      <Subscriber onSubscribe={nextOnSubscribe} />
    </React.StrictMode>,
  );
  expect(nextOnSubscribe).not.toHaveBeenCalled();
  unmount();

  render(<Subscriber onSubscribe={nextOnSubscribe} />);
  expect(nextOnSubscribe).toHaveBeenCalledTimes(1);
});
