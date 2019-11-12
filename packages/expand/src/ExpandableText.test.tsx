import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { ExpandableText } from '.';

test('ExpandableLink is rendered, clicked, and opened', () => {
  const children = 'This is the expanded content';
  const title = 'ExpandPanel Tittel';
  const testId = 'idForTestingExpandable';
  const { getByText, getByTestId } = render(
    <ExpandableText title={title} data-testid={testId}>
      {children}
    </ExpandableText>,
  );
  const expandable = getByTestId(testId);
  fireEvent.click(expandable.firstElementChild!);
  expect(getByText(children)).toContainHTML(children);
});

test('Controlled ExpandableLink works properly', () => {
  const children = 'This is the expanded content';
  const title = 'ExpandPanel Tittel';
  const spy = jest.fn();
  const testId = 'idForTestingControlledExpandable';
  const open = false;
  const { getByTestId } = render(
    <ExpandableText
      title={title}
      onToggle={spy}
      open={open}
      data-testid={testId}
    >
      {children}
    </ExpandableText>,
  );

  const expandable = getByTestId(testId);
  fireEvent.click(expandable.firstElementChild!);
  expect(spy).toHaveBeenCalledTimes(1);
});
