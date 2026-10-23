import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ButtonGroup, PrimaryButton, SecondaryButton } from '.';
import { describeComponentContract } from '../../../tests/jest/componentContract';

test('a named group preserves action order and skips disabled actions', async () => {
  const user = userEvent.setup();
  const onSave = jest.fn();
  const onDelete = jest.fn();
  const onCancel = jest.fn();
  render(
    <ButtonGroup as="fieldset">
      <legend>Ticket actions</legend>
      <PrimaryButton onClick={onSave}>Save</PrimaryButton>
      <SecondaryButton disabled onClick={onDelete}>
        Delete
      </SecondaryButton>
      <SecondaryButton onClick={onCancel}>Cancel</SecondaryButton>
    </ButtonGroup>,
  );
  const group = screen.getByRole('group', { name: 'Ticket actions' });
  const save = within(group).getByRole('button', { name: 'Save' });
  const cancel = within(group).getByRole('button', { name: 'Cancel' });

  await user.tab();
  expect(save).toHaveFocus();
  await user.keyboard('{Enter}');
  expect(onSave).toHaveBeenCalledTimes(1);
  await user.tab();
  expect(cancel).toHaveFocus();
  await user.keyboard(' ');
  expect(onCancel).toHaveBeenCalledTimes(1);
  expect(onDelete).not.toHaveBeenCalled();
});

describeComponentContract('ButtonGroup', {
  render: props => (
    <ButtonGroup {...props}>
      <PrimaryButton>Save</PrimaryButton>
    </ButtonGroup>
  ),
  getElement: () => screen.getByRole('button', { name: 'Save' }).parentElement!,
  baseClassName: 'eds-button-group',
  as: 'fieldset',
});
