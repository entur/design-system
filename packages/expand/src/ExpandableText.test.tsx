import { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { ExpandableText } from '.';
import {
  runAllTimers,
  setupUserWithFakeTimers,
  useFakeTimersInSuite,
} from '../../../tests/jest/fakeTimers';
import { describeComponentContract } from '../../../tests/jest/componentContract';
import {
  expectCollapsed,
  expectExpanded,
  getControlledElement,
} from '../../../tests/jest/disclosure';

useFakeTimersInSuite();

test('ExpandableText opens and closes with the keyboard', async () => {
  const user = setupUserWithFakeTimers();
  const ref = createRef<HTMLDivElement>();
  const { getByText, getByRole } = render(
    <ExpandableText
      ref={ref}
      title="Some title"
      titleElement="Heading2"
      role="region"
      aria-label="Journey"
      tabIndex={-1}
    >
      expanded content
    </ExpandableText>,
  );

  // Default unmountOnClose=false: content in DOM but hidden from a11y
  const content = getByText('expanded content');
  expectCollapsed(content);

  const trigger = getByRole('button', { name: 'Some title' });
  expect(
    getByRole('heading', { name: 'Some title', level: 2 }),
  ).toBeInTheDocument();
  expect(getByRole('region', { name: 'Journey' })).toContainElement(trigger);
  ref.current!.focus();
  expect(getByRole('region', { name: 'Journey' })).toHaveFocus();
  const contentId = trigger.getAttribute('aria-controls')!;
  expect(getControlledElement(trigger)).toContainElement(content);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expectCollapsed(content);
  await user.tab();
  expect(trigger).toHaveFocus();
  await user.keyboard('{Enter}');
  runAllTimers();

  expectExpanded(content);
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  await user.keyboard(' ');
  expect(trigger).toHaveFocus();
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(trigger).toHaveAttribute('aria-controls', contentId);
  expectCollapsed(content);
});

test('You can control ExpandableText by passing open and onToggle props', async () => {
  const user = setupUserWithFakeTimers();
  const spy = jest.fn();
  const { getByText, getByRole, rerender } = render(
    <ExpandableText title="Some title" onToggle={spy} open={false}>
      expanded content
    </ExpandableText>,
  );

  const content = getByText('expanded content');
  expectCollapsed(content);
  expect(spy).not.toHaveBeenCalled();

  await user.click(getByRole('button', { name: 'Some title' }));

  // In controlled mode, clicking calls onToggle but doesn't change state
  expect(spy.mock.calls).toEqual([[]]);
  expect(getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  expectCollapsed(content);

  // Parent re-renders with open=true
  rerender(
    <ExpandableText title="Some title" onToggle={spy} open={true}>
      expanded content
    </ExpandableText>,
  );
  runAllTimers();

  expectExpanded(content);
  expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  expect(spy).toHaveBeenCalledTimes(1);
  await user.keyboard(' ');
  expect(spy.mock.calls).toEqual([[], []]);
  expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  rerender(
    <ExpandableText title="Some title" onToggle={spy} open={false}>
      expanded content
    </ExpandableText>,
  );
  expect(getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  expectCollapsed(content);
});

test('unmountOnClose=false preserves input state when closed and reopened', async () => {
  const user = setupUserWithFakeTimers();
  const { getByText, getByRole } = render(
    <ExpandableText title="Some title" unmountOnClose={false}>
      expanded content
      <input aria-label="Passenger" />
    </ExpandableText>,
  );

  const content = getByText('expanded content');
  expectCollapsed(content);

  await user.click(getByRole('button', { name: 'Some title' }));
  runAllTimers();

  expect(content).toBeInTheDocument();
  expectExpanded(content);
  const input = getByRole('textbox', { name: 'Passenger' });
  await user.type(input, 'Ada');
  await user.click(getByRole('button', { name: 'Some title' }));
  expect(input).toBeInTheDocument();
  expectCollapsed(content);
  await user.click(getByRole('button', { name: 'Some title' }));
  runAllTimers();
  expect(getByRole('textbox', { name: 'Passenger' })).toBe(input);
  expect(input).toHaveValue('Ada');
});

test('unmountOnClose=true unmounts content when closed', async () => {
  const user = setupUserWithFakeTimers();
  const { queryByText, getByRole } = render(
    <ExpandableText title="Some title" unmountOnClose disableAnimation>
      expanded content
    </ExpandableText>,
  );

  expect(queryByText('expanded content')).not.toBeInTheDocument();
  const trigger = getByRole('button', { name: 'Some title' });
  expect(trigger).not.toHaveAttribute('aria-controls');

  await user.click(trigger);
  runAllTimers();

  expect(queryByText('expanded content')).toBeInTheDocument();
  const contentId = trigger.getAttribute('aria-controls')!;
  expect(getControlledElement(trigger)).toContainElement(
    queryByText('expanded content'),
  );
  await user.click(trigger);
  expect(queryByText('expanded content')).not.toBeInTheDocument();
  expect(trigger).not.toHaveAttribute('aria-controls');
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  await user.click(trigger);
  runAllTimers();
  expect(queryByText('expanded content')).toBeInTheDocument();
  expect(trigger).toHaveAttribute('aria-controls', contentId);
});

test('defaultOpen initializes uncontrolled state and notifies only on activation', async () => {
  const user = setupUserWithFakeTimers();
  const onToggle = jest.fn();
  const { getByRole, rerender } = render(
    <ExpandableText title="Details" defaultOpen onToggle={onToggle}>
      Journey details
    </ExpandableText>,
  );
  const trigger = getByRole('button', { name: 'Details' });
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(onToggle).not.toHaveBeenCalled();
  await user.click(trigger);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(onToggle.mock.calls).toEqual([[]]);
  rerender(
    <ExpandableText title="Details" defaultOpen onToggle={onToggle}>
      Updated journey details
    </ExpandableText>,
  );
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
  expect(onToggle).toHaveBeenCalledTimes(1);
});

describeComponentContract('ExpandableText', {
  render: props => (
    <ExpandableText title="Details" {...props}>
      Journey details
    </ExpandableText>
  ),
  getElement: ({ container }) => container.firstElementChild as HTMLElement,
  baseClassName: 'eds-expandable-text',
  refElement: HTMLDivElement,
});

test('applies contentStyle to the content and the disable-animation modifier', () => {
  const { container } = render(
    <ExpandableText
      title="Details"
      contentStyle={{ marginTop: '7px' }}
      disableAnimation
    >
      Journey details
    </ExpandableText>,
  );
  expect(container.firstElementChild).toHaveClass(
    'eds-expandable-text--disable-animation',
  );
  expect(
    getControlledElement(screen.getByRole('button', { name: 'Details' })),
  ).toHaveStyle({ marginTop: '7px' });
});
