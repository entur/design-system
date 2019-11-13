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
  const { queryByText, getByRole } = render(
    <ExpandablePanel title="Some title">expanded content</ExpandablePanel>,
  );

  expect(queryByText('expanded content')).not.toBeInTheDocument();
  fireEvent.click(getByRole('button'));
  expect(queryByText('expanded content')).toBeInTheDocument();
});

test('Controlled Expandable works properly', () => {
  const spy = jest.fn();
  const { queryByText, getByRole, rerender } = render(
    <ExpandablePanel title="Some title" onClick={spy} open={false}>
      expanded content
    </ExpandablePanel>,
  );

  expect(queryByText('expanded content')).not.toBeInTheDocument();
  expect(spy).not.toHaveBeenCalled();

  fireEvent.click(getByRole('button'));

  expect(spy).toHaveBeenCalled();
  rerender(
    <ExpandablePanel title="Some title" onClick={spy} open={true}>
      expanded content
    </ExpandablePanel>,
  );

  expect(queryByText('expanded content')).toBeInTheDocument();
});
