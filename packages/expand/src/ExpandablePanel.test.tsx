import { act, fireEvent, render } from '@testing-library/react';

import { ExpandablePanel } from '.';

jest.useFakeTimers();

afterEach(() => {
  jest.clearAllTimers();
});

afterAll(() => {
  jest.useRealTimers();
});

test('ExpandablePanel is rendered, clicked, and opened', () => {
  const { queryByText, getByRole } = render(
    <ExpandablePanel title="Some title">expanded content</ExpandablePanel>,
  );

  // Default unmountOnClose=false: content in DOM but hidden from a11y
  const content = queryByText('expanded content');
  expect(content).toBeInTheDocument();
  expect(content!.closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  fireEvent.click(getByRole('button'));
  act(() => {
    jest.runAllTimers();
  });

  expect(content!.closest('.eds-base-expand')).not.toHaveAttribute(
    'aria-hidden',
  );
});

test('You can control ExpandablePanel by passing open and onToggle props', () => {
  const spy = jest.fn();
  const { queryByText, getByRole, rerender } = render(
    <ExpandablePanel title="Some title" onToggle={spy} open={false}>
      expanded content
    </ExpandablePanel>,
  );

  const content = queryByText('expanded content');
  expect(content).toBeInTheDocument();
  expect(content!.closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );
  expect(spy).not.toHaveBeenCalled();

  fireEvent.click(getByRole('button'));

  // In controlled mode, clicking calls onToggle but doesn't change state
  expect(spy).toHaveBeenCalled();
  expect(content!.closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  // Parent re-renders with open=true
  rerender(
    <ExpandablePanel title="Some title" onToggle={spy} open={true}>
      expanded content
    </ExpandablePanel>,
  );
  act(() => {
    jest.runAllTimers();
  });

  expect(content!.closest('.eds-base-expand')).not.toHaveAttribute(
    'aria-hidden',
  );
});

test('unmountOnClose=false keeps content in DOM when closed', () => {
  const { queryByText, getByRole } = render(
    <ExpandablePanel title="Some title" unmountOnClose={false}>
      expanded content
    </ExpandablePanel>,
  );

  const content = queryByText('expanded content');
  expect(content).toBeInTheDocument();
  expect(content!.closest('.eds-base-expand')).toHaveAttribute(
    'aria-hidden',
    'true',
  );

  fireEvent.click(getByRole('button'));
  act(() => {
    jest.runAllTimers();
  });

  expect(content).toBeInTheDocument();
  expect(content!.closest('.eds-base-expand')).not.toHaveAttribute(
    'aria-hidden',
  );
});

test('unmountOnClose=true unmounts content when closed', () => {
  const { queryByText, getByRole } = render(
    <ExpandablePanel title="Some title" unmountOnClose>
      expanded content
    </ExpandablePanel>,
  );

  expect(queryByText('expanded content')).not.toBeInTheDocument();

  fireEvent.click(getByRole('button'));
  act(() => {
    jest.runAllTimers();
  });

  expect(queryByText('expanded content')).toBeInTheDocument();
});
