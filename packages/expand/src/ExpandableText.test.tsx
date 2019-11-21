import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import { ExpandableText } from '.';

test('Expandable is rendered, clicked, and opened', () => {
  const { queryByText, getByRole } = render(
    <ExpandableText title="Some title">expanded content</ExpandableText>,
  );

  expect(queryByText('expanded content')).not.toBeInTheDocument();
  fireEvent.click(getByRole('button'));
  expect(queryByText('expanded content')).toBeInTheDocument();
});
