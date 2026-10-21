import { createRef, useState } from 'react';
import { render } from '@testing-library/react';
import { BaseExpand, ExpandableTextButton } from '.';
import {
  runAllTimers,
  setupUserWithFakeTimers,
  useFakeTimersInSuite,
} from '../../../tests/jest/fakeTimers';
import {
  expectCollapsed,
  expectExpanded,
} from '../../../tests/jest/disclosure';

useFakeTimersInSuite();

test('composes a custom disclosure without submitting its form or losing input state', async () => {
  const user = setupUserWithFakeTimers();
  const buttonRef = createRef<HTMLButtonElement>();
  const contentRef = createRef<HTMLDivElement>();
  const onSubmit = jest.fn(event => event.preventDefault());
  const onToggle = jest.fn();

  function Disclosure({ disabled = false }: { disabled?: boolean }) {
    const [open, setOpen] = useState(false);
    return (
      <form onSubmit={onSubmit}>
        <ExpandableTextButton
          ref={buttonRef}
          as="span"
          open={open}
          disabled={disabled}
          aria-controls="passenger-details"
          onToggle={() => {
            onToggle();
            setOpen(value => !value);
          }}
        >
          Passenger details
        </ExpandableTextButton>
        <BaseExpand
          ref={contentRef}
          open={open}
          id="passenger-details"
          role="region"
          aria-label="Passenger details"
        >
          <input aria-label="Passenger" />
        </BaseExpand>
      </form>
    );
  }

  const { getByRole, rerender } = render(<Disclosure />);
  const trigger = getByRole('button', { name: 'Passenger details' });
  expectCollapsed(contentRef.current!);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  buttonRef.current!.focus();
  expect(trigger).toHaveFocus();
  await user.keyboard('{Enter}');
  runAllTimers();
  const region = getByRole('region', { name: 'Passenger details' });
  expect(region).toHaveAttribute('id', trigger.getAttribute('aria-controls'));
  expectExpanded(contentRef.current!);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  const input = getByRole('textbox', { name: 'Passenger' });
  await user.type(input, 'Ada');
  await user.click(trigger);
  expectCollapsed(contentRef.current!);
  expect(input).toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await user.keyboard(' ');
  runAllTimers();
  expect(getByRole('textbox', { name: 'Passenger' })).toBe(input);
  expect(input).toHaveValue('Ada');
  expect(onToggle.mock.calls).toEqual([[], [], []]);
  expect(onSubmit).not.toHaveBeenCalled();
  rerender(<Disclosure disabled />);
  expect(trigger).toBeDisabled();
  await user.click(trigger);
  expect(onToggle).toHaveBeenCalledTimes(3);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
});
