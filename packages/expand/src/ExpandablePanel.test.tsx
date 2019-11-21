import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ExpandablePanel } from '.';

test('ExpandablePanel is rendered, clicked, and opened', () => {
  const { queryByText, getByRole } = render(
    <ExpandablePanel title="Some title">expanded content</ExpandablePanel>,
  );

  expect(queryByText('expanded content')).not.toBeInTheDocument();
  fireEvent.click(getByRole('button'));
  expect(queryByText('expanded content')).toBeInTheDocument();
});

test('You can even control them by passing open and onToggle props', () => {
  const spy = jest.fn();
  const { queryByText, getByRole, rerender } = render(
    <ExpandablePanel title="Some title" onToggle={spy} open={false}>
      expanded content
    </ExpandablePanel>,
  );

  expect(queryByText('expanded content')).not.toBeInTheDocument();
  expect(spy).not.toHaveBeenCalled();

  fireEvent.click(getByRole('button'));

  expect(spy).toHaveBeenCalled();
  rerender(
    <ExpandablePanel title="Some title" onToggle={spy} open={true}>
      expanded content
    </ExpandablePanel>,
  );

  expect(queryByText('expanded content')).toBeInTheDocument();
});
