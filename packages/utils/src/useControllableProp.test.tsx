import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { UseControllablePropType, useControllableProp } from '.';

function Counter(props: UseControllablePropType<number>) {
  const [count, setCount] = useControllableProp(props);
  return (
    <button onClick={() => setCount(count + 1)}>{count} passengers</button>
  );
}

test('uses the default once and retains user changes across rerenders', async () => {
  const user = userEvent.setup();
  const { rerender } = render(<Counter defaultValue={2} />);
  await user.click(screen.getByRole('button', { name: '2 passengers' }));
  expect(screen.getByRole('button')).toHaveTextContent('3 passengers');

  rerender(<Counter defaultValue={8} />);
  expect(screen.getByRole('button')).toHaveTextContent('3 passengers');
  await user.click(screen.getByRole('button'));
  expect(screen.getByRole('button')).toHaveTextContent('4 passengers');
});

test('honors controlled zero, requests changes and uses the latest parent callback', async () => {
  const user = userEvent.setup();
  const updater = jest.fn();
  const nextUpdater = jest.fn();
  const { rerender } = render(
    <Counter prop={0} defaultValue={8} updater={updater} />,
  );
  await user.click(screen.getByRole('button', { name: '0 passengers' }));
  expect(updater).toHaveBeenCalledTimes(1);
  expect(updater).toHaveBeenCalledWith(1);
  expect(screen.getByRole('button')).toHaveTextContent('0 passengers');

  rerender(<Counter prop={1} defaultValue={8} updater={nextUpdater} />);
  await user.click(screen.getByRole('button', { name: '1 passengers' }));
  expect(nextUpdater).toHaveBeenCalledTimes(1);
  expect(nextUpdater).toHaveBeenCalledWith(2);
  expect(updater).toHaveBeenCalledTimes(1);
  expect(screen.getByRole('button')).toHaveTextContent('1 passengers');
});
