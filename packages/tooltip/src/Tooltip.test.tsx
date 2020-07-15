import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';

import { Tooltip } from '.';

test('Tooltip renders with content and children, and is displayed on mouse-over', async () => {
  const content = 'tooltipcontent';
  const children = 'Tooltip children';

  const { getByText, queryByText } = render(
    <Tooltip content={content} className="tester" placement="bottom">
      <span>{children}</span>
    </Tooltip>,
  );

  const tooltipdiv = getByText(children);

  expect(queryByText(content)).not.toBeInTheDocument();
  fireEvent.mouseOver(tooltipdiv);

  await waitFor(() => {
    expect(queryByText(content)).toBeInTheDocument();

    expect(getByText(content)).toHaveClass('tester');
    fireEvent.mouseLeave(getByText(children));
    expect(queryByText(content)).not.toBeInTheDocument();
  });
});
