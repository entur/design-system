import { createRef } from 'react';
import { render, screen } from '@testing-library/react';

import { ExpandablePanel } from '.';
import {
  runAllTimers,
  setupUserWithFakeTimers,
  useFakeTimersInSuite,
} from '../../../tests/jest/fakeTimers';
import {
  expectCollapsed,
  expectExpanded,
  getControlledElement,
} from '../../../tests/jest/disclosure';

useFakeTimersInSuite();

test('ExpandablePanel opens and closes with the keyboard', async () => {
  const user = setupUserWithFakeTimers();
  const { getByText, getByRole } = render(
    <ExpandablePanel title="Some title">expanded content</ExpandablePanel>,
  );

  // Default unmountOnClose=false: content in DOM but hidden from a11y
  const content = getByText('expanded content');
  expectCollapsed(content);

  const trigger = getByRole('button', { name: 'Some title' });
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

test('You can control ExpandablePanel by passing open and onToggle props', async () => {
  const user = setupUserWithFakeTimers();
  const spy = jest.fn();
  const { getByText, getByRole, rerender } = render(
    <ExpandablePanel title="Some title" onToggle={spy} open={false}>
      expanded content
    </ExpandablePanel>,
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
    <ExpandablePanel title="Some title" onToggle={spy} open={true}>
      expanded content
    </ExpandablePanel>,
  );
  runAllTimers();

  expectExpanded(content);
  expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  expect(spy).toHaveBeenCalledTimes(1);
  await user.keyboard(' ');
  expect(spy.mock.calls).toEqual([[], []]);
  expect(getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  rerender(
    <ExpandablePanel title="Some title" onToggle={spy} open={false}>
      expanded content
    </ExpandablePanel>,
  );
  expect(getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  expectCollapsed(content);
});

test('unmountOnClose=false preserves input state when closed and reopened', async () => {
  const user = setupUserWithFakeTimers();
  const { getByText, getByRole } = render(
    <ExpandablePanel title="Some title" unmountOnClose={false}>
      expanded content
      <input aria-label="Passenger" />
    </ExpandablePanel>,
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
    <ExpandablePanel title="Some title" unmountOnClose disableAnimation>
      expanded content
    </ExpandablePanel>,
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

test('keeps a default-open panel open while disabled and toggles once enabled', async () => {
  const user = setupUserWithFakeTimers();
  const onToggle = jest.fn();
  const onFocus = jest.fn();
  const { getByRole, rerender } = render(
    <ExpandablePanel
      title="Details"
      id="details"
      defaultOpen
      disabled
      onFocus={onFocus}
      onToggle={onToggle}
    >
      Journey details
    </ExpandablePanel>,
  );
  const trigger = getByRole('button', { name: 'Details' });
  expect(trigger).toHaveAttribute('aria-controls', 'details');
  expect(document.getElementById('details')).toHaveTextContent(
    'Journey details',
  );
  expect(trigger).toHaveAttribute('aria-expanded', 'true');
  expect(trigger).toBeDisabled();
  await user.click(trigger);
  expect(onToggle).not.toHaveBeenCalled();
  rerender(
    <ExpandablePanel title="Details" onFocus={onFocus} onToggle={onToggle}>
      Journey details
    </ExpandablePanel>,
  );
  await user.tab();
  expect(trigger).toHaveFocus();
  expect(onFocus).toHaveBeenCalledTimes(1);
  await user.keyboard('{Enter}');
  expect(onToggle.mock.calls).toEqual([[]]);
  expect(trigger).toHaveAttribute('aria-expanded', 'false');
});

test('splits consumer props between the panel and its trigger', () => {
  const ref = createRef<HTMLDivElement>();
  const { container } = render(
    <ExpandablePanel
      ref={ref}
      title="Details"
      className="consumer-class"
      data-consumer="value"
      contentStyle={{ marginTop: '7px' }}
      disableAnimation
    >
      Journey details
    </ExpandablePanel>,
  );
  const panel = container.firstElementChild;
  expect(ref.current).toBe(panel);
  expect(panel).toHaveClass(
    'eds-expandable-panel',
    'consumer-class',
    'eds-expandable-panel--disable-animation',
  );
  const trigger = screen.getByRole('button', { name: 'Details' });
  expect(trigger).toHaveAttribute('data-consumer', 'value');
  expect(getControlledElement(trigger)).toHaveStyle({ marginTop: '7px' });
});
