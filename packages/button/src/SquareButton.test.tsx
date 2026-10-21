import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SecondarySquareButton, SuccessSquareButton } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('activates a labelled square button with mouse, Enter and Space', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <SecondarySquareButton onClick={onClick}>
      <svg aria-hidden="true" />
      Add
    </SecondarySquareButton>,
  );
  const button = screen.getByRole('button', { name: 'Add' });

  await user.tab();
  expect(button).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onClick).toHaveBeenCalledTimes(1);
  await user.keyboard(' ');
  expect(onClick).toHaveBeenCalledTimes(2);
  await user.click(button);
  expect(onClick).toHaveBeenCalledTimes(3);
});

test('square links retain their label and support mouse and keyboard activation', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  render(
    <SecondarySquareButton as="a" href="#tickets" onClick={onClick}>
      <svg aria-hidden="true" />
      Tickets
    </SecondarySquareButton>,
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

test('loading keeps the label and disabled square buttons cannot activate', async () => {
  const user = userEvent.setup();
  const onClick = jest.fn();
  const { rerender } = render(
    <SecondarySquareButton loading disabled onClick={onClick}>
      <svg aria-hidden="true" />
      Save
    </SecondarySquareButton>,
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
    <SecondarySquareButton loading={false} onClick={onClick}>
      <svg aria-hidden="true" />
      Save
    </SecondarySquareButton>,
  );
  expect(button).toHaveAttribute('aria-busy', 'false');
  expect(button).toHaveAccessibleName('Save');
  expect(button).toBeEnabled();
  await user.click(button);
  expect(onClick).toHaveBeenCalledTimes(1);
});

test('square buttons submit forms unless type is button', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn(event => event.preventDefault());
  render(
    <form onSubmit={onSubmit}>
      <SecondarySquareButton type="button">Preview</SecondarySquareButton>
      <SecondarySquareButton>Save</SecondarySquareButton>
    </form>,
  );

  await user.click(screen.getByRole('button', { name: 'Preview' }));
  expect(onSubmit).not.toHaveBeenCalled();
  await user.tab();
  expect(screen.getByRole('button', { name: 'Save' })).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onSubmit).toHaveBeenCalledTimes(1);
});

test('variant components and loading select their modifier classes', () => {
  render(
    <>
      <SecondarySquareButton>
        <svg aria-hidden="true" /> Add
      </SecondarySquareButton>
      <SuccessSquareButton loading>
        <svg aria-hidden="true" /> Save
      </SuccessSquareButton>
    </>,
  );
  const add = screen.getByRole('button', { name: 'Add' });
  expect(add).toHaveClass('eds-square-button', 'eds-square-button--secondary');
  expect(add).not.toHaveClass('eds-square-button--loading');
  expect(screen.getByRole('button', { name: 'Save' })).toHaveClass(
    'eds-square-button--success',
    'eds-square-button--loading',
  );
});

describeComponentContract('SecondarySquareButton', {
  render: props => (
    <SecondarySquareButton {...props}>
      <svg aria-hidden="true" /> Add
    </SecondarySquareButton>
  ),
  getElement: () => screen.getByText('Add').closest('.eds-square-button')!,
  baseClassName: 'eds-square-button',
  refElement: HTMLButtonElement,
  as: 'a',
});
