import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FloatingButton } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('a floating action is named and activates with mouse, Enter and Space', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <FloatingButton aria-label="Create journey" onClick={onClick}>
      <svg aria-hidden="true" />
      Create
    </FloatingButton>,
  );
  const button = screen.getByRole('button', { name: 'Create journey' });
  expect(button).toHaveTextContent('Create');

  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
  await user.click(button);
  expect(onClick).toHaveBeenCalledTimes(3);
});

test('disabled floating actions are skipped by keyboard and ignore clicks', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <FloatingButton aria-label="Create journey" onClick={onClick} disabled>
      <svg aria-hidden="true" />
    </FloatingButton>,
  );
  const button = screen.getByRole('button', { name: 'Create journey' });
  expect(button).toBeDisabled();
  await user.click(button);
  await user.tab();
  expect(button).not.toHaveFocus();
  await user.keyboard('{Enter} ');
  expect(onClick).not.toHaveBeenCalled();
});

test('floating buttons do not submit forms unless explicitly requested', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn(event => event.preventDefault());
  const onClick = jest.fn();
  render(
    <form onSubmit={onSubmit}>
      <FloatingButton aria-label="Preview" onClick={onClick}>
        <svg aria-hidden="true" />
      </FloatingButton>
      <FloatingButton aria-label="Save" type="submit" onClick={onClick}>
        <svg aria-hidden="true" />
      </FloatingButton>
    </form>,
  );

  await user.click(screen.getByRole('button', { name: 'Preview' }));
  expect(onClick).toHaveBeenCalledTimes(1);
  expect(onSubmit).not.toHaveBeenCalled();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(2);
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('extended content and size select their modifier classes', () => {
  const { rerender } = render(
    <FloatingButton aria-label="Create journey" onClick={jest.fn()}>
      <svg aria-hidden="true" />
    </FloatingButton>,
  );
  const button = screen.getByRole('button', { name: 'Create journey' });
  expect(button).toHaveClass('eds-floating-button');
  expect(button).not.toHaveClass(
    'eds-floating-button--extended',
    'eds-floating-button--small',
  );

  rerender(
    <FloatingButton
      aria-label="Create journey"
      onClick={jest.fn()}
      size="small"
    >
      <svg aria-hidden="true" />
      Create
    </FloatingButton>,
  );
  expect(button).toHaveClass(
    'eds-floating-button--extended',
    'eds-floating-button--small',
  );
});

describeComponentContract('FloatingButton', {
  render: props => (
    <FloatingButton aria-label="Create journey" onClick={jest.fn()} {...props}>
      <svg aria-hidden="true" />
    </FloatingButton>
  ),
  getElement: () => screen.getByRole('button', { name: 'Create journey' }),
  baseClassName: 'eds-floating-button',
});
