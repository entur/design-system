import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IconButton } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('names the action, hides the decorative icon and supports mouse and keyboard', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <IconButton aria-label="Close" onClick={onClick}>
      <svg role="img" aria-label="Cross" />
    </IconButton>,
  );
  const button = screen.getByRole('button', { name: 'Close' });
  expect(screen.queryByRole('img', { name: 'Cross' })).not.toBeInTheDocument();

  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
  await user.click(button);
  expect(onClick).toHaveBeenCalledTimes(3);
});

test('icon links are named and activate with mouse and Enter', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <IconButton as="a" href="#tickets" aria-label="Tickets" onClick={onClick}>
      <svg />
    </IconButton>,
  );
  const link = screen.getByRole('link', { name: 'Tickets' });
  expect(link).toHaveAttribute('href', '#tickets');

  await user.tab();
  expect(link).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.click(link);
  expect(onClick).toHaveBeenCalledTimes(2);
});

test('a disabled loading icon button keeps its name without allowing activation', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  const { rerender } = render(
    <IconButton aria-label="Save" loading disabled onClick={onClick}>
      <svg />
    </IconButton>,
  );
  const button = screen.getByRole('button', { name: 'Save' });
  expect(button).toHaveAttribute('aria-busy', 'true');
  expect(button).toHaveAttribute('aria-disabled', 'true');
  expect(button).toBeDisabled();
  await user.click(button);
  await user.tab();
  expect(button).not.toHaveFocus();
  await user.keyboard('{Enter} ');
  expect(onClick).not.toHaveBeenCalled();

  rerender(
    <IconButton aria-label="Save" loading={false} onClick={onClick}>
      <svg />
    </IconButton>,
  );
  const enabledButton = screen.getByRole('button', { name: 'Save' });
  expect(enabledButton).toHaveAttribute('aria-busy', 'false');
  expect(enabledButton).toBeEnabled();
  await user.tab();
  expect(enabledButton).toHaveFocus();
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('icon buttons submit forms unless type is button', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn(event => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <IconButton type="button" aria-label="Preview">
        <svg />
      </IconButton>
      <IconButton aria-label="Save">
        <svg />
      </IconButton>
    </form>,
  );

  await user.click(screen.getByRole('button', { name: 'Preview' }));
  expect(onSubmit).not.toHaveBeenCalled();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('size and disabled select their modifier classes', () => {
  const { rerender } = render(
    <IconButton aria-label="Close">
      <svg />
    </IconButton>,
  );
  const button = screen.getByRole('button', { name: 'Close' });
  expect(button).toHaveClass('eds-icon-button', 'eds-icon-button--size-medium');
  expect(button).not.toHaveClass('eds-icon-button--disabled');

  rerender(
    <IconButton aria-label="Close" size="small" disabled>
      <svg />
    </IconButton>,
  );
  expect(screen.getByRole('button', { name: 'Close' })).toHaveClass(
    'eds-icon-button--size-small',
    'eds-icon-button--disabled',
  );
});

describeComponentContract('IconButton', {
  render: props => (
    <IconButton aria-label="Close" {...props}>
      <svg />
    </IconButton>
  ),
  getElement: () => screen.getByLabelText('Close'),
  baseClassName: 'eds-icon-button',
  refElement: HTMLButtonElement,
  as: 'a',
});
