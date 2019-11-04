import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ExpandablePanel } from '.';
import { BaseExpand } from './BaseExpand';

test('BaseExpand works properly', () => {
  const children = 'This is the expanded content';
  const { getByText } = render(<BaseExpand open>{children}</BaseExpand>);
  expect(getByText(children)).toContainHTML(children);
});

test('Expandable is rendered, clicked, and opened', () => {
  const children = 'This is the expanded content';
  const title = 'ExpandPanel Tittel';
  const testId = 'idForTestingExpandable';
  const { getByText, getByTestId } = render(
    <ExpandablePanel title={title} data-testid={testId}>
      {children}
    </ExpandablePanel>,
  );
  const expandable = getByTestId(testId);
  fireEvent.click(expandable.firstElementChild!);
  expect(getByText(children)).toContainHTML(children);
});

test('Controlled Expandable works properly', () => {
  const children = 'This is the expanded content';
  const title = 'ExpandPanel Tittel';
  const spy = jest.fn();
  const testId = 'idForTestingControlledExpandable';
  const open = false;
  const { getByTestId } = render(
    <ExpandablePanel
      title={title}
      onToggle={spy}
      open={open}
      data-testid={testId}
    >
      {children}
    </ExpandablePanel>,
  );

  const expandable = getByTestId(testId);
  fireEvent.click(expandable.firstElementChild!);
  expect(spy).toHaveBeenCalledTimes(1);
});
